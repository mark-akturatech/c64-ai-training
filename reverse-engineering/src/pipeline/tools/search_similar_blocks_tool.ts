// Search Similar Blocks Tool — search project collection for similar blocks

import type { AIToolHandler, ToolDefinition, ToolResult, ToolContext } from "./types.js";

export class SearchSimilarBlocksTool implements AIToolHandler {
  name = "search_similar_blocks";

  definition: ToolDefinition = {
    name: "search_similar_blocks",
    description: "Search for similar blocks in the project that have already been analyzed. Useful for finding patterns.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Description of what you're looking for (e.g. 'sprite animation loop')" },
        hardware_refs: {
          type: "array",
          items: { type: "string" },
          description: "Hardware register addresses used (e.g. ['$D000', '$D015'])",
          default: [],
        },
        limit: { type: "number", description: "Max results (default 5)", default: 5 },
      },
      required: ["query"],
    },
  };

  async handle(args: Record<string, unknown>, context: ToolContext): Promise<ToolResult> {
    const query = String(args.query ?? "");
    const hardwareRefs = (args.hardware_refs as string[] | undefined) ?? [];
    const limit = Number(args.limit ?? 5);

    const results = await context.projectCollection.searchSimilar(query, hardwareRefs, limit);

    if (results.length === 0) {
      return { content: `No similar blocks found for: ${query}` };
    }

    const lines: string[] = [`Similar blocks for "${query}" (${results.length}):`];
    for (const r of results) {
      lines.push(`  ${r.blockId} [${r.category}] (score: ${r.score.toFixed(2)}): ${r.purpose}`);
    }

    return { content: lines.join("\n") };
  }
}
