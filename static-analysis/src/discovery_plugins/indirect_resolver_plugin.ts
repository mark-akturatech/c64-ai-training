import type { DecodedInstruction } from "../types.js";
import type { DiscoveryPlugin, WalkContext, PluginResult } from "./types.js";

export class IndirectResolverPlugin implements DiscoveryPlugin {
  name = "indirect_resolver";
  description = "Handles indirect addressing: (zp),Y, (zp,X), JMP ($xxxx)";
  priority = 30;
  phase = "instruction" as const;

  onInstruction(inst: DecodedInstruction, ctx: WalkContext): PluginResult | null {
    // JMP ($xxxx) — indirect jump
    if (inst.info.flowType === "jump" && inst.info.addressingMode === "indirect") {
      const pointerAddr = inst.operandValue!;
      ctx.currentNode.endConfidence = 100;

      const result: PluginResult = {
        endNode: true,
        newEdges: [
          {
            from: ctx.currentNode.start,
            edge: {
              target: inst.operandAddress!, // resolved target
              type: "indirect_jump",
              sourceInstruction: inst.address,
              confidence: 60,  // pointer could be modified at runtime
              discoveredBy: this.name,
              metadata: { pointerAddress: pointerAddr },
            },
          },
        ],
      };

      // Create data node for the pointer location
      if (!ctx.tree.isVisited(pointerAddr)) {
        result.newNodes = [
          {
            id: `data_${pointerAddr.toString(16).padStart(4, "0")}`,
            type: "data",
            start: pointerAddr,
            end: pointerAddr + 2,  // 16-bit pointer
            endConfidence: 90,
            discoveredBy: this.name,
            metadata: { isPointer: true },
          },
        ];
      }

      // Queue the resolved target
      if (inst.operandAddress !== undefined) {
        result.newTargets = [inst.operandAddress];
      }

      return result;
    }

    // (zp),Y and (zp,X) — create data_read/data_write edges
    if (
      inst.info.addressingMode === "indirect_y" ||
      inst.info.addressingMode === "indirect_x"
    ) {
      if (inst.info.flowType !== "sequential") return null;

      const zpAddr = inst.operandValue!;

      // Read the 16-bit pointer from zero page
      const ptrLo = ctx.memory[zpAddr];
      const ptrHi = ctx.memory[(zpAddr + 1) & 0xFF];
      const dataAddr = ptrLo | (ptrHi << 8);

      // This is a static snapshot — the ZP pointer may have been modified
      // Only create edges, not data nodes, since the pointer is dynamic
      const edgeType = inst.info.writeTarget ? "data_write" : "data_read";

      return {
        newEdges: [
          {
            from: ctx.currentNode.start,
            edge: {
              target: dataAddr,
              type: edgeType,
              sourceInstruction: inst.address,
              confidence: 40,  // pointer is often dynamic
              discoveredBy: this.name,
              metadata: {
                zpPointer: zpAddr,
                addressingMode: inst.info.addressingMode,
              },
            },
          },
        ],
      };
    }

    return null;
  }
}
