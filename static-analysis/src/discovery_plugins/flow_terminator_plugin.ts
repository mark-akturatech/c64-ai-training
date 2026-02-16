import type { DecodedInstruction } from "../types.js";
import type { DiscoveryPlugin, WalkContext, PluginResult } from "./types.js";

export class FlowTerminatorPlugin implements DiscoveryPlugin {
  name = "flow_terminator";
  description = "Detects RTS, RTI, BRK, and JAM/KIL opcodes that end execution flow";
  priority = 15;
  phase = "instruction" as const;

  onInstruction(inst: DecodedInstruction, ctx: WalkContext): PluginResult | null {
    if (inst.info.flowType === "return") {
      ctx.currentNode.endConfidence = 100;
      return { endNode: true };
    }

    if (inst.info.flowType === "halt") {
      ctx.currentNode.endConfidence = 100;
      if (inst.info.undocumented) {
        // JAM/KIL — flag as possibly garbage (data misinterpreted as code)
        ctx.currentNode.metadata.possibleGarbage = true;
      }
      return { endNode: true };
    }

    return null;
  }
}
