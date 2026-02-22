// ============================================================================
// SID Annotation Enrichment (Priority 88)
//
// Higher-level SID annotations: detects voice setup (waveform + frequency +
// ADSR), filter configuration, music player init/play patterns.
// ============================================================================

import type { Block, BlockInstruction } from "@c64/shared";
import type {
  EnrichmentPlugin,
  EnrichmentInput,
  EnrichmentResult,
  REBlockEnrichment,
} from "../types.js";

const SID_BASE = 0xD400;
const VOICE_OFFSETS = [0, 7, 14]; // Voice 1/2/3 register offsets
const WAVEFORMS: Record<number, string> = {
  0x01: "gate on",
  0x11: "triangle",
  0x21: "sawtooth",
  0x41: "pulse",
  0x81: "noise",
};

export class SidAnnotationEnrichment implements EnrichmentPlugin {
  name = "sid_annotation";
  priority = 88;

  enrich(input: EnrichmentInput): EnrichmentResult {
    const enrichments: REBlockEnrichment[] = [];

    for (const block of input.blocks) {
      if (!block.instructions || block.instructions.length === 0) continue;
      if (block.type === "data" || block.type === "unknown") continue;

      const annotations = this.analyzeSidUsage(block);
      enrichments.push(...annotations);
    }

    return { enrichments };
  }

  private analyzeSidUsage(block: Block): REBlockEnrichment[] {
    const results: REBlockEnrichment[] = [];
    const insts = block.instructions!;

    // Track SID register writes
    const sidWrites = new Map<number, number>();
    let aValue: number | null = null;

    for (const inst of insts) {
      const mn = inst.mnemonic.toLowerCase();

      if (mn === "lda" && inst.addressingMode === "immediate") {
        aValue = this.parseImmediate(inst);
      }

      if (mn === "sta" && aValue !== null) {
        const target = this.parseAbsoluteTarget(inst);
        if (target !== null && target >= 0xD400 && target <= 0xD418) {
          sidWrites.set(target, aValue);
        }
      }

      if (mn === "lda" && inst.addressingMode !== "immediate") {
        aValue = null;
      }
    }

    if (sidWrites.size === 0) return results;

    // Detect voice setup patterns
    for (let voice = 0; voice < 3; voice++) {
      const base = SID_BASE + VOICE_OFFSETS[voice];
      const freqLo = sidWrites.get(base);
      const freqHi = sidWrites.get(base + 1);
      const control = sidWrites.get(base + 4);
      const ad = sidWrites.get(base + 5);
      const sr = sidWrites.get(base + 6);

      const setupParts: string[] = [];
      if (freqLo !== undefined || freqHi !== undefined) {
        const freq = ((freqHi ?? 0) << 8) | (freqLo ?? 0);
        setupParts.push(`freq=$${freq.toString(16).toUpperCase()}`);
      }
      if (control !== undefined) {
        const waveform = WAVEFORMS[control & 0xF1] ?? `$${control.toString(16).toUpperCase()}`;
        setupParts.push(`waveform=${waveform}`);
      }
      if (ad !== undefined) {
        const attack = (ad >> 4) & 0x0F;
        const decay = ad & 0x0F;
        setupParts.push(`A=${attack} D=${decay}`);
      }
      if (sr !== undefined) {
        const sustain = (sr >> 4) & 0x0F;
        const release = sr & 0x0F;
        setupParts.push(`S=${sustain} R=${release}`);
      }

      if (setupParts.length >= 2) {
        results.push({
          blockAddress: block.address,
          source: this.name,
          type: "register_semantic",
          annotation: `SID Voice ${voice + 1} setup: ${setupParts.join(", ")}`,
          data: {
            voice: voice + 1,
            setup: setupParts,
            registers: Object.fromEntries(
              [...sidWrites].filter(([addr]) =>
                addr >= base && addr < base + 7
              )
            ),
          },
        });
      }
    }

    // Detect filter/volume setup
    const filterLo = sidWrites.get(0xD415);
    const filterHi = sidWrites.get(0xD416);
    const filterRes = sidWrites.get(0xD417);
    const volume = sidWrites.get(0xD418);

    if (volume !== undefined) {
      const vol = volume & 0x0F;
      const filterMode = (volume >> 4) & 0x0F;
      const modes: string[] = [];
      if (filterMode & 0x01) modes.push("low-pass");
      if (filterMode & 0x02) modes.push("band-pass");
      if (filterMode & 0x04) modes.push("high-pass");

      results.push({
        blockAddress: block.address,
        source: this.name,
        type: "register_semantic",
        annotation: `SID volume=${vol}${modes.length > 0 ? `, filter: ${modes.join("+")}` : ""}`,
        data: {
          volume: vol,
          filterModes: modes,
          filterCutoff: filterHi !== undefined ? ((filterHi << 3) | ((filterLo ?? 0) & 0x07)) : undefined,
          filterResonance: filterRes !== undefined ? (filterRes >> 4) : undefined,
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
