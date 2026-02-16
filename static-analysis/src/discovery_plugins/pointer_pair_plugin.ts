import type { DecodedInstruction } from "../types.js";
import type { DiscoveryPlugin, WalkContext, PluginResult } from "./types.js";

export class PointerPairPlugin implements DiscoveryPlugin {
  name = "pointer_pair";
  description = "Detects 16-bit pointer construction: LDA #<addr / STA $FB / LDA #>addr / STA $FC";
  priority = 40;
  phase = "node" as const;

  onNodeComplete(node: import("../types.js").TreeNode, ctx: WalkContext): PluginResult | null {
    if (!node.instructions || node.instructions.length < 4) return null;

    const results: PluginResult = {
      newEdges: [],
      newNodes: [],
    };

    const insts = node.instructions;

    for (let i = 0; i < insts.length - 3; i++) {
      // Pattern: LDA #lo / STA zpLo / LDA #hi / STA zpHi
      const i0 = insts[i];
      const i1 = insts[i + 1];
      const i2 = insts[i + 2];
      const i3 = insts[i + 3];

      if (
        i0.info.mnemonic === "lda" &&
        i0.info.addressingMode === "immediate" &&
        i1.info.mnemonic === "sta" &&
        i1.info.addressingMode === "zero_page" &&
        i2.info.mnemonic === "lda" &&
        i2.info.addressingMode === "immediate" &&
        i3.info.mnemonic === "sta" &&
        i3.info.addressingMode === "zero_page"
      ) {
        const zpLo = i1.operandAddress!;
        const zpHi = i3.operandAddress!;

        // Check that ZP addresses are consecutive (lo, lo+1)
        if (zpHi !== ((zpLo + 1) & 0xFF)) continue;

        const loVal = i0.operandValue!;
        const hiVal = i2.operandValue!;
        const fullAddr = loVal | (hiVal << 8);

        // Skip if target is in ROM or hardware range
        if (fullAddr >= 0xE000 && ctx.bankingState.kernalRomVisible) continue;
        if (fullAddr >= 0xD000 && fullAddr < 0xE000) continue;

        results.newEdges!.push({
          from: node.start,
          edge: {
            target: fullAddr,
            type: "pointer_ref",
            sourceInstruction: i0.address,
            confidence: 85,
            discoveredBy: this.name,
            metadata: { zpPair: [zpLo, zpHi] },
          },
        });

        // Create data node if not visited
        if (!ctx.tree.isVisited(fullAddr)) {
          results.newNodes!.push({
            id: `data_${fullAddr.toString(16).padStart(4, "0")}`,
            type: "data",
            start: fullAddr,
            end: fullAddr + 1,  // size unknown
            endConfidence: 20,
            discoveredBy: this.name,
          });
        }
      }
    }

    return results.newEdges!.length > 0 ? results : null;
  }
}
