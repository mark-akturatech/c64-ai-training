import type { DecodedInstruction } from "../types.js";
import type { DiscoveryPlugin, WalkContext, PluginResult } from "./types.js";

export class RtsDispatchPlugin implements DiscoveryPlugin {
  name = "rts_dispatch_detector";
  description = "Detects PHA/PHA/RTS dispatch pattern used for computed jumps";
  priority = 50;
  phase = "node" as const;

  onNodeComplete(node: import("../types.js").TreeNode, ctx: WalkContext): PluginResult | null {
    if (!node.instructions || node.instructions.length < 3) return null;

    const insts = node.instructions;

    // Look for the pattern: push hi byte, push lo byte, RTS
    // Common patterns:
    //   LDA table_hi,X / PHA / LDA table_lo,X / PHA / RTS
    //   or: LDA #hi / PHA / LDA #lo / PHA / RTS

    for (let i = 0; i < insts.length - 2; i++) {
      // Find PHA/PHA/RTS (or PHA/PHA with RTS at end)
      if (
        insts[i].info.mnemonic === "pha" &&
        insts[i + 1] !== undefined
      ) {
        // Look for second PHA before RTS
        let j = i + 1;
        // Skip a possible LDA between PHAs
        if (
          j < insts.length &&
          insts[j].info.mnemonic === "lda"
        ) {
          j++;
        }
        if (j >= insts.length) continue;
        if (insts[j].info.mnemonic !== "pha") continue;

        // Check for RTS after second PHA
        const rtsIdx = j + 1;
        if (rtsIdx >= insts.length) continue;
        if (insts[rtsIdx].info.mnemonic !== "rts") continue;

        // Found PHA/.../PHA/RTS pattern
        // Try to find the table addresses from preceding LDA indexed
        const result: PluginResult = {
          newEdges: [],
          newTargets: [],
        };

        // Look backwards from first PHA for table loads
        // LDA table,X pattern
        for (let k = Math.max(0, i - 4); k < i; k++) {
          const ldaInst = insts[k];
          if (
            ldaInst.info.mnemonic === "lda" &&
            (ldaInst.info.addressingMode === "absolute_x" ||
              ldaInst.info.addressingMode === "absolute_y")
          ) {
            const tableAddr = ldaInst.operandAddress!;
            ctx.currentNode.metadata.rtsDispatch = {
              tableAddress: tableAddr,
              patternAt: insts[i].address,
            };

            // Try to read table entries and discover targets
            // RTS pushes addr-1, so actual target = (hi<<8|lo) + 1
            // We need both hi and lo tables — for now just flag it
            result.newEdges!.push({
              from: node.start,
              edge: {
                target: tableAddr,
                type: "data_read",
                sourceInstruction: ldaInst.address,
                confidence: 85,
                discoveredBy: this.name,
                metadata: { isDispatchTable: true },
              },
            });
          }
        }

        if (result.newEdges!.length > 0) return result;
      }
    }

    return null;
  }
}
