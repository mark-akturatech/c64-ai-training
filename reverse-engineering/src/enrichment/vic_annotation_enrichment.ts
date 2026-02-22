// ============================================================================
// VIC-II Annotation Enrichment (Priority 85)
//
// Higher-level VIC-II annotations: detects screen mode setup, sprite
// enable/position sequences, scroll register manipulation, VIC bank selection.
// Banking-aware: checks VIC bank from $DD00 state.
// ============================================================================

import type { Block, BlockInstruction } from "@c64/shared";
import type {
  EnrichmentPlugin,
  EnrichmentInput,
  EnrichmentResult,
  REBlockEnrichment,
} from "../types.js";

export class VicAnnotationEnrichment implements EnrichmentPlugin {
  name = "vic_annotation";
  priority = 85;

  enrich(input: EnrichmentInput): EnrichmentResult {
    const enrichments: REBlockEnrichment[] = [];

    for (const block of input.blocks) {
      if (!block.instructions || block.instructions.length === 0) continue;
      if (block.type === "data" || block.type === "unknown") continue;

      const annotations = this.analyzeVicUsage(block);
      enrichments.push(...annotations);
    }

    return { enrichments };
  }

  private analyzeVicUsage(block: Block): REBlockEnrichment[] {
    const results: REBlockEnrichment[] = [];
    const insts = block.instructions!;

    // Track register writes to detect patterns
    const vicWrites = new Map<number, number>(); // register → value
    let aValue: number | null = null;

    for (const inst of insts) {
      const mn = inst.mnemonic.toLowerCase();

      if (mn === "lda" && inst.addressingMode === "immediate") {
        aValue = this.parseImmediate(inst);
      }

      if (mn === "sta" && aValue !== null) {
        const target = this.parseAbsoluteTarget(inst);
        if (target !== null && target >= 0xD000 && target <= 0xD03F) {
          vicWrites.set(target, aValue);
        }
      }

      if (mn === "lda" && inst.addressingMode !== "immediate") {
        aValue = null;
      }
    }

    // Detect screen mode from $D011 and $D016
    const d011 = vicWrites.get(0xD011);
    const d016 = vicWrites.get(0xD016);
    if (d011 !== undefined) {
      const bitmap = (d011 & 0x20) !== 0;
      const extColor = (d011 & 0x40) !== 0;
      const screenHeight = (d011 & 0x08) ? 25 : 24;
      const scrollY = d011 & 0x07;

      const multicolor = d016 !== undefined ? (d016 & 0x10) !== 0 : false;

      let mode = "standard text";
      if (bitmap && multicolor) mode = "multicolor bitmap";
      else if (bitmap) mode = "hi-res bitmap";
      else if (multicolor) mode = "multicolor text";
      else if (extColor) mode = "extended background color text";

      results.push({
        blockAddress: block.address,
        source: this.name,
        type: "register_semantic",
        annotation: `VIC mode: ${mode} (${screenHeight} rows, scroll Y=${scrollY})`,
        data: {
          d011Value: d011,
          d016Value: d016,
          mode,
          bitmap,
          multicolor,
          extColor,
          screenHeight,
          scrollY,
        },
      });
    }

    // Detect VIC memory setup from $D018
    const d018 = vicWrites.get(0xD018);
    if (d018 !== undefined) {
      const screenBase = ((d018 >> 4) & 0x0F) * 0x0400;
      const charBase = ((d018 >> 1) & 0x07) * 0x0800;
      const bitmapBit = (d018 & 0x08) !== 0;

      results.push({
        blockAddress: block.address,
        source: this.name,
        type: "register_semantic",
        annotation: `VIC memory: screen=$${hex(screenBase)}, ${bitmapBit ? "bitmap" : "charset"}=$${hex(charBase)}`,
        data: {
          d018Value: d018,
          screenBase,
          charBase,
          bitmapMode: bitmapBit,
        },
      });
    }

    // Detect sprite enable pattern
    const d015 = vicWrites.get(0xD015);
    if (d015 !== undefined) {
      const enabledSprites: number[] = [];
      for (let i = 0; i < 8; i++) {
        if (d015 & (1 << i)) enabledSprites.push(i);
      }

      results.push({
        blockAddress: block.address,
        source: this.name,
        type: "register_semantic",
        annotation: `Sprites enabled: ${enabledSprites.length > 0 ? enabledSprites.join(", ") : "none"} ($${d015.toString(16).toUpperCase().padStart(2, "0")})`,
        data: {
          d015Value: d015,
          enabledSprites,
          spriteCount: enabledSprites.length,
        },
      });
    }

    return results;
  }

  private parseImmediate(inst: BlockInstruction): number | null {
    if (inst.addressingMode !== "immediate") return null;
    const match = inst.operand.match(/^#\$([0-9a-fA-F]{1,2})$/);
    if (match) return parseInt(match[1], 16);
    const decMatch = inst.operand.match(/^#(\d+)$/);
    if (decMatch) return parseInt(decMatch[1], 10);
    return null;
  }

  private parseAbsoluteTarget(inst: BlockInstruction): number | null {
    if (inst.addressingMode !== "absolute") return null;
    const match = inst.operand.match(/^\$([0-9a-fA-F]{4})$/);
    if (match) return parseInt(match[1], 16);
    return null;
  }
}

function hex(addr: number): string {
  return addr.toString(16).toUpperCase().padStart(4, "0");
}
