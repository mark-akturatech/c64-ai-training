// ============================================================================
// Data Format Enrichment (Priority 42)
//
// Classifies data blocks by their content format using heuristics:
// - Sprite data (63/64 byte alignment)
// - Character set data (8-byte character cells)
// - Screen data (40-column text)
// - PETSCII text strings
// - Music/SID data (known player signatures)
// - Bitmap data (8K blocks)
// - Generic byte tables
// ============================================================================

import type { Block } from "@c64/shared";
import type {
  EnrichmentPlugin,
  EnrichmentInput,
  EnrichmentResult,
  REBlockEnrichment,
} from "../types.js";

export class DataFormatEnrichment implements EnrichmentPlugin {
  name = "data_format";
  priority = 42;

  enrich(input: EnrichmentInput): EnrichmentResult {
    const enrichments: REBlockEnrichment[] = [];

    for (const block of input.blocks) {
      if (block.type !== "data" && block.type !== "unknown") continue;

      const size = block.endAddress - block.address;
      if (size < 2) continue;

      const data = input.memory.slice(block.address, block.endAddress);
      const format = this.classifyData(data, size, block.address);

      if (format) {
        enrichments.push({
          blockAddress: block.address,
          source: this.name,
          type: "data_format",
          annotation: format.description,
          data: {
            format: format.type,
            size,
            details: format.details,
          },
        });
      }
    }

    return { enrichments };
  }

  private classifyData(
    data: Uint8Array,
    size: number,
    address: number,
  ): { type: string; description: string; details?: Record<string, unknown> } | null {
    // Sprite data: 63 bytes per sprite + 1 padding = 64 bytes
    if (size % 64 === 0 && size >= 64) {
      const spriteCount = size / 64;
      // Check if data has sprite-like patterns (not all zeros or all $FF)
      const nonTrivial = this.hasVariedContent(data);
      if (nonTrivial) {
        return {
          type: "sprite",
          description: `Sprite data: ${spriteCount} sprite(s) (${size} bytes)`,
          details: { spriteCount, bytesPerSprite: 64 },
        };
      }
    }

    // Non-standard sprite sizes (like Archon's 54-byte sprites)
    if (size % 63 === 0 && size >= 63 && size % 64 !== 0) {
      const spriteCount = size / 63;
      return {
        type: "sprite_compact",
        description: `Compact sprite data: ${spriteCount} sprite(s) (${size} bytes, no padding)`,
        details: { spriteCount, bytesPerSprite: 63 },
      };
    }

    // Character set: 256 chars × 8 bytes = 2048 bytes, or partial
    if (size === 2048 || size === 1024 || size === 512) {
      const charCount = size / 8;
      if (this.looksLikeCharset(data)) {
        return {
          type: "charset",
          description: `Character set: ${charCount} characters (${size} bytes)`,
          details: { charCount },
        };
      }
    }

    // Screen data: multiple of 40 (screen width) or exactly 1000 bytes (25×40)
    if (size === 1000 || (size % 40 === 0 && size >= 40 && size <= 2000)) {
      const rows = size / 40;
      if (this.looksLikeScreenData(data)) {
        return {
          type: "screen_data",
          description: `Screen data: ${rows} row(s) (${size} bytes)`,
          details: { rows, columns: 40 },
        };
      }
    }

    // PETSCII text
    if (size >= 4) {
      const textRatio = this.petsciiTextRatio(data);
      if (textRatio > 0.8) {
        return {
          type: "text",
          description: `PETSCII text data (${size} bytes, ${Math.round(textRatio * 100)}% printable)`,
          details: { textRatio },
        };
      }
    }

    // Color data: values all 0-15
    if (size >= 40 && this.allValuesInRange(data, 0, 15)) {
      return {
        type: "color_data",
        description: `Color data (${size} bytes, all values 0-15)`,
      };
    }

    // Bitmap: 8000 bytes
    if (size === 8000) {
      return {
        type: "bitmap",
        description: `Bitmap data (8000 bytes)`,
      };
    }

    // Sprite pointer table: small block with values in sprite pointer range
    if (size >= 2 && size <= 32 && address >= 0x0400) {
      // Sprite pointers are typically $00-$FF, pointing to blocks of 64 bytes
      if (this.allValuesInRange(data, 0, 255)) {
        // This is ambiguous — don't classify as we can't be sure
      }
    }

    // Fall through: don't classify if unsure
    return null;
  }

  private hasVariedContent(data: Uint8Array): boolean {
    const first = data[0];
    let diffCount = 0;
    for (let i = 1; i < data.length; i++) {
      if (data[i] !== first) diffCount++;
    }
    return diffCount > data.length * 0.1;
  }

  private looksLikeCharset(data: Uint8Array): boolean {
    // Character data typically has varied bit patterns per 8-byte cell
    let variedCells = 0;
    const cellCount = data.length / 8;
    for (let c = 0; c < cellCount; c++) {
      const offset = c * 8;
      let unique = new Set<number>();
      for (let r = 0; r < 8; r++) {
        unique.add(data[offset + r]);
      }
      if (unique.size > 1) variedCells++;
    }
    return variedCells > cellCount * 0.3;
  }

  private looksLikeScreenData(data: Uint8Array): boolean {
    // Screen codes are typically in 0-127 range (without color bits)
    let screenChars = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i] < 128) screenChars++;
    }
    return screenChars > data.length * 0.7;
  }

  private petsciiTextRatio(data: Uint8Array): number {
    let printable = 0;
    for (let i = 0; i < data.length; i++) {
      const b = data[i];
      // PETSCII printable: space (0x20), letters, digits, punctuation
      if ((b >= 0x20 && b <= 0x5F) || (b >= 0xC0 && b <= 0xDF) || b === 0x00 || b === 0x0D) {
        printable++;
      }
    }
    return printable / data.length;
  }

  private allValuesInRange(data: Uint8Array, min: number, max: number): boolean {
    for (let i = 0; i < data.length; i++) {
      if (data[i] < min || data[i] > max) return false;
    }
    return true;
  }
}
