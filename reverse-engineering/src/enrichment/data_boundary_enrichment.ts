// ============================================================================
// Data Boundary Enrichment (Priority 62)
//
// Determines data block boundaries using multiple strategies:
// - Terminators ($00, $FF)
// - Counter-based (loop count × element size)
// - Pointer math (next referenced address)
// - Cross-reference (next block start)
// ============================================================================

import type { Block } from "@c64/shared";
import type {
  EnrichmentPlugin,
  EnrichmentInput,
  EnrichmentResult,
  REBlockEnrichment,
} from "../types.js";

export class DataBoundaryEnrichment implements EnrichmentPlugin {
  name = "data_boundary";
  priority = 62;

  enrich(input: EnrichmentInput): EnrichmentResult {
    const enrichments: REBlockEnrichment[] = [];

    // Sort all block addresses for finding "next block"
    const sortedAddresses = input.blocks
      .map(b => b.address)
      .sort((a, b) => a - b);

    for (const block of input.blocks) {
      if (block.type !== "data" && block.type !== "unknown") continue;

      const size = block.endAddress - block.address;
      const data = input.memory.slice(block.address, block.endAddress);

      // Find the next block's start address for gap analysis
      const nextBlockAddr = sortedAddresses.find(a => a > block.address) ?? block.endAddress;
      const gapToNext = nextBlockAddr - block.endAddress;

      // Detect terminators
      const terminator = this.detectTerminator(data);

      // Detect element structure
      const elementSize = this.detectElementSize(data, block, input);

      const details: Record<string, unknown> = {
        size,
        gapToNext,
      };
      const parts: string[] = [`${size} bytes`];

      if (terminator) {
        details.terminator = terminator.byte;
        details.terminatorOffset = terminator.offset;
        parts.push(`terminated by $${terminator.byte.toString(16).toUpperCase().padStart(2, "0")} at +${terminator.offset}`);
      }

      if (elementSize && elementSize > 1) {
        details.elementSize = elementSize;
        details.elementCount = Math.floor(size / elementSize);
        parts.push(`${details.elementCount} × ${elementSize}-byte elements`);
      }

      if (gapToNext > 0 && gapToNext < 16) {
        parts.push(`${gapToNext}-byte gap to next block`);
      }

      enrichments.push({
        blockAddress: block.address,
        source: this.name,
        type: "annotation",
        annotation: `Data boundary: ${parts.join(", ")}`,
        data: details,
      });
    }

    return { enrichments };
  }

  private detectTerminator(data: Uint8Array): { byte: number; offset: number } | null {
    // Check if data ends with a common terminator
    if (data.length === 0) return null;

    const lastByte = data[data.length - 1];
    if (lastByte === 0x00 || lastByte === 0xFF) {
      // Verify it's not just all zeros/FFs
      let nonTermCount = 0;
      for (let i = 0; i < data.length - 1; i++) {
        if (data[i] !== lastByte) nonTermCount++;
      }
      if (nonTermCount > 0) {
        return { byte: lastByte, offset: data.length - 1 };
      }
    }

    return null;
  }

  private detectElementSize(
    data: Uint8Array,
    block: Block,
    input: EnrichmentInput,
  ): number | null {
    // Check for common element sizes that divide the data evenly
    const size = data.length;
    const candidates = [2, 3, 4, 5, 6, 8, 16, 32, 40, 63, 64];

    for (const elemSize of candidates) {
      if (size % elemSize === 0 && size / elemSize >= 2) {
        // Verify by checking for structural repetition
        if (this.hasRepetitiveStructure(data, elemSize)) {
          return elemSize;
        }
      }
    }

    return null;
  }

  private hasRepetitiveStructure(data: Uint8Array, elemSize: number): boolean {
    // Check if elements have similar byte distributions
    const elementCount = data.length / elemSize;
    if (elementCount < 2) return false;

    // Simple heuristic: check if the same byte positions across elements
    // have similar value ranges
    let structuralSimilarity = 0;
    for (let pos = 0; pos < elemSize; pos++) {
      let min = 255, max = 0;
      for (let elem = 0; elem < elementCount; elem++) {
        const val = data[elem * elemSize + pos];
        min = Math.min(min, val);
        max = Math.max(max, val);
      }
      // If this position has limited range, it's structural
      if (max - min < 128) structuralSimilarity++;
    }

    return structuralSimilarity > elemSize * 0.3;
  }
}
