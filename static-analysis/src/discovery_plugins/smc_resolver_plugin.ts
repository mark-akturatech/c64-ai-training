import type { DecodedInstruction } from "../types.js";
import type { DiscoveryPlugin, WalkContext, PluginResult } from "./types.js";

export class SmcResolverPlugin implements DiscoveryPlugin {
  name = "smc_resolver";
  description = "Detects self-modifying code: STA/STX/STY into code regions";
  priority = 30;
  phase = "instruction" as const;

  onInstruction(inst: DecodedInstruction, ctx: WalkContext): PluginResult | null {
    // Only care about store instructions to absolute addresses
    if (!inst.info.writeTarget) return null;
    if (inst.info.addressingMode !== "absolute") return null;
    if (inst.info.flowType !== "sequential") return null;

    const targetAddr = inst.operandAddress;
    if (targetAddr === undefined) return null;

    // Check if the target is in a known code region
    const targetNode = ctx.tree.findNodeContaining(targetAddr);
    if (!targetNode || targetNode.type !== "code") return null;

    // This is SMC — a store into existing code
    return {
      newEdges: [
        {
          from: ctx.currentNode.start,
          edge: {
            target: targetAddr,
            type: "smc_write",
            sourceInstruction: inst.address,
            confidence: 90,
            discoveredBy: this.name,
            metadata: {
              modifiedNode: targetNode.id,
            },
          },
        },
      ],
      nodeUpdates: [
        {
          address: targetNode.start,
          updates: {
            metadata: {
              ...targetNode.metadata,
              hasSMC: true,
              smcWriters: [
                ...((targetNode.metadata.smcWriters as number[]) || []),
                inst.address,
              ],
            },
          },
        },
      ],
    };
  }
}
