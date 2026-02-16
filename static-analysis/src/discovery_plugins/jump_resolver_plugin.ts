import type { DecodedInstruction } from "../types.js";
import type { DiscoveryPlugin, WalkContext, PluginResult } from "./types.js";

export class JumpResolverPlugin implements DiscoveryPlugin {
  name = "jump_resolver";
  description = "Handles JMP absolute and JSR";
  priority = 10;
  phase = "instruction" as const;

  onInstruction(inst: DecodedInstruction, ctx: WalkContext): PluginResult | null {
    if (inst.info.flowType === "jump" && inst.info.addressingMode === "absolute") {
      ctx.currentNode.endConfidence = 100;
      return {
        endNode: true,
        newTargets: [inst.operandAddress!],
        newEdges: [
          {
            from: ctx.currentNode.start,
            edge: {
              target: inst.operandAddress!,
              type: "jump",
              sourceInstruction: inst.address,
              confidence: 100,
              discoveredBy: this.name,
            },
          },
        ],
      };
    }

    if (inst.info.flowType === "call") {
      const target = inst.operandAddress!;
      const isROM = isROMAddress(target, ctx.bankingState);

      return {
        newTargets: isROM ? [] : [target],
        newEdges: [
          {
            from: ctx.currentNode.start,
            edge: {
              target,
              type: "call",
              sourceInstruction: inst.address,
              confidence: 100,
              discoveredBy: this.name,
            },
          },
        ],
      };
    }

    return null;
  }
}

function isROMAddress(addr: number, banking: { kernalRomVisible: boolean; basicRomVisible: boolean }): boolean {
  if (addr >= 0xE000 && banking.kernalRomVisible) return true;
  if (addr >= 0xA000 && addr < 0xC000 && banking.basicRomVisible) return true;
  return false;
}
