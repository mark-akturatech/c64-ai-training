// Decode Data Format Tool — attempt to decode data as specific format

import type { AIToolHandler, ToolDefinition, ToolResult, ToolContext } from "./types.js";

export class DecodeDataFormatTool implements AIToolHandler {
  name = "decode_data_format";

  definition: ToolDefinition = {
    name: "decode_data_format",
    description: "Attempt to decode a data block as a specific format (sprite, charset, screen, string, address table).",
    parameters: {
      type: "object",
      properties: {
        address: { type: "string", description: "Hex address of data block" },
        format: {
          type: "string",
          enum: ["sprite", "charset", "screen", "petscii", "address_table", "auto"],
          description: "Format to try (or 'auto' to try all)",
        },
      },
      required: ["address"],
    },
  };

  async handle(args: Record<string, unknown>, context: ToolContext): Promise<ToolResult> {
    const addrStr = String(args.address ?? "").replace(/^\$/, "");
    const addr = parseInt(addrStr, 16);
    const format = String(args.format ?? "auto");

    const block = context.blockStore.getBlock(addr) ?? context.blockStore.findBlockContaining(addr);
    if (!block) {
      return { content: `No block at $${hex(addr)}` };
    }

    const size = block.endAddress - block.address;
    const lines: string[] = [`Data at $${hex(addr)}, ${size} bytes:`];

    if (format === "sprite" || format === "auto") {
      if (size % 64 === 0) {
        lines.push(`  Sprite data: ${size / 64} sprites (${size} bytes, 64-byte aligned)`);
      } else if (size % 63 === 0) {
        lines.push(`  Compact sprites: ${size / 63} sprites (63-byte, no padding)`);
      }
    }

    if (format === "charset" || format === "auto") {
      if (size === 2048) lines.push(`  Full character set (256 chars, 8 bytes each)`);
      else if (size === 1024) lines.push(`  Half character set (128 chars)`);
    }

    if (format === "screen" || format === "auto") {
      if (size === 1000) lines.push(`  Screen data (40x25)`);
      else if (size % 40 === 0) lines.push(`  Screen rows: ${size / 40} rows`);
    }

    if (format === "petscii" || format === "auto") {
      // Check if data looks like PETSCII text
      let printable = 0;
      for (let i = 0; i < Math.min(size, 100); i++) {
        const b = context.memory[addr + i];
        if ((b >= 0x20 && b <= 0x7E) || b === 0x0D) printable++;
      }
      const ratio = printable / Math.min(size, 100);
      if (ratio > 0.7) {
        lines.push(`  PETSCII text (${(ratio * 100).toFixed(0)}% printable)`);
      }
    }

    if (format === "address_table" || format === "auto") {
      if (size % 2 === 0 && size >= 4) {
        const count = size / 2;
        const addrs: string[] = [];
        for (let i = 0; i < Math.min(count, 8); i++) {
          const lo = context.memory[addr + i * 2];
          const hi = context.memory[addr + i * 2 + 1];
          addrs.push(`$${hex((hi << 8) | lo)}`);
        }
        lines.push(`  Address table (${count} entries): ${addrs.join(", ")}${count > 8 ? "..." : ""}`);
      }
    }

    // Check data_format enrichments
    const dfEnrichments = context.enrichments.get("data_format") ?? [];
    const relevant = dfEnrichments.filter(e => e.blockAddress === block.address);
    for (const e of relevant) {
      lines.push(`  [enrichment] ${e.annotation}`);
    }

    return { content: lines.join("\n") };
  }
}

function hex(addr: number): string {
  return addr.toString(16).toUpperCase().padStart(4, "0");
}
