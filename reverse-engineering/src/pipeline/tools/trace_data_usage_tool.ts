// Trace Data Usage Tool — trace data address usage across blocks

import type { AIToolHandler, ToolDefinition, ToolResult, ToolContext } from "./types.js";

export class TraceDataUsageTool implements AIToolHandler {
  name = "trace_data_usage";

  definition: ToolDefinition = {
    name: "trace_data_usage",
    description: "Trace how a data address is used across all blocks — readers, writers, and patterns.",
    parameters: {
      type: "object",
      properties: {
        address: { type: "string", description: "Hex address of the data to trace (e.g. '$02')" },
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

    const lines: string[] = [`Data usage trace for $${hex(addr)}:`];

    // Check enrichments for data flow info
    const dataFlowEnrichments = context.enrichments.get("data_flow") ?? [];
    const relevant = dataFlowEnrichments.filter(e =>
      e.data?.dataAddress === addr || e.blockAddress === addr
    );

    if (relevant.length > 0) {
      for (const e of relevant) {
        lines.push(`  ${e.annotation}`);
      }
    }

    // Check graph edges
    const edges = context.graph.getEdges();
    const reads = edges.filter(e => e.target === addr && e.category === "data");
    const writes = edges.filter(e => e.target === addr && e.type === "data_write");

    if (reads.length > 0) {
      lines.push(`\nReaders (${reads.length}):`);
      for (const r of reads.slice(0, 10)) {
        lines.push(`  ${r.source} [${r.type}]`);
      }
    }

    if (writes.length > 0) {
      lines.push(`\nWriters (${writes.length}):`);
      for (const w of writes.slice(0, 10)) {
        lines.push(`  ${w.source} [${w.type}]`);
      }
    }

    // Check variable map
    const hexKey = addr.toString(16).toUpperCase().padStart(2, "0");
    const varEntry = context.variableMap?.variables?.[hexKey];
    if (varEntry) {
      lines.push(`\nKnown as: ${varEntry.currentName} (${varEntry.scope}, ${varEntry.type ?? "unknown type"})`);
    }

    return { content: lines.join("\n") };
  }
}

function hex(addr: number): string {
  return addr.toString(16).toUpperCase().padStart(4, "0");
}
