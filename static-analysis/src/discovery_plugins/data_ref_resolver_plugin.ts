import type { DecodedInstruction, EdgeType } from "../types.js";
import type { DiscoveryPlugin, WalkContext, PluginResult } from "./types.js";

const HW_RANGE_START = 0xD000;
const HW_RANGE_END = 0xE000;

export class DataRefResolverPlugin implements DiscoveryPlugin {
  name = "data_ref_resolver";
  description = "Creates data nodes from absolute addressing (LDA/STA $xxxx)";
  priority = 20;
  phase = "instruction" as const;

  onInstruction(inst: DecodedInstruction, ctx: WalkContext): PluginResult | null {
    const mode = inst.info.addressingMode;

    // Only care about absolute addressing modes that reference memory
    if (
      mode !== "absolute" &&
      mode !== "absolute_x" &&
      mode !== "absolute_y"
    ) {
      return null;
    }

    // Skip control flow instructions (handled by other plugins)
    if (inst.info.flowType !== "sequential") return null;

    const targetAddr = inst.operandAddress;
    if (targetAddr === undefined) return null;

    // Skip ROM addresses
    if (targetAddr >= 0xE000 && ctx.bankingState.kernalRomVisible) return null;
    if (targetAddr >= 0xA000 && targetAddr < 0xC000 && ctx.bankingState.basicRomVisible) return null;

    // Determine edge type
    let edgeType: EdgeType;
    if (targetAddr >= HW_RANGE_START && targetAddr < HW_RANGE_END && ctx.bankingState.ioVisible) {
      edgeType = inst.info.readTarget ? "hardware_read" : "hardware_write";
    } else if (inst.info.writeTarget && !inst.info.readTarget) {
      edgeType = "data_write";
    } else {
      edgeType = "data_read";
    }

    const result: PluginResult = {
      newEdges: [
        {
          from: ctx.currentNode.start,
          edge: {
            target: targetAddr,
            type: edgeType,
            sourceInstruction: inst.address,
            confidence: 100,
            discoveredBy: this.name,
          },
        },
      ],
    };

    // For non-hardware data references, create a data node if not already tracked
    if (!edgeType.startsWith("hardware") && !ctx.tree.isVisited(targetAddr)) {
      // Estimate data size: single byte for simple load/store,
      // but indexed modes suggest tables
      const size = (mode === "absolute_x" || mode === "absolute_y") ? 1 : 1;

      result.newNodes = [
        {
          id: `data_${targetAddr.toString(16).padStart(4, "0")}`,
          type: "data",
          start: targetAddr,
          end: targetAddr + size,
          endConfidence: 30,  // single byte reference — size uncertain
          discoveredBy: this.name,
        },
      ];
    }

    return result;
  }
}
