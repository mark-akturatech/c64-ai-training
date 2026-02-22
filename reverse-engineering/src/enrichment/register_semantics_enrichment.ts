// ============================================================================
// Register Semantics Enrichment (Priority 40)
//
// Annotates writes to hardware I/O registers (VIC-II, SID, CIA1, CIA2) with
// human-readable descriptions. Banking-aware: only annotates if ioMapped.
// Uses constant propagation values when available for richer annotations
// (e.g. "Set border to black" vs "Set border color").
// ============================================================================

import type { Block, BlockInstruction } from "@c64/shared";
import type {
  EnrichmentPlugin,
  EnrichmentInput,
  EnrichmentResult,
  REBlockEnrichment,
  BankingSnapshot,
} from "../types.js";
import { SymbolDB } from "../shared/symbol_db.js";
import { registerFromImm } from "../bitmask_value.js";

const symbolDb = new SymbolDB();

const DEFAULT_BANKING: BankingSnapshot = {
  cpuPort: registerFromImm(0x37, "default"),
  vicBank: registerFromImm(0x03, "default"),
  vicMemPtr: registerFromImm(0x14, "default"),
  kernalMapped: "yes",
  basicMapped: "yes",
  ioMapped: "yes",
  chargenMapped: "no",
};

// Color names for VIC-II color registers
const C64_COLORS = [
  "black", "white", "red", "cyan", "purple", "green", "blue", "yellow",
  "orange", "brown", "light red", "dark grey", "grey", "light green", "light blue", "light grey",
];

// Register description helpers
const VIC_SPRITE_X: Record<number, string> = {};
const VIC_SPRITE_Y: Record<number, string> = {};
const VIC_SPRITE_COLOR: Record<number, string> = {};
for (let i = 0; i < 8; i++) {
  VIC_SPRITE_X[0xD000 + i * 2] = `Sprite ${i} X position`;
  VIC_SPRITE_Y[0xD001 + i * 2] = `Sprite ${i} Y position`;
  VIC_SPRITE_COLOR[0xD027 + i] = `Sprite ${i} color`;
}

const REGISTER_DESCRIPTIONS: Record<number, string> = {
  ...VIC_SPRITE_X,
  ...VIC_SPRITE_Y,
  ...VIC_SPRITE_COLOR,
  0xD010: "Sprite X MSB (bit 8)",
  0xD011: "VIC control register 1 (scroll Y, screen height, raster MSB)",
  0xD012: "Raster line",
  0xD015: "Sprite enable",
  0xD016: "VIC control register 2 (scroll X, screen width, multicolor)",
  0xD017: "Sprite Y expand",
  0xD018: "VIC memory setup (screen + charset/bitmap base)",
  0xD019: "VIC interrupt register",
  0xD01A: "VIC interrupt enable",
  0xD01B: "Sprite-background priority",
  0xD01C: "Sprite multicolor mode",
  0xD01D: "Sprite X expand",
  0xD020: "Border color",
  0xD021: "Background color 0",
  0xD022: "Background color 1",
  0xD023: "Background color 2",
  0xD024: "Background color 3",
  0xD025: "Sprite multicolor 0",
  0xD026: "Sprite multicolor 1",
  // SID
  0xD400: "SID Voice 1 frequency lo",
  0xD401: "SID Voice 1 frequency hi",
  0xD402: "SID Voice 1 pulse width lo",
  0xD403: "SID Voice 1 pulse width hi",
  0xD404: "SID Voice 1 control",
  0xD405: "SID Voice 1 attack/decay",
  0xD406: "SID Voice 1 sustain/release",
  0xD407: "SID Voice 2 frequency lo",
  0xD408: "SID Voice 2 frequency hi",
  0xD40B: "SID Voice 2 control",
  0xD40C: "SID Voice 2 attack/decay",
  0xD40D: "SID Voice 2 sustain/release",
  0xD40E: "SID Voice 3 frequency lo",
  0xD40F: "SID Voice 3 frequency hi",
  0xD412: "SID Voice 3 control",
  0xD413: "SID Voice 3 attack/decay",
  0xD414: "SID Voice 3 sustain/release",
  0xD415: "SID filter cutoff lo",
  0xD416: "SID filter cutoff hi",
  0xD417: "SID filter resonance/routing",
  0xD418: "SID volume/filter mode",
  // CIA1
  0xDC00: "CIA1 Port A (keyboard column)",
  0xDC01: "CIA1 Port B (keyboard row)",
  0xDC04: "CIA1 Timer A lo",
  0xDC05: "CIA1 Timer A hi",
  0xDC0D: "CIA1 interrupt control",
  0xDC0E: "CIA1 Timer A control",
  0xDC0F: "CIA1 Timer B control",
  // CIA2
  0xDD00: "CIA2 Port A (VIC bank, serial)",
  0xDD0D: "CIA2 interrupt control",
  0xDD0E: "CIA2 Timer A control",
  0xDD0F: "CIA2 Timer B control",
};

