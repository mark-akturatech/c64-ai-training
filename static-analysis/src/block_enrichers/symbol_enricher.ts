import type { Block } from "../types.js";
import type { BlockEnricher, EnricherContext } from "./types.js";
import { KERNAL_SYMBOLS, HARDWARE_SYMBOLS, COMPARISON_HINTS } from "../symbol_db.js";

export class SymbolEnricher implements BlockEnricher {
  name = "symbol_enricher";
  description = "Applies known C64 symbols (KERNAL, hardware, ZP labels)";
  priority = 10;

  enrich(blocks: Block[], _context: EnricherContext): Block[] {
    for (const block of blocks) {
      if (block.type === "data" || block.type === "unknown") continue;
      if (!block.annotations) block.annotations = {};

      // Label KERNAL calls
      if (block.callsOut) {
        for (const addr of block.callsOut) {
          const sym = KERNAL_SYMBOLS[addr];
          if (sym) {
            block.annotations[`call_${addr.toString(16)}`] =
              `${sym.name}: ${sym.description}${sym.calling ? ` (${sym.calling})` : ""}`;
          }
        }
      }

      // Label hardware register accesses
      if (block.hardwareRefs) {
        for (const addr of block.hardwareRefs) {
          const sym = HARDWARE_SYMBOLS[addr];
          if (sym) {
            block.annotations[`hw_${addr.toString(16)}`] =
              `${sym.name}: ${sym.description}`;
          }
        }
      }

      // Add comparison hints to instructions
      if (block.instructions) {
        for (const inst of block.instructions) {
          if (
            (inst.mnemonic === "cmp" || inst.mnemonic === "cpx" || inst.mnemonic === "cpy") &&
            inst.addressingMode === "immediate"
          ) {
            const match = inst.operand.match(/^#\$([0-9A-Fa-f]{2})$/);
            if (match) {
              const value = parseInt(match[1], 16);
              const hint = COMPARISON_HINTS[value];
              if (hint) {
                block.annotations[`cmp_${inst.address.toString(16)}`] = hint;
              }
            }
          }
        }
      }
    }
    return blocks;
  }
}
