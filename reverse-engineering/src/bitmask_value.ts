// ============================================================================
// Bitmask Abstract Domain — per-bit known/unknown tracking for register values
//
// Inspired by LLVM's KnownBits and Linux kernel's tnum (tristate numbers).
// See: "Sound, Precise, and Fast Abstract Interpretation with Tristate Numbers"
//      (CGO 2022 Distinguished Paper, arXiv:2105.05398)
//
// Transfer functions are proven sound and optimal. The bitmask domain gives
// per-bit precision for C64 banking register read-modify-write patterns like:
//   LDA $01 / AND #$F8 / ORA #$05 / STA $01
// ============================================================================

import type { BitmaskValue, RegisterValue } from "./types.js";
import { MAX_SET_SIZE } from "./types.js";

// ── BitmaskValue constructors ───────────────────────────────────

/** Fully known value (all bits known) */
export function bitmaskFromImm(imm: number): BitmaskValue {
  return { knownMask: 0xFF, knownValue: imm & 0xFF };
}

/** Fully unknown value (no bits known) */
export function bitmaskUnknown(): BitmaskValue {
  return { knownMask: 0x00, knownValue: 0x00 };
}

/** Check if a bitmask represents a fully known value */
export function isFullyKnown(bm: BitmaskValue): boolean {
  return bm.knownMask === 0xFF;
}

/** Get concrete value if fully known, null otherwise */
export function concreteValue(bm: BitmaskValue): number | null {
  return bm.knownMask === 0xFF ? bm.knownValue : null;
}

// ── Transfer functions for 6502 bitwise operations ──────────────

/**
 * AND #imm: bits where imm=0 become known-zero.
 * If input bit is known, AND with imm preserves/clears it.
 * If input bit is unknown and imm=0, result bit is known-zero.
 * If input bit is unknown and imm=1, result bit stays unknown.
 */
export function transferAND(input: BitmaskValue, imm: number): BitmaskValue {
  return {
    knownMask: input.knownMask | (~imm & 0xFF),    // imm=0 bits become known
    knownValue: input.knownValue & imm,              // imm=0 forces value to 0
  };
}

/**
 * ORA #imm: bits where imm=1 become known-one.
 * If input bit is unknown and imm=1, result bit is known-one.
 * If input bit is unknown and imm=0, result bit stays unknown.
 */
export function transferORA(input: BitmaskValue, imm: number): BitmaskValue {
  return {
    knownMask: input.knownMask | imm,               // imm=1 bits become known
    knownValue: input.knownValue | imm,              // imm=1 forces value to 1
  };
}

/**
 * EOR #imm: XOR preserves knowledge but flips known bits.
 * Known bits are flipped where imm=1, unchanged where imm=0.
 * Unknown bits stay unknown regardless of imm value.
 */
export function transferEOR(input: BitmaskValue, imm: number): BitmaskValue {
  return {
    knownMask: input.knownMask,                      // XOR preserves knowledge
    knownValue: (input.knownValue ^ imm) & 0xFF,    // flips known bits
  };
}

/** LDA #imm: fully known immediate value */
export function transferLDA_IMM(imm: number): BitmaskValue {
  return { knownMask: 0xFF, knownValue: imm & 0xFF };
}

/** LDA mem: fully unknown (loaded from memory, value unknown) */
export function transferLDA_MEM(): BitmaskValue {
  return { knownMask: 0x00, knownValue: 0x00 };
}

// ── Meet operation (control flow merge) ─────────────────────────

/**
 * Meet at control flow merge points: keep only what both paths agree on.
 * A bit is known in the result only if:
 * 1. It is known in BOTH inputs, AND
 * 2. Both inputs agree on its value.
 */
export function meetBitmask(a: BitmaskValue, b: BitmaskValue): BitmaskValue {
  const bothKnown = a.knownMask & b.knownMask;
  const agreeValue = ~(a.knownValue ^ b.knownValue) & 0xFF;
  const resultMask = bothKnown & agreeValue;
  return {
    knownMask: resultMask,
    knownValue: a.knownValue & resultMask,
  };
}

// ── Collapse value set to bitmask ───────────────────────────────

/**
 * Collapse a set of concrete values to a bitmask.
 * Bits that are the same across ALL values are known;
 * bits that differ in any value are unknown.
 */
export function collapseToMask(values: Set<number>): BitmaskValue {
  if (values.size === 0) return bitmaskUnknown();
  if (values.size === 1) {
    const v = values.values().next().value!;
    return bitmaskFromImm(v);
  }

  let allOnes = 0xFF;
  let allZeros = 0xFF;
  for (const v of values) {
    allOnes &= v;                // bits that are 1 in ALL values
    allZeros &= (~v & 0xFF);    // bits that are 0 in ALL values
  }
  return {
    knownMask: allOnes | allZeros,
    knownValue: allOnes,
  };
}

