// Read Memory Tool — read raw bytes from binary at specific address

import type { AIToolHandler, ToolDefinition, ToolResult, ToolContext } from "./types.js";

export class ReadMemoryTool implements AIToolHandler {
  name = "read_memory";

  definition: ToolDefinition = {
    name: "read_memory",
    description: "Read raw bytes from the C64 memory image at a specific address. Returns hex dump.",
    parameters: {
      type: "object",
      properties: {
        address: { type: "string", description: "Hex address (e.g. '$C000' or 'C000')" },
        length: { type: "number", description: "Number of bytes to read (max 256)", default: 16 },
      },
      required: ["address"],
    },
  };

  async handle(args: Record<string, unknown>, context: ToolContext): Promise<ToolResult> {
    const addrStr = String(args.address ?? "").replace(/^\$/, "");
    const addr = parseInt(addrStr, 16);
    const len = Math.min(Number(args.length ?? 16), 256);

    if (isNaN(addr) || addr < 0 || addr >= 65536) {
      return { content: `Invalid address: ${args.address}` };
    }

    const bytes: string[] = [];
    for (let i = 0; i < len && addr + i < 65536; i++) {
      bytes.push(context.memory[addr + i].toString(16).padStart(2, "0").toUpperCase());
    }

    const lines: string[] = [];
    for (let i = 0; i < bytes.length; i += 16) {
      const chunk = bytes.slice(i, i + 16);
      const addrLabel = (addr + i).toString(16).toUpperCase().padStart(4, "0");
      lines.push(`$${addrLabel}: ${chunk.join(" ")}`);
    }

    return { content: lines.join("\n") };
  }
}
