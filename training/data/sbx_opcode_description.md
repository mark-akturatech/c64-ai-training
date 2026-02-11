# SBX (AXS / SAX / XMA) — undocumented $CB

**Summary:** Undocumented 6510 opcode $CB (often called SBX, also seen as AXS/SAX/XMA) — immediate form: SBX #imm. Performs X = (A AND X) - #imm, stores result in X, sets N and Z from X, sets Carry like CMP, ignores Decimal mode.

## Operation
SBX (opcode $CB) performs a logical AND between A and X, subtracts an immediate value (as CMP does), and stores the subtraction result into X. The A register is left unchanged.

- Mnemonic: SBX #imm
- Opcode: $CB
- Size: 2 bytes (opcode + immediate)
- Cycles: 2

Behavior and flags:
- Result: X <- (A & X) - immediate
- A is not modified.
- Carry: affected like CMP (set/clear according to the subtraction result); the instruction does not use the Carry flag as a borrow input (unlike SBC) — it computes the subtraction in the CMP style and sets Carry accordingly.
- Overflow (V): not affected.
- Negative (N): set according to bit 7 of the resulting X.
- Zero (Z): set if resulting X == 0.
- Decimal mode (D): ignored — the subtraction behavior is CMP-derived and does not perform BCD correction, so SBX is unaffected by the Decimal flag.

Type note from source: described as a combination of an immediate operation and an implied command (source lists sub-instructions: CMP, DEX). Practical effect is the AND then CMP-like subtraction storing the result into X.

## Source Code
```text
Opcode: $CB
Mnemonic: SBX #imm
Operation: X = (A & X) - #imm
Size: 2 bytes
Cycles: 2

Flags affected:
- N: set from result in X
- V: unaffected
- B: (no change specified)
- D: not used (ignored)
- I: (no change specified)
- Z: set from result in X
- C: set like CMP (reflects (A & X) >= #imm)

Aliases: AXS, SAX, XMA  ; assembler/name variants for the same opcode
Notes: Derived from CMP semantics for subtraction (no borrow input), does not set Overflow, Decimal mode not respected.
```

## References
- "arr_opcode_flags_and_table" — related undocumented opcode coverage and flag behavior tables

## Mnemonics
- SBX
- AXS
- SAX
- XMA
