import type { DecodedInstruction } from "../types.js";
import type { DiscoveryPlugin, WalkContext, PluginResult } from "./types.js";

export class BranchResolverPlugin implements DiscoveryPlugin {
  name = "branch_resolver";
  description = "Handles conditional branches: BNE, BEQ, BCC, BCS, BPL, BMI, BVC, BVS";
  priority = 10;
  phase = "instruction" as const;

  onInstruction(inst: DecodedInstruction, ctx: WalkContext): PluginResult | null {
    if (inst.info.flowType !== "branch") return null;

    const branchTarget = inst.operandAddress!;
    const fallthrough = inst.address + inst.info.bytes;
    ctx.currentNode.endConfidence = 100;

    return {
      endNode: true,
      newTargets: [branchTarget, fallthrough],
      newEdges: [
        {
          from: ctx.currentNode.start,
          edge: {
            target: branchTarget,
            type: "branch",
            sourceInstruction: inst.address,
            confidence: 100,
            discoveredBy: this.name,
          },
        },
        {
          from: ctx.currentNode.start,
          edge: {
            target: fallthrough,
            type: "fallthrough",
            sourceInstruction: inst.address,
            confidence: 100,
            discoveredBy: this.name,
          },
        },
      ],
    };
  }
}