// Color registers where value 0-15 maps to a color name
const COLOR_REGISTERS = new Set([
  0xD020, 0xD021, 0xD022, 0xD023, 0xD024, 0xD025, 0xD026,
  0xD027, 0xD028, 0xD029, 0xD02A, 0xD02B, 0xD02C, 0xD02D, 0xD02E,
]);

export class RegisterSemanticsEnrichment implements EnrichmentPlugin {
  name = "register_semantics";
  priority = 40;

  enrich(input: EnrichmentInput): EnrichmentResult {
    const enrichments: REBlockEnrichment[] = [];

    // Get constant propagation results for value lookups
    const constPropEnrichments = input.priorEnrichments.get?.("constant_propagation") ?? [];

    for (const block of input.blocks) {
      if (!block.instructions || block.instructions.length === 0) continue;
      if (block.type === "data" || block.type === "unknown") continue;

      // Get banking state
      const nodeId = this.blockToNodeId(block);
      const graphNode = input.graph.getNode(nodeId);
      const banking = graphNode?.bankingState?.onEntry ?? DEFAULT_BANKING;

      // Skip if I/O is definitely not mapped
      if (banking.ioMapped === "no") continue;

      for (const inst of block.instructions) {
        const mn = inst.mnemonic.toLowerCase();
        if (mn !== "sta" && mn !== "stx" && mn !== "sty" &&
            mn !== "lda" && mn !== "ldx" && mn !== "ldy") continue;

        const target = this.parseAbsoluteTarget(inst);
        if (target === null || target < 0xD000 || target > 0xDDFF) continue;

        const isWrite = mn.startsWith("st");
        const regDesc = REGISTER_DESCRIPTIONS[target];
        if (!regDesc) continue;

        // Try to get the stored value from constant propagation
        let valueAnnotation = "";
        if (isWrite) {
          const constEntry = constPropEnrichments.find(
            (e: REBlockEnrichment) => e.data?.instructionAddress === inst.address
          );
          const value = constEntry?.data?.value as number | undefined;

          if (value !== undefined && COLOR_REGISTERS.has(target)) {
            const colorName = C64_COLORS[value & 0x0F] ?? `color ${value}`;
            valueAnnotation = ` (= ${colorName})`;
          } else if (value !== undefined) {
            valueAnnotation = ` (= $${value.toString(16).toUpperCase().padStart(2, "0")})`;
          }
        }

        const action = isWrite ? "Set" : "Read";
        const bankingNote = banking.ioMapped === "unknown" ? " [banking unknown]" : "";

        enrichments.push({
          blockAddress: block.address,
          source: this.name,
          type: "register_semantic",
          annotation: `${action} ${regDesc}${valueAnnotation}${bankingNote}`,
          data: {
            instructionAddress: inst.address,
            registerAddress: target,
            registerName: regDesc,
            action: isWrite ? "write" : "read",
            value: undefined, // Will be filled by const prop lookup
            ioMapped: banking.ioMapped,
          },
        });
      }
    }

    return { enrichments };
  }

  private parseAbsoluteTarget(inst: BlockInstruction): number | null {
    if (inst.addressingMode !== "absolute") return null;
    const match = inst.operand.match(/^\$([0-9a-fA-F]{4})$/);
    if (match) return parseInt(match[1], 16);
    return null;
  }

  private blockToNodeId(block: Block): string {
    const type = block.type === "data" || block.type === "unknown" ? "data" : "code";
    return `${type}_${block.address.toString(16).padStart(4, "0")}`;
  }
}
