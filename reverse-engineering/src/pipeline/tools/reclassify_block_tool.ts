// Reclassify Block Tool — change block type (triggers tree update)

import type { AIToolHandler, ToolDefinition, ToolResult, ToolContext, ToolSideEffect } from "./types.js";
import type { BlockType } from "@c64/shared";

const VALID_TYPES: BlockType[] = ["subroutine", "irq_handler", "fragment", "data", "unknown"];

export class ReclassifyBlockTool implements AIToolHandler {
  name = "reclassify_block";

  definition: ToolDefinition = {
    name: "reclassify_block",
    description: "Reclassify a block to a different type (e.g. data → subroutine). Use when you discover the block is misclassified.",
    parameters: {
      type: "object",
      properties: {
        address: { type: "string", description: "Hex address of the block" },
        new_type: { type: "string", enum: VALID_TYPES, description: "New block type" },
        reason: { type: "string", description: "Why this reclassification is needed" },
      },
      required: ["address", "new_type", "reason"],
    },
  };

  async handle(args: Record<string, unknown>, context: ToolContext): Promise<ToolResult> {
    const addrStr = String(args.address ?? "").replace(/^\$/, "");
    const addr = parseInt(addrStr, 16);
    const newType = String(args.new_type) as BlockType;
    const reason = String(args.reason ?? "AI reclassification");

    if (!VALID_TYPES.includes(newType)) {
      return { content: `Invalid block type: ${newType}. Valid types: ${VALID_TYPES.join(", ")}` };
    }

    const block = context.blockStore.getBlock(addr);
    if (!block) {
      return { content: `No block found at $${hex(addr)}` };
    }

    const oldType = block.type;
    context.blockStore.reclassify(addr, newType, reason);

    const sideEffects: ToolSideEffect[] = [{
      type: "reclassify",
      details: { address: addr, from: oldType, to: newType, reason },
    }];

    return {
      content: `Reclassified $${hex(addr)} from ${oldType} to ${newType}: ${reason}`,
      sideEffects,
    };
  }
}

function hex(addr: number): string {
  return addr.toString(16).toUpperCase().padStart(4, "0");
}