// ── RegisterValue helpers ───────────────────────────────────────

/** Create a RegisterValue from a known immediate */
export function registerFromImm(imm: number, source = "constant_propagation"): RegisterValue {
  return {
    bitmask: bitmaskFromImm(imm),
    possibleValues: new Set([imm & 0xFF]),
    isDynamic: false,
    source,
  };
}

/** Create a RegisterValue representing a fully unknown state */
export function registerUnknown(source = "dynamic"): RegisterValue {
  return {
    bitmask: bitmaskUnknown(),
    possibleValues: null,
    isDynamic: true,
    source,
  };
}

/** Create a RegisterValue from a set of possible values */
export function registerFromValues(values: Set<number>, source = "constant_propagation"): RegisterValue {
  if (values.size > MAX_SET_SIZE) {
    return {
      bitmask: collapseToMask(values),
      possibleValues: null,
      isDynamic: false,
      source,
    };
  }
  return {
    bitmask: collapseToMask(values),
    possibleValues: new Set(values),
    isDynamic: false,
    source,
  };
}

/** Apply AND #imm to a RegisterValue */
export function registerAND(input: RegisterValue, imm: number): RegisterValue {
  const newBitmask = transferAND(input.bitmask, imm);
  let newValues: Set<number> | null = null;
  if (input.possibleValues !== null) {
    newValues = new Set<number>();
    for (const v of input.possibleValues) {
      newValues.add(v & imm);
    }
    if (newValues.size > MAX_SET_SIZE) {
      newValues = null;
    }
  }
  return {
    bitmask: newBitmask,
    possibleValues: newValues,
    isDynamic: input.isDynamic,
    source: input.source,
  };
}

/** Apply ORA #imm to a RegisterValue */
export function registerORA(input: RegisterValue, imm: number): RegisterValue {
  const newBitmask = transferORA(input.bitmask, imm);
  let newValues: Set<number> | null = null;
  if (input.possibleValues !== null) {
    newValues = new Set<number>();
    for (const v of input.possibleValues) {
      newValues.add(v | imm);
    }
    if (newValues.size > MAX_SET_SIZE) {
      newValues = null;
    }
  }
  return {
    bitmask: newBitmask,
    possibleValues: newValues,
    isDynamic: input.isDynamic,
    source: input.source,
  };
}

/** Apply EOR #imm to a RegisterValue */
export function registerEOR(input: RegisterValue, imm: number): RegisterValue {
  const newBitmask = transferEOR(input.bitmask, imm);
  let newValues: Set<number> | null = null;
  if (input.possibleValues !== null) {
    newValues = new Set<number>();
    for (const v of input.possibleValues) {
      newValues.add((v ^ imm) & 0xFF);
    }
    if (newValues.size > MAX_SET_SIZE) {
      newValues = null;
    }
  }
  return {
    bitmask: newBitmask,
    possibleValues: newValues,
    isDynamic: input.isDynamic,
    source: input.source,
  };
}

/** Meet two RegisterValues at a control flow merge */
export function meetRegister(a: RegisterValue, b: RegisterValue): RegisterValue {
  const newBitmask = meetBitmask(a.bitmask, b.bitmask);
  let newValues: Set<number> | null = null;

  if (a.possibleValues !== null && b.possibleValues !== null) {
    // Union of both value sets
    newValues = new Set([...a.possibleValues, ...b.possibleValues]);
    if (newValues.size > MAX_SET_SIZE) {
      newValues = null;
    }
  }
  // If either side has null possibleValues, result is null (unknown set)

  return {
    bitmask: newBitmask,
    possibleValues: newValues,
    isDynamic: a.isDynamic || b.isDynamic,
    source: a.source === b.source ? a.source : "merged",
  };
}

/** Check if two BitmaskValues are equal */
export function bitmaskEquals(a: BitmaskValue, b: BitmaskValue): boolean {
  return a.knownMask === b.knownMask && a.knownValue === b.knownValue;
}

/** Check if two RegisterValues are equal (for fixpoint detection) */
export function registerEquals(a: RegisterValue, b: RegisterValue): boolean {
  if (!bitmaskEquals(a.bitmask, b.bitmask)) return false;
  if (a.isDynamic !== b.isDynamic) return false;
  if (a.possibleValues === null && b.possibleValues === null) return true;
  if (a.possibleValues === null || b.possibleValues === null) return false;
  if (a.possibleValues.size !== b.possibleValues.size) return false;
  for (const v of a.possibleValues) {
    if (!b.possibleValues.has(v)) return false;
  }
  return true;
}
