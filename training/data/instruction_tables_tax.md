# TAX (Transfer Accumulator to X)

**Summary:** Implied 6502 instruction TAX (opcode $AA) copies A to X, updates the N and Z flags based on the result, is 1 byte long and takes 2 CPU cycles.

## Operation
Performs a register transfer: A -> X.

- Assembly: `TAX`
- Opcode: $AA
- Addressing mode: Implied
- Size: 1 byte
- Cycles: 2

Flags:
- N (Negative) — set to bit 7 of X after the transfer (1 if bit7=1).
- Z (Zero) — set if X == 0 after the transfer.
- C, I, D, V — unaffected.

Pseudocode:
- X := A
- Set N = (X & %10000000) != 0
- Set Z = (X == 0)

(Ref: 7.11)

## References
- "instruction_operation_tax" — expands on TAX pseudocode and operation details

## Mnemonics
- TAX
