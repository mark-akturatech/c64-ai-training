/**
 * 6502 opcode enrichment plugin.
 *
 * Detects 6502 instruction mnemonics in query text and adds them as
 * filter tags — but only when the query has no hex addresses. When
 * addresses are present, address-based filtering is more useful and
 * opcode tags would just waste filter slots.
 */

import type { EnrichmentPlugin, EnrichmentInput, EnrichmentResult } from "./types.js";

/** All official + common undocumented 6502 opcodes */
const OPCODES: ReadonlySet<string> = new Set([
  // Official
  "LDA", "STA", "LDX", "STX", "LDY", "STY",
  "ADC", "SBC", "AND", "ORA", "EOR",
  "INC", "DEC", "INX", "INY", "DEX", "DEY",
  "ASL", "LSR", "ROL", "ROR",
  "BIT", "CMP", "CPX", "CPY",
  "JMP", "JSR", "RTS", "RTI", "BRK", "NOP",
  "BCC", "BCS", "BEQ", "BNE", "BMI", "BPL", "BVC", "BVS",
  "CLC", "SEC", "CLD", "SED", "CLI", "SEI", "CLV",
  "PHA", "PLA", "PHP", "PLP",
  "TAX", "TXA", "TAY", "TYA", "TSX", "TXS",
  // Common undocumented
  "DCP", "DCM", "ISB", "ISC", "INS", "LAX", "SAX", "AXS",
  "SLO", "ASO", "RLA", "SRE", "LSE", "RRA", "ANC", "ALR",
  "ARR", "XAA", "ANE", "LAS", "TAS", "SHA", "SHX", "SHY",
]);

const WORD_PATTERN = /\b[A-Z]{3}\b/g;

export class OpcodeEnrichment implements EnrichmentPlugin {
  name = "opcode";

  enrich(input: EnrichmentInput): EnrichmentResult {
    // Skip if query contains hex addresses — address filtering takes priority
    const hasAddresses = input.numbers.some((n) => n.value > 255);
    if (hasAddresses) return { additionalContext: [], filterTags: [] };

    const filterTags: string[] = [];
    const seen = new Set<string>();

    const words = input.query.match(WORD_PATTERN) || [];
    for (const word of words) {
      const upper = word.toUpperCase();
      if (OPCODES.has(upper) && !seen.has(upper)) {
        seen.add(upper);
        filterTags.push(upper);
      }
    }

    return { additionalContext: [], filterTags };
  }
}
