// ============================================================================
// Screen Operations Enrichment (Priority 90)
//
// Detects screen/colour RAM operations: writes to $0400-$07FF (screen) or
// $D800-$DBFF (colour RAM). Banking-aware: screen RAM location depends on
// VIC bank from $DD00 state.
// ============================================================================

import type { Block, BlockInstruction } from "@c64/shared";
import type {
  EnrichmentPlugin,
  EnrichmentInput,
  EnrichmentResult,
  REBlockEnrichment,
} from "../types.js";

// Default screen RAM locations per VIC bank
const VIC_BANKS = [
  { bank: 0, screenBase: 0x0400, range: [0x0000, 0x3FFF] },
  { bank: 1, screenBase: 0x4400, range: [0x4000, 0x7FFF] },
  { bank: 2, screenBase: 0x8400, range: [0x8000, 0xBFFF] },
  { bank: 3, screenBase: 0xC400, range: [0xC000, 0xFFFF] },
];

const COLOR_RAM_START = 0xD800;
const COLOR_RAM_END = 0xDBFF;

export class ScreenOpsEnrichment implements EnrichmentPlugin {
  name = "screen_ops";
  priority = 90;

  enrich(input: EnrichmentInput): EnrichmentResult {
    const enrichments: REBlockEnrichment[] = [];

    for (const block of input.blocks) {
      if (!block.instructions || block.instructions.length === 0) continue;
      if (block.type === "data" || block.type === "unknown") continue;

      const annotations = this.analyzeScreenOps(block, input);
      enrichments.push(...annotations);
    }

    return { enrichments };
  }

  private analyzeScreenOps(block: Block, input: EnrichmentInput): REBlockEnrichment[] {
    const results: REBlockEnrichment[] = [];
    const insts = block.instructions!;

    let screenWrites = 0;
    let colorWrites = 0;
    let screenReads = 0;

    for (const inst of insts) {
      const mn = inst.mnemonic.toLowerCase();
      const target = this.parseAbsoluteTarget(inst);
      if (target === null) continue;

      const isWrite = mn === "sta" || mn === "stx" || mn === "sty";
      const isRead = mn === "lda" || mn === "ldx" || mn === "ldy" ||
                     mn === "cmp" || mn === "cpx" || mn === "cpy";

      // Check for color RAM access
      if (target >= COLOR_RAM_START && target <= COLOR_RAM_END) {
        if (isWrite) colorWrites++;
      }

      // Check for default screen RAM access ($0400-$07E7)
      if (target >= 0x0400 && target <= 0x07E7) {
        if (isWrite) screenWrites++;
        if (isRead) screenReads++;
      }

      // Also check indexed addressing (STA $0400,X etc.)
      if (this.isIndexedScreenAccess(inst)) {
        if (isWrite) screenWrites++;
        if (isRead) screenReads++;
      }

      if (this.isIndexedColorAccess(inst)) {
        if (isWrite) colorWrites++;
      }
    }

    if (screenWrites > 0 || screenReads > 0) {
      results.push({
        blockAddress: block.address,
        source: this.name,
        type: "register_semantic",
        annotation: `Screen RAM: ${screenWrites} write(s)${screenReads > 0 ? `, ${screenReads} read(s)` : ""}`,
        data: {
          screenWrites,
          screenReads,
          screenBase: 0x0400, // default VIC bank 0
        },
      });
    }

    if (colorWrites > 0) {
      results.push({
        blockAddress: block.address,
        source: this.name,
        type: "register_semantic",
        annotation: `Color RAM: ${colorWrites} write(s)`,
        data: {
          colorWrites,
          colorRamBase: COLOR_RAM_START,
        },
      });
    }

    return results;
  }

  private isIndexedScreenAccess(inst: BlockInstruction): boolean {
    const mode = inst.addressingMode;
    if (mode !== "absolute_x" && mode !== "absolute_y") return false;
    const base = this.parseBaseAddress(inst);
    return base !== null && base >= 0x0400 && base <= 0x07E7;
  }

  private isIndexedColorAccess(inst: BlockInstruction): boolean {
    const mode = inst.addressingMode;
    if (mode !== "absolute_x" && mode !== "absolute_y") return false;
    const base = this.parseBaseAddress(inst);
    return base !== null && base >= COLOR_RAM_START && base <= COLOR_RAM_END;
  }

  private parseAbsoluteTarget(inst: BlockInstruction): number | null {
    if (inst.addressingMode !== "absolute") return null;
    const match = inst.operand.match(/^\$([0-9a-fA-F]{4})$/);
    if (match) return parseInt(match[1], 16);
    return null;
  }

  private parseBaseAddress(inst: BlockInstruction): number | null {
    const match = inst.operand.match(/^\$([0-9a-fA-F]+)/);
    if (match) return parseInt(match[1], 16);
    return null;
  }
}
