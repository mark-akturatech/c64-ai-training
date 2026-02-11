# 6502 Implicit Addressing (Implied)

**Summary:** Implicit (implied) addressing on the 6502 is when an instruction requires no operand because the target is implied by the opcode; common examples are `CLC` (clear carry flag) and `TAX` (transfer accumulator to X). Implied instructions save memory because only the opcode byte is stored.

## Implicit addressing
Implicit addressing means the instruction encodes its target entirely in the opcode; no operand bytes follow. Typical uses:
- Processor status/control: instructions that set or clear flags, e.g. `CLC` (clear carry flag), `SEC` (set carry).
- Register-to-register transfers: e.g. `TAX` (A → X), `TXA` (X → A), `TSX`, `TXS`.
- Stack and flow control single-byte instructions: `PHA`, `PLA`, `RTS`, `RTI`, `NOP`.
- Single-register operations without addressing: `INX`, `DEX`, `INY`, `DEY`.

Advantages and notes:
- Saves memory: only one opcode byte is stored versus opcodes that include operand bytes.
- Predictable timing: implied-mode instructions have fixed cycle counts (consult instruction table for exact cycles).
- Distinct from accumulator addressing (operand `A` explicitly used by some instructions) — see accumulator addressing for that variant.

(See "accumulator_addressing" for the operand-less form that explicitly uses the accumulator `A`.)

## References
- "accumulator_addressing" — expands on the other operand-less form (uses `A` explicitly)