// Symbol DB Annotation (Priority 10)
// Known C64 symbols — banking-aware: only KERNAL names if ROM mapped.

import type { AnnotationSource, AnnotationSourceInput } from "./types.js";

export class SymbolDbAnnotation implements AnnotationSource {
  name = "symbol_db";
  priority = 10;

  annotate(input: AnnotationSourceInput): string | null {
    const mn = input.instruction.mnemonic.toLowerCase();

    // For JSR/JMP, annotate the target
    if (mn === "jsr" || mn === "jmp") {
      const target = parseAbsoluteAddress(input.instruction.operand);
      if (target === null) return null;
      const sym = input.symbolDb.lookupWithBanking(target, input.bankingState);
      if (sym) return `${sym.name} — ${sym.description}`;
      return null;
    }

    // For STA/LDA/etc to hardware registers, annotate the register
    if (isMemoryAccess(mn)) {
      const target = parseAbsoluteAddress(input.instruction.operand);
      if (target === null) return null;
      if (target < 0xD000 || target > 0xDFFF) return null; // Only I/O range
      const sym = input.symbolDb.lookupWithBanking(target, input.bankingState);
      if (sym) return `${sym.name} — ${sym.description}`;
    }

    return null;
  }
}

function parseAbsoluteAddress(operand: string): number | null {
  const match = operand.match(/^\$([0-9a-fA-F]{4})/);
  if (match) return parseInt(match[1], 16);
  return null;
}

function isMemoryAccess(mn: string): boolean {
  return ["lda", "ldx", "ldy", "sta", "stx", "sty", "cmp", "cpx", "cpy", "bit",
    "asl", "lsr", "rol", "ror", "inc", "dec"].includes(mn);
}
