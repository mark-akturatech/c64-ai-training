// Find References Tool — find all code that reads/writes an address

import type { AIToolHandler, ToolDefinition, ToolResult, ToolContext } from "./types.js";

export class FindReferencesTool implements AIToolHandler {
  name = "find_references";

  definition: ToolDefinition = {
    name: "find_references",
    description: "Find all code blocks that reference a specific address (reads, writes, jumps, calls).",
    parameters: {
      type: "object",
      properties: {
        address: { type: "string", description: "Hex address to search for (e.g. '$D020')" },
      },
      required: ["address"],
    },
  };

  async handle(args: Record<string, unknown>, context: ToolContext): Promise<ToolResult> {
    const addrStr = String(args.address ?? "").replace(/^\$/, "");
    const addr = parseInt(addrStr, 16);

    if (isNaN(addr)) {
      return { content: `Invalid address: ${args.address}` };
    }

    const edges = context.graph.getEdges();
    const refs = edges.filter(e => e.target === addr);

    if (refs.length === 0) {
      return { content: `No references found to $${hex(addr)}` };
    }

    const lines: string[] = [`References to $${hex(addr)} (${refs.length}):`];
    for (const ref of refs.slice(0, 20)) {
      lines.push(`  ${ref.source} → $${hex(ref.target)} [${ref.type}] (${ref.category})`);
    }
    if (refs.length > 20) {
      lines.push(`  ... and ${refs.length - 20} more`);
    }

    return { content: lines.join("\n") };
  }
}

function hex(addr: number): string {
  return addr.toString(16).toUpperCase().padStart(4, "0");
}
