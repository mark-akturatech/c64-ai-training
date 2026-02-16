import type { DecodedInstruction, EdgeType } from "../types.js";
import type { DiscoveryPlugin, WalkContext, PluginResult } from "./types.js";

export class XrefEnricherPlugin implements DiscoveryPlugin {
  name = "xref_enricher";
  description = "Enriches edges with hardware register info, comparison tracking, KERNAL call context";
  priority = 45;
  phase = "instruction" as const;

  onInstruction(inst: DecodedInstruction, ctx: WalkContext): PluginResult | null {
    // Track CMP/CPX/CPY immediate values — useful for AI context
    if (
      (inst.info.mnemonic === "cmp" ||
        inst.info.mnemonic === "cpx" ||
        inst.info.mnemonic === "cpy") &&
      inst.info.addressingMode === "immediate"
    ) {
      const compValue = inst.operandValue!;
      if (!ctx.currentNode.metadata.comparisons) {
        ctx.currentNode.metadata.comparisons = [];
      }
      (ctx.currentNode.metadata.comparisons as Array<{ address: number; register: string; value: number }>).push({
        address: inst.address,
        register: inst.info.mnemonic === "cmp" ? "A" : inst.info.mnemonic === "cpx" ? "X" : "Y",
        value: compValue,
      });
      return null;
    }

    // Track BIT instruction targets
    if (inst.info.mnemonic === "bit") {
      const targetAddr = inst.operandAddress;
      if (targetAddr !== undefined && targetAddr >= 0xD000 && targetAddr < 0xE000) {
        return {
          newEdges: [
            {
              from: ctx.currentNode.start,
              edge: {
                target: targetAddr,
                type: "hardware_read",
                sourceInstruction: inst.address,
                confidence: 100,
                discoveredBy: this.name,
                metadata: { operation: "bit_test" },
              },
            },
          ],
        };
      }
    }

    return null;
  }
}
