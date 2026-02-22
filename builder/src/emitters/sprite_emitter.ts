// ============================================================================
// Sprite Emitter — sprite data → .byte %binary with visual ASCII art comments
// Supports hires (1bpp) and multicolor (2bpp) display modes.
// Color mode is read from candidate metadata (set by sprite detector or
// enrichment pipeline). Static analysis defaults to "hires".
// ============================================================================

import type { Block } from "@c64/shared";
import * as ka from "../kickass.js";
import { decodeRaw } from "../raw_data.js";
import type { BuilderContext, EmitterPlugin, EmittedBlock } from "./types.js";

const SPRITE_BLOCK_SIZE = 64;
const SPRITE_DATA_SIZE = 63;
const SPRITE_ROWS = 21;
const BYTES_PER_ROW = 3;

type ColorMode = "hires" | "multicolor";

export class SpriteEmitter implements EmitterPlugin {
  name = "sprite";
  description = "Emit sprite data as .byte %binary with visual ASCII comments";
  priority = 20;

  handles(block: Block): boolean {
    if (block.type !== "data") return false;
    if (!block.candidates || block.bestCandidate === undefined) return false;
    const best = block.candidates[block.bestCandidate];
    return best?.type === "sprite_data";
  }

  emit(block: Block, context: BuilderContext): EmittedBlock {
    const lines: string[] = [];
    const best = block.candidates![block.bestCandidate!];
    const bytes = this.getBlockBytes(block, context);

    // Determine color mode from enrichment or candidate metadata
    const colorMode = this.getColorMode(block);

    // Label
    const label = context.resolveLabel(block.address);
    if (label) {
      lines.push(ka.label(label));
    }

    if (best.comment) {
      lines.push(ka.comment(`${best.comment} [${colorMode}]`));
    }

    if (!bytes) {
      const size = block.endAddress - block.address;
      lines.push(ka.fillDirective(size, 0));
      return { lines };
    }

    // Determine sprite count
    const spriteCount = Math.floor(bytes.length / SPRITE_BLOCK_SIZE);
    const remainder = bytes.length % SPRITE_BLOCK_SIZE;

    for (let s = 0; s < spriteCount; s++) {
      const offset = s * SPRITE_BLOCK_SIZE;

      if (spriteCount > 1) {
        if (s > 0) {
          lines.push("");
          // Emit sub-label for sprite frames 1+ (if present in label map)
          const subAddr = block.address + offset;
          const subLabel = context.resolveLabel(subAddr);
          if (subLabel && subLabel !== label) {
            lines.push(ka.label(subLabel));
          }
        }
        lines.push(ka.comment(`--- Sprite ${s} ---`));
      }

      // Emit 21 rows of 3 bytes each in binary notation
      for (let row = 0; row < SPRITE_ROWS; row++) {
        const rowOffset = offset + row * BYTES_PER_ROW;
        const b0 = bytes[rowOffset];
        const b1 = bytes[rowOffset + 1];
        const b2 = bytes[rowOffset + 2];

        const visual = colorMode === "multicolor"
          ? renderMulticolorRow(b0, b1, b2)
          : renderHiresRow(b0, b1, b2);

        const bin0 = toBinary(b0);
        const bin1 = toBinary(b1);
        const bin2 = toBinary(b2);

        lines.push(
          `${ka.INDENT}.byte %${bin0}, %${bin1}, %${bin2}`.padEnd(48) +
            `// ${visual}`
        );
      }

      // 64th padding byte
      const padByte = bytes[offset + SPRITE_DATA_SIZE];
      lines.push(
        `${ka.INDENT}.byte $${(padByte ?? 0).toString(16).toUpperCase().padStart(2, "0")}`
      );
    }

    // Handle any leftover bytes (partial sprite or non-aligned remainder)
    if (remainder > 0) {
      const leftover = bytes.slice(spriteCount * SPRITE_BLOCK_SIZE);
      lines.push(ka.comment(`${remainder} trailing byte(s)`));
      lines.push(...ka.byteDirective(leftover));
    }

    return { lines };
  }

  private getColorMode(block: Block): ColorMode {
    // Check enrichment first (RE pipeline can override)
    const enrichSub = block.enrichment?.dataFormat?.subtype;
    if (enrichSub === "multicolor" || enrichSub === "multi") return "multicolor";
    if (enrichSub === "hires" || enrichSub === "mono") return "hires";

    // Fall back to candidate metadata
    const best = block.candidates?.[block.bestCandidate!];
    const meta = best?.metadata;
    if (meta?.colorMode === "multicolor") return "multicolor";

    return "hires";
  }

  private getBlockBytes(
    block: Block,
    context: BuilderContext
  ): Uint8Array | null {
    if (block.raw) {
      return decodeRaw(block.raw);
    }
    return context.getBytes(block.address, block.endAddress - block.address);
  }
}

/** Render a hires sprite row: 1 bit per pixel, 24 pixels wide.
 *  `.` = transparent, `X` = sprite color */
function renderHiresRow(b0: number, b1: number, b2: number): string {
  let row = "";
  for (const b of [b0, b1, b2]) {
    for (let bit = 7; bit >= 0; bit--) {
      row += (b >> bit) & 1 ? "X" : ".";
    }
  }
  return row;
}

/** Render a multicolor sprite row: 2 bits per pixel, 12 pixels wide.
 *  `.` = bg (00), `A` = mc0/$D025 (01), `B` = sprite color (10), `C` = mc1/$D026 (11) */
function renderMulticolorRow(b0: number, b1: number, b2: number): string {
  const MC_CHARS = [".", "A", "B", "C"];
  let row = "";
  for (const b of [b0, b1, b2]) {
    for (let pair = 3; pair >= 0; pair--) {
      const bits = (b >> (pair * 2)) & 0x03;
      row += MC_CHARS[bits];
    }
  }
  return row;
}

function toBinary(byte: number): string {
  return byte.toString(2).padStart(8, "0");
}
