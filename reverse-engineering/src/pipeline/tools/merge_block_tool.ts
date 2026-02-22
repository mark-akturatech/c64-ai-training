// Merge Blocks Tool — merge two adjacent blocks

import type { AIToolHandler, ToolDefinition, ToolResult, ToolContext, ToolSideEffect } from "./types.js";

export class MergeBlocksTool implements AIToolHandler {
  name = "merge_blocks";

  definition: ToolDefinition = {
    name: "merge_blocks",
    description: "Merge two adjacent blocks into one. Only data+data or unknown+data blocks can be merged. Use when adjacent data blocks belong to the same table or structure.",
    parameters: {
      type: "object",
      properties: {
        address1: { type: "string", description: "Hex address of the first block" },
        address2: { type: "string", description: "Hex address of the second (adjacent) block" },
        reason: { type: "string", description: "Why these blocks should be merged" },
      },
      required: ["address1", "address2", "reason"],
    },
  };

  async handle(args: Record<string, unknown>, context: ToolContext): Promise<ToolResult> {
    const addr1Str = String(args.address1 ?? "").replace(/^\$/, "");
    const addr1 = parseInt(addr1Str, 16);
    const addr2Str = String(args.address2 ?? "").replace(/^\$/, "");
    const addr2 = parseInt(addr2Str, 16);
    const reason = String(args.reason ?? "AI-requested merge");

    const block1 = context.blockStore.getBlock(addr1);
    const block2 = context.blockStore.getBlock(addr2);

    if (!block1) return { content: `No block found at $${hex(addr1)}` };
    if (!block2) return { content: `No block found at $${hex(addr2)}` };

    // Guard: only merge data/unknown blocks
    const dataTypes = ["data", "unknown"];
    if (!dataTypes.includes(block1.type) || !dataTypes.includes(block2.type)) {
      return {
        content: `Cannot merge: both blocks must be data or unknown. Got ${block1.type} and ${block2.type}`,
      };
    }

    // Adjacency check
    const [first, second] = block1.address < block2.address ? [block1, block2] : [block2, block1];
    if (first.endAddress !== second.address) {
      return {
        content: `Blocks are not adjacent: $${hex(first.address)}-$${hex(first.endAddress)} and $${hex(second.address)}-$${hex(second.endAddress)}`,
      };
    }

    try {
      // Look up graph nodes before merge
      const nodeId1 = blockToNodeId(block1);
      const nodeId2 = blockToNodeId(block2);

      context.blockStore.merge(addr1, addr2, reason);

      // Update graph
      const mergedBlock = context.blockStore.findBlockContaining(Math.min(addr1, addr2));
      if (mergedBlock && context.graph.getNode(nodeId1) && context.graph.getNode(nodeId2)) {
        context.graph.mergeNodes(nodeId1, nodeId2, blockToNodeId(mergedBlock));
      }
    } catch (e: unknown) {
      return { content: `Merge failed: ${e instanceof Error ? e.message : String(e)}` };
    }

    const mergedBlock = context.blockStore.findBlockContaining(Math.min(addr1, addr2));
    const newSize = mergedBlock ? mergedBlock.endAddress - mergedBlock.address : 0;

    const sideEffects: ToolSideEffect[] = [{
      type: "merge",
      details: { address1: addr1, address2: addr2, reason },
    }];

    return {
      content: `Merged $${hex(addr1)} + $${hex(addr2)} → $${hex(Math.min(addr1, addr2))} (${newSize} bytes). ${reason}`,
      sideEffects,
    };
  }
}

function blockToNodeId(block: { address: number; type: string }): string {
  const type = block.type === "data" || block.type === "unknown" ? "data" : "code";
  return `${type}_${block.address.toString(16).padStart(4, "0")}`;
}

function hex(addr: number): string {
  return addr.toString(16).toUpperCase().padStart(4, "0");
}
