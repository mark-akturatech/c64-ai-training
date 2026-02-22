// Split Block Tool — split a block at a given address

import type { AIToolHandler, ToolDefinition, ToolResult, ToolContext, ToolSideEffect } from "./types.js";

export class SplitBlockTool implements AIToolHandler {
  name = "split_block";

  definition: ToolDefinition = {
    name: "split_block",
    description: "Split a block into two at a given address. Use when you discover that a block contains logically separate code/data sections.",
    parameters: {
      type: "object",
      properties: {
        address: { type: "string", description: "Hex address of the block to split" },
        split_at: { type: "string", description: "Hex address where the split should occur (becomes start of second block)" },
        reason: { type: "string", description: "Why the block should be split" },
      },
      required: ["address", "split_at", "reason"],
    },
  };

  async handle(args: Record<string, unknown>, context: ToolContext): Promise<ToolResult> {
    const addrStr = String(args.address ?? "").replace(/^\$/, "");
    const addr = parseInt(addrStr, 16);
    const splitAtStr = String(args.split_at ?? "").replace(/^\$/, "");
    const splitAt = parseInt(splitAtStr, 16);
    const reason = String(args.reason ?? "AI-requested split");

    const block = context.blockStore.getBlock(addr);
    if (!block) {
      return { content: `No block found at $${hex(addr)}` };
    }

    if (splitAt <= block.address || splitAt >= block.endAddress) {
      return {
        content: `Split address $${hex(splitAt)} is not within block $${hex(block.address)}-$${hex(block.endAddress)}`,
      };
    }

    // Minimum block size check
    if (splitAt - block.address < 2 || block.endAddress - splitAt < 2) {
      return { content: `Split would create a block smaller than 2 bytes` };
    }

    try {
      context.blockStore.split(addr, splitAt, reason);
    } catch (e: unknown) {
      return { content: `Split failed: ${e instanceof Error ? e.message : String(e)}` };
    }

    // Update graph if the block has a node
    const type = block.type === "data" || block.type === "unknown" ? "data" : "code";
    const nodeId = `${type}_${block.address.toString(16).padStart(4, "0")}`;
    const node = context.graph.getNode(nodeId);
    if (node) {
      const newId1 = `${type}_${block.address.toString(16).padStart(4, "0")}`;
      const newId2 = `${type}_${splitAt.toString(16).padStart(4, "0")}`;
      context.graph.splitNode(nodeId, splitAt, [newId1, newId2]);
    }

    const sideEffects: ToolSideEffect[] = [{
      type: "split",
      details: { address: addr, splitAt, reason },
    }];

    return {
      content: `Split $${hex(addr)} at $${hex(splitAt)}: block1=$${hex(addr)}-$${hex(splitAt)}, block2=$${hex(splitAt)}-$${hex(block.endAddress)}. ${reason}`,
      sideEffects,
    };
  }
}

function hex(addr: number): string {
  return addr.toString(16).toUpperCase().padStart(4, "0");
}
