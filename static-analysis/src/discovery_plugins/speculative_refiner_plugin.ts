import type { DiscoveryPlugin, WalkContext, PluginResult } from "./types.js";
import type { TreeNode } from "../types.js";
import { DependencyTree } from "../dependency_tree.js";

export class SpeculativeRefinerPlugin implements DiscoveryPlugin {
  name = "speculative_refiner";
  description = "Sharpens end addresses by examining bytes after code nodes for valid instruction patterns";
  priority = 55;
  phase = "tree" as const;

  onTreeComplete(tree: DependencyTree, ctx: WalkContext): PluginResult | null {
    const updates: Array<{ address: number; updates: Partial<TreeNode> }> = [];

    for (const [, node] of tree.nodes) {
      if (node.type !== "code") continue;
      if (node.endConfidence >= 90) continue;  // already confident

      // Check if the bytes right after this node look like valid code
      // by trying to decode a few instructions
      let addr = node.end;
      let validCount = 0;
      let lastValid = addr;

      for (let attempt = 0; attempt < 5 && addr < 0x10000; attempt++) {
        if (ctx.byteRole[addr] !== 0) break;  // already claimed

        const opcode = ctx.memory[addr];
        // Check for obvious garbage: repeated JAM opcodes
        if (isJamOpcode(opcode)) break;

        // Try decoding
        const instrLen = getInstructionLength(opcode);
        if (addr + instrLen > 0x10000) break;

        validCount++;
        lastValid = addr + instrLen;
        addr += instrLen;
      }

      // If we found valid-looking instructions, this might be part of the same routine
      // but we don't extend — just note it for potential future analysis
      if (validCount === 0 && node.endConfidence < 50) {
        // Bytes after node look like garbage — increase end confidence
        updates.push({
          address: node.start,
          updates: {
            endConfidence: Math.min(node.endConfidence + 30, 90),
            refinedBy: [...node.refinedBy, this.name],
          },
        });
      }
    }

    return updates.length > 0 ? { nodeUpdates: updates } : null;
  }
}

function isJamOpcode(opcode: number): boolean {
  return [0x02, 0x12, 0x22, 0x32, 0x42, 0x52, 0x62, 0x72, 0x92, 0xB2, 0xD2, 0xF2].includes(opcode);
}

function getInstructionLength(opcode: number): number {
  // Quick instruction length lookup without full decode
  const mode = ADDR_MODE_BY_OPCODE[opcode];
  if (mode === undefined) return 1;
  return mode;
}

// Simplified byte-count table for all 256 opcodes
const ADDR_MODE_BY_OPCODE: number[] = [
  // 0x00-0x0F
  1, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 3, 3, 3, 3,
  // 0x10-0x1F
  2, 2, 1, 2, 2, 2, 2, 2, 1, 3, 1, 3, 3, 3, 3, 3,
  // 0x20-0x2F
  3, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 3, 3, 3, 3,
  // 0x30-0x3F
  2, 2, 1, 2, 2, 2, 2, 2, 1, 3, 1, 3, 3, 3, 3, 3,
  // 0x40-0x4F
  1, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 3, 3, 3, 3,
  // 0x50-0x5F
  2, 2, 1, 2, 2, 2, 2, 2, 1, 3, 1, 3, 3, 3, 3, 3,
  // 0x60-0x6F
  1, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 3, 3, 3, 3,
  // 0x70-0x7F
  2, 2, 1, 2, 2, 2, 2, 2, 1, 3, 1, 3, 3, 3, 3, 3,
  // 0x80-0x8F
  2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 3, 3, 3, 3,
  // 0x90-0x9F
  2, 2, 1, 2, 2, 2, 2, 2, 1, 3, 1, 3, 3, 3, 3, 3,
  // 0xA0-0xAF
  2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 3, 3, 3, 3,
  // 0xB0-0xBF
  2, 2, 1, 2, 2, 2, 2, 2, 1, 3, 1, 3, 3, 3, 3, 3,
  // 0xC0-0xCF
  2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 3, 3, 3, 3,
  // 0xD0-0xDF
  2, 2, 1, 2, 2, 2, 2, 2, 1, 3, 1, 3, 3, 3, 3, 3,
  // 0xE0-0xEF
  2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 3, 3, 3, 3,
  // 0xF0-0xFF
  2, 2, 1, 2, 2, 2, 2, 2, 1, 3, 1, 3, 3, 3, 3, 3,
];
