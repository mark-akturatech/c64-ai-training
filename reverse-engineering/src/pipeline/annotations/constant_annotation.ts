// Constant Annotation (Priority 30)
// Well-known constants like screen width (40), color mask ($0F), etc.

import type { AnnotationSource, AnnotationSourceInput } from "./types.js";

const WELL_KNOWN: Record<number, string> = {
  40: "screen width",
  25: "screen height",
  0x0F: "color mask (lower nybble)",
  0xF0: "upper nybble mask",
  0xFE: "bit 0 clear mask",
  0x01: "bit 0 set mask",
  0xFF: "all bits set",
  0x80: "bit 7 / sign bit",
  0x7F: "bit 7 clear mask",
  0x3F: "6-bit mask (63)",
  0x1F: "5-bit mask (31)",
};

export class ConstantAnnotation implements AnnotationSource {
  name = "constant";
  priority = 30;

  annotate(input: AnnotationSourceInput): string | null {
    const mn = input.instruction.mnemonic.toLowerCase();

    // Only for immediate mode operations
    if (input.instruction.addressingMode !== "immediate") return null;

    // Only for meaningful operations (AND/ORA/EOR with masks, CMP with constants)
    if (!["and", "ora", "eor", "cmp", "cpx", "cpy"].includes(mn)) return null;

    const value = parseImmediate(input.instruction.operand);
    if (value === null) return null;

    const meaning = WELL_KNOWN[value];
    if (meaning) return meaning;

    return null;
  }
}

function parseImmediate(operand: string): number | null {
  const match = operand.match(/^#\$([0-9a-fA-F]+)$/);
  if (match) return parseInt(match[1], 16);
  const decMatch = operand.match(/^#(\d+)$/);
  if (decMatch) return parseInt(decMatch[1], 10);
  return null;
}
