// Search Knowledge Base Tool — query Qdrant knowledge base

import type { AIToolHandler, ToolDefinition, ToolResult, ToolContext } from "./types.js";

export class SearchKnowledgeBaseTool implements AIToolHandler {
  name = "search_knowledge_base";

  definition: ToolDefinition = {
    name: "search_knowledge_base",
    description: "Search the C64/6502 knowledge base for documentation on hardware, KERNAL routines, techniques, etc.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Natural language query (e.g. 'sprite multiplexer technique')" },
        limit: { type: "number", description: "Max results (default 5)", default: 5 },
      },
      required: ["query"],
    },
  };

  async handle(args: Record<string, unknown>, context: ToolContext): Promise<ToolResult> {
    const query = String(args.query ?? "");
    const limit = Number(args.limit ?? 5);

    if (!query) {
      return { content: "Empty query" };
    }

    const hits = await context.searchKnowledgeBase(query, limit);

    if (hits.length === 0) {
      return { content: `No knowledge base results for: ${query}` };
    }

    const lines: string[] = [`Knowledge base results for "${query}" (${hits.length}):`];
    for (const hit of hits) {
      lines.push(`\n--- Score: ${hit.score.toFixed(3)} ---`);
      const content = hit.content.length > 400 ? hit.content.slice(0, 400) + "..." : hit.content;
      lines.push(content);
    }

    return { content: lines.join("\n") };
  }
}
