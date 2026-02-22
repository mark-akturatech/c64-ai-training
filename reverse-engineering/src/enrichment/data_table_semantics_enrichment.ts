// ============================================================================
// Data Table Semantics Enrichment (Priority 55)
//
// For data blocks read by code, determines what the table values mean by
// cross-referencing with register_semantics. If a data table's values are
// written to $D027 (sprite color register), they're "sprite colours". If
// written to $D012, they're "raster lines".
// ============================================================================

import type { Block, BlockInstruction } from "@c64/shared";
import type {
  EnrichmentPlugin,
  EnrichmentInput,
  EnrichmentResult,
  REBlockEnrichment,
} from "../types.js";

// Maps hardware register address → semantic meaning for data values
const REGISTER_VALUE_SEMANTICS: Record<number, string> = {
  // VIC color registers
  0xD020: "border colors",
  0xD021: "background colors",
  0xD022: "background colors (MC1)",
  0xD023: "background colors (MC2)",
  0xD024: "background colors (MC3)",
  0xD025: "sprite multicolor 0 values",
  0xD026: "sprite multicolor 1 values",
  0xD027: "sprite 0 colors", 0xD028: "sprite 1 colors",
  0xD029: "sprite 2 colors", 0xD02A: "sprite 3 colors",
  0xD02B: "sprite 4 colors", 0xD02C: "sprite 5 colors",
  0xD02D: "sprite 6 colors", 0xD02E: "sprite 7 colors",
  // VIC position/control
  0xD000: "sprite 0 X positions", 0xD001: "sprite 0 Y positions",
  0xD002: "sprite 1 X positions", 0xD003: "sprite 1 Y positions",
  0xD004: "sprite 2 X positions", 0xD005: "sprite 2 Y positions",
  0xD006: "sprite 3 X positions", 0xD007: "sprite 3 Y positions",
  0xD008: "sprite 4 X positions", 0xD009: "sprite 4 Y positions",
  0xD00A: "sprite 5 X positions", 0xD00B: "sprite 5 Y positions",
  0xD00C: "sprite 6 X positions", 0xD00D: "sprite 6 Y positions",
  0xD00E: "sprite 7 X positions", 0xD00F: "sprite 7 Y positions",
  0xD012: "raster line values",
  // SID
  0xD400: "voice 1 frequency lo values", 0xD401: "voice 1 frequency hi values",
  0xD407: "voice 2 frequency lo values", 0xD408: "voice 2 frequency hi values",
  0xD40E: "voice 3 frequency lo values", 0xD40F: "voice 3 frequency hi values",
  0xD418: "SID volume/filter values",
};

export class DataTableSemanticsEnrichment implements EnrichmentPlugin {
  name = "data_table_semantics";
  priority = 55;

  enrich(input: EnrichmentInput): EnrichmentResult {
    const enrichments: REBlockEnrichment[] = [];

    // Build a map: data block address → code blocks that read from it
    const dataReaders = this.buildDataReaderMap(input);

    for (const block of input.blocks) {
      if (block.type !== "data" && block.type !== "unknown") continue;

      const readers = dataReaders.get(block.address);
      if (!readers || readers.length === 0) continue;

      // For each reader, check what hardware register the loaded value ends up at
      const semantics = this.determineSemantics(block, readers, input);
      if (semantics) {
        enrichments.push({
          blockAddress: block.address,
          source: this.name,
          type: "data_semantic",
          annotation: `Table of ${semantics.meaning} (used by $${hex(semantics.readerAddress)} → $${hex(semantics.targetRegister)})`,
          data: {
            meaning: semantics.meaning,
            targetRegister: semantics.targetRegister,
            readerAddress: semantics.readerAddress,
          },
        });
      }
    }

    return { enrichments };
  }

  private buildDataReaderMap(
    input: EnrichmentInput,
  ): Map<number, Array<{ block: Block; inst: BlockInstruction }>> {
    const map = new Map<number, Array<{ block: Block; inst: BlockInstruction }>>();

    for (const block of input.blocks) {
      if (!block.instructions) continue;
      if (block.type === "data" || block.type === "unknown") continue;

      for (const inst of block.instructions) {
        const mn = inst.mnemonic.toLowerCase();
        if (mn !== "lda" && mn !== "ldx" && mn !== "ldy") continue;

        const target = this.parseBaseAddress(inst);
        if (target === null) continue;

        // Check if this address is a known data block
        const dataBlock = input.blocks.find(b =>
          (b.type === "data" || b.type === "unknown") &&
          target >= b.address && target < b.endAddress
        );
        if (!dataBlock) continue;

        const list = map.get(dataBlock.address) ?? [];
        list.push({ block, inst });
        map.set(dataBlock.address, list);
      }
    }

    return map;
  }

  private determineSemantics(
    dataBlock: Block,
    readers: Array<{ block: Block; inst: BlockInstruction }>,
    input: EnrichmentInput,
  ): { meaning: string; targetRegister: number; readerAddress: number } | null {
    for (const { block, inst } of readers) {
      if (!block.instructions) continue;

      // Find what register the loaded value gets stored to
      const idx = block.instructions.indexOf(inst);
      if (idx === -1) continue;

      // Look forward for the store instruction
      for (let i = idx + 1; i < block.instructions.length && i <= idx + 5; i++) {
        const storeMn = block.instructions[i].mnemonic.toLowerCase();
        if (storeMn !== "sta" && storeMn !== "stx" && storeMn !== "sty") continue;

        const storeTarget = this.parseAbsoluteTarget(block.instructions[i]);
        if (storeTarget === null) continue;

        const meaning = REGISTER_VALUE_SEMANTICS[storeTarget];
        if (meaning) {
          return {
            meaning,
            targetRegister: storeTarget,
            readerAddress: block.address,
          };
        }
      }
    }

    return null;
  }

  private parseBaseAddress(inst: BlockInstruction): number | null {
    // Handle indexed addressing: $1234,X → $1234
    const match = inst.operand.match(/^\$([0-9a-fA-F]+)/);
    if (match) return parseInt(match[1], 16);
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
