// ============================================================================
// IRQ Volatility Model — tracks which hardware registers may be modified
// asynchronously by IRQ handlers.
//
// Three-tier model (based on Regehr & Cooprider's Interatomic analysis):
// 1. IRQ-safe (irqsDisabled="yes"): between SEI/CLI, full precision
// 2. IRQ-exposed (irqsDisabled="no"): IRQ-volatile registers are unknown
// 3. Stable: registers NOT in the IRQ-volatile set, full precision always
//
// SEI/CLI propagation rules:
// - SEI → irqsDisabled = "yes"
// - CLI → irqsDisabled = "no"
// - RTI → "unknown" (restores P from stack, I flag unknown)
// - PLP → "unknown" (same)
// - IRQ handler entry → "yes" (6502 hardware sets I flag on entry)
// - Branch merge: if paths disagree → "unknown"
// ============================================================================

import type { IRQSafetyState, Ternary } from "./types.js";

/** Create default IRQ safety state (IRQs enabled, no volatile registers) */
export function defaultIRQSafetyState(): IRQSafetyState {
  return {
    irqsDisabled: "no",
    irqVolatileRegisters: new Set(),
    nmiVolatileRegisters: new Set(),
  };
}

/** Create IRQ safety state for IRQ handler entry (hardware sets I flag) */
export function irqHandlerEntryState(): IRQSafetyState {
  return {
    irqsDisabled: "yes",
    irqVolatileRegisters: new Set(),
    nmiVolatileRegisters: new Set(),
  };
}

/** Apply SEI instruction */
export function applySEI(state: IRQSafetyState): IRQSafetyState {
  return { ...state, irqsDisabled: "yes" };
}

/** Apply CLI instruction */
export function applyCLI(state: IRQSafetyState): IRQSafetyState {
  return { ...state, irqsDisabled: "no" };
}

/** Apply RTI instruction (restores P from stack, I flag unknown) */
export function applyRTI(state: IRQSafetyState): IRQSafetyState {
  return { ...state, irqsDisabled: "unknown" };
}

/** Apply PLP instruction (restores P from stack, I flag unknown) */
export function applyPLP(state: IRQSafetyState): IRQSafetyState {
  return { ...state, irqsDisabled: "unknown" };
}

/** Meet two IRQ safety states at a control flow merge */
export function meetIRQSafety(a: IRQSafetyState, b: IRQSafetyState): IRQSafetyState {
  return {
    irqsDisabled: meetTernary(a.irqsDisabled, b.irqsDisabled),
    irqVolatileRegisters: new Set([...a.irqVolatileRegisters, ...b.irqVolatileRegisters]),
    nmiVolatileRegisters: new Set([...a.nmiVolatileRegisters, ...b.nmiVolatileRegisters]),
  };
}

function meetTernary(a: Ternary, b: Ternary): Ternary {
  if (a === b) return a;
  return "unknown";
}

/** Add hardware register addresses to the IRQ-volatile set */
export function addIRQVolatileRegisters(
  state: IRQSafetyState,
  registers: Iterable<number>,
): IRQSafetyState {
  const newSet = new Set(state.irqVolatileRegisters);
  for (const r of registers) newSet.add(r);
  return { ...state, irqVolatileRegisters: newSet };
}

/** Add hardware register addresses to the NMI-volatile set */
export function addNMIVolatileRegisters(
  state: IRQSafetyState,
  registers: Iterable<number>,
): IRQSafetyState {
  const newSet = new Set(state.nmiVolatileRegisters);
  for (const r of registers) newSet.add(r);
  return { ...state, nmiVolatileRegisters: newSet };
}

/** Check if a hardware register is potentially volatile at a given state */
export function isVolatileRegister(state: IRQSafetyState, address: number): boolean {
  // NMI is always volatile (non-maskable)
  if (state.nmiVolatileRegisters.has(address)) return true;
  // IRQ-volatile registers are only volatile when IRQs are enabled or unknown
  if (state.irqsDisabled === "yes") return false;
  return state.irqVolatileRegisters.has(address);
}

/** Check if two IRQ safety states are equal (for fixpoint detection) */
export function irqSafetyEquals(a: IRQSafetyState, b: IRQSafetyState): boolean {
  if (a.irqsDisabled !== b.irqsDisabled) return false;
  if (a.irqVolatileRegisters.size !== b.irqVolatileRegisters.size) return false;
  if (a.nmiVolatileRegisters.size !== b.nmiVolatileRegisters.size) return false;
  for (const r of a.irqVolatileRegisters) {
    if (!b.irqVolatileRegisters.has(r)) return false;
  }
  for (const r of a.nmiVolatileRegisters) {
    if (!b.nmiVolatileRegisters.has(r)) return false;
  }
  return true;
}
