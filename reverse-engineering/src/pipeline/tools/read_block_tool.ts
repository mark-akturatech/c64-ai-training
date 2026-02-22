// Read Block Tool — get full disassembly + enrichments for a block

import type { AIToolHandler, ToolDefinition, ToolResult, ToolContext } from "./types.js";

export class ReadBlockTool implements AIToolHandler {
  name = "read_block";

  definition: ToolDefinition = {
    name: "read_block",
    description: "Get full disassembly and enrichments for a specific block by address.",
    parameters: {
      type: "object",
      properties: {
        address: { type: "string", description: "Hex address of the block (e.g. '$0820')" },
      },
      required: ["address"],
    },
  };

  async handle(args: Record<string, unknown>, context: ToolContext): Promise<ToolResult> {
    const addrStr = String(args.address ?? "").replace(/^\$/, "");
    const addr = parseInt(addrStr, 16);
    const block = context.blockStore.getBlock(addr) ?? context.blockStore.findBlockContaining(addr);

    if (!block) {
      return { content: `No block found at or containing $${addrStr.toUpperCase()}` };
    }

    const lines: string[] = [];
    lines.push(`Block $${hex(block.address)} (${block.type}, ${block.endAddress - block.address} bytes)`);

    if (block.instructions) {
      for (const inst of block.instructions) {
        const sym = context.symbolDb.lookup(inst.address);
        const label = sym ? `${sym.name}: ` : "";
        lines.push(`  $${hex(inst.address)}: ${label}${inst.mnemonic} ${inst.operand}`);
      }
    }

    // Attach enrichments
    for (const [source, enrichments] of context.enrichments) {
      const relevant = enrichments.filter(e => e.blockAddress === block.address);
      for (const e of relevant.slice(0, 5)) {
        lines.push(`  [${source}] ${e.annotation}`);
      }
    }

    return { content: lines.join("\n") };
  }
}

function hex(addr: number): string {
  return addr.toString(16).toUpperCase().padStart(4, "0");
}
