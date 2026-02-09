# CPX — Compare Memory and Index X

**Summary:** CPX compares the X index register with a memory operand (operation X - M), affects flags N, Z, C (I, D, V unaffected), and supports Immediate, Zero Page and Absolute addressing with opcodes $E0, $E4, $EC (see Ref: 7.8).

## Description
CPX performs a subtraction of the memory operand from the X register (X - M) for the purpose of setting processor flags — the result is not stored. Flags affected:
- N (Negative) — set from bit 7 of the subtraction result.
- Z (Zero) — set if X == M.
- C (Carry) — set if X >= M (no borrow).
- I, D, V — not affected by CPX.

Assembly forms (operand syntax):
- Immediate: CPX #oper
- Zero Page: CPX oper
- Absolute: CPX oper

Reference: 6502 manual section Ref: 7.8.

## Source Code
(omitted — no assembly listings or data tables provided in source)

## Key Registers
(omitted — instruction does not reference specific memory-mapped chip registers)

## References
- "cmp_compare_accumulator" — CMP (Compare Accumulator) related instruction
- "cpy_compare_index_y" — CPY (Compare Index Y) related instruction