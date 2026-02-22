// ============================================================================
// Tool Handler Registry — static imports for all AI tool handlers
// ============================================================================

import type { AIToolHandler } from "./types.js";

import { ReadMemoryTool } from "./read_memory_tool.js";
import { ReadBlockTool } from "./read_block_tool.js";
import { FindReferencesTool } from "./find_references_tool.js";
import { ReclassifyBlockTool } from "./reclassify_block_tool.js";
import { TraceDataUsageTool } from "./trace_data_usage_tool.js";
import { DecodeDataFormatTool } from "./decode_data_format_tool.js";
import { SearchKnowledgeBaseTool } from "./search_knowledge_base_tool.js";
import { SearchSimilarBlocksTool } from "./search_similar_blocks_tool.js";
import { SplitBlockTool } from "./split_block_tool.js";
import { MergeBlocksTool } from "./merge_block_tool.js";

export function createAllToolHandlers(): AIToolHandler[] {
  return [
    new ReadMemoryTool(),
    new ReadBlockTool(),
    new FindReferencesTool(),
    new ReclassifyBlockTool(),
    new SplitBlockTool(),
    new MergeBlocksTool(),
    new TraceDataUsageTool(),
    new DecodeDataFormatTool(),
    new SearchKnowledgeBaseTool(),
    new SearchSimilarBlocksTool(),
  ];
}

/**
 * Convert tool handlers to OpenAI function definitions.
 */
export function toolsToOpenAIFormat(handlers: AIToolHandler[]): Array<{
  type: "function";
  function: { name: string; description: string; parameters: Record<string, unknown> };
}> {
  return handlers.map(h => ({
    type: "function" as const,
    function: {
      name: h.definition.name,
      description: h.definition.description,
      parameters: h.definition.parameters,
    },
  }));
}
