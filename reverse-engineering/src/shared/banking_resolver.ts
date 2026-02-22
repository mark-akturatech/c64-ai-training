// ============================================================================
// Banking Resolver — banking-aware label resolution
//
// Given an address and the banking state at that point, produces the correct
// label. KERNAL is only labeled when mapped; otherwise produces "ram_XXXX"
// or "maybe_XXXX" labels.
// ============================================================================

import type { BankingSnapshot, SymbolEntry } from "../types.js";
import { SymbolDB } from "./symbol_db.js";

const symbolDb = new SymbolDB();

export interface ResolvedLabel {
  label: string;
  description: string;
  confidence: "known" | "probable" | "uncertain";
}

/**
 * Resolve a label for an address, taking banking state into account.
 *
 * For KERNAL addresses ($E000-$FFFF):
 * - kernalMapped="yes" → CHROUT (known)
 * - kernalMapped="no" → ram_FFD2 (known — it's RAM at that address)
 * - kernalMapped="unknown" → maybe_CHROUT (uncertain)
 *
 * For I/O addresses ($D000-$DFFF):
 * - ioMapped="yes" → EXTCOL (known)
 * - ioMapped="no" → CharROM or RAM at $Dxxx
 * - ioMapped="unknown" → maybe_EXTCOL (uncertain)
 */
export function resolveLabelForAddress(
  address: number,
  banking: BankingSnapshot,
): ResolvedLabel | null {
  const sym = symbolDb.lookup(address);

  // KERNAL ROM range ($E000-$FFFF)
  if (address >= 0xE000 && address <= 0xFFFF) {
    if (banking.kernalMapped === "yes") {
      if (sym && sym.category === "kernal") {
        return { label: sym.name, description: sym.description, confidence: "known" };
      }
      return { label: `kernal_${hex(address)}`, description: "KERNAL ROM address", confidence: "known" };
    }
    if (banking.kernalMapped === "no") {
      return { label: `ram_${hex(address)}`, description: "RAM (KERNAL banked out)", confidence: "known" };
    }
    // Unknown banking
    if (sym && sym.category === "kernal") {
      return { label: `maybe_${sym.name}`, description: `${sym.description} (banking unknown)`, confidence: "uncertain" };
    }
    return { label: `addr_${hex(address)}`, description: "KERNAL/RAM (banking unknown)", confidence: "uncertain" };
  }

  // BASIC ROM range ($A000-$BFFF)
  if (address >= 0xA000 && address <= 0xBFFF) {
    if (banking.basicMapped === "yes") {
      return { label: `basic_${hex(address)}`, description: "BASIC ROM address", confidence: "known" };
    }
    if (banking.basicMapped === "no") {
      return { label: `ram_${hex(address)}`, description: "RAM (BASIC banked out)", confidence: "known" };
    }
    return { label: `addr_${hex(address)}`, description: "BASIC/RAM (banking unknown)", confidence: "uncertain" };
  }

  // I/O range ($D000-$DFFF)
  if (address >= 0xD000 && address <= 0xDFFF) {
    if (banking.ioMapped === "yes") {
      if (sym && sym.category === "hardware") {
        return { label: sym.name, description: sym.description, confidence: "known" };
      }
      return { label: `io_${hex(address)}`, description: "I/O register", confidence: "known" };
    }
    if (banking.ioMapped === "no") {
      if (banking.chargenMapped === "yes") {
        return { label: `charrom_${hex(address)}`, description: "Character ROM", confidence: "known" };
      }
      return { label: `ram_${hex(address)}`, description: "RAM (I/O banked out)", confidence: "known" };
    }
    // Unknown banking
    if (sym && sym.category === "hardware") {
      return { label: `maybe_${sym.name}`, description: `${sym.description} (banking unknown)`, confidence: "uncertain" };
    }
    return { label: `addr_${hex(address)}`, description: "I/O/RAM (banking unknown)", confidence: "uncertain" };
  }

  // Non-banked addresses — use symbol_db directly
  if (sym) {
    return { label: sym.name, description: sym.description, confidence: "known" };
  }

  return null;
}

function hex(addr: number): string {
  return addr.toString(16).toUpperCase().padStart(4, "0");
}
