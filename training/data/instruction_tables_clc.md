# 6502: CLC (Clear Carry) — opcode $18

**Summary:** CLC clears the processor carry flag (C) to 0. Implied addressing, opcode $18, 1 byte, 2 cycles; affects only the C flag (N, Z, I, D, V unchanged).

## Details
CLC (Clear Carry) sets the carry flag C to 0. It uses the implied addressing mode (no operand bytes). Instruction timing is 2 CPU cycles and the instruction length is 1 byte. Only the carry flag is modified; negative (N), zero (Z), interrupt disable (I), decimal (D), and overflow (V) flags remain unchanged.

Status flags after execution:
- N: unchanged
- Z: unchanged
- C: 0 (cleared)
- I: unchanged
- D: unchanged
- V: unchanged

Use cases: clear the carry before ADC/ROL/ROR sequences where you require a defined carry input. (No further usage notes are added beyond source.)

(Ref: 3.0.2)

## Source Code
```asm
; Encoding example
CLC     ; opcode $18
; Machine code: 18
; Bytes: 1
; Cycles: 2
```

```text
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Implied       |   CLC                 |   $18   |    1    |    2     |
+----------------+-----------------------+---------+---------+----------+

Operation: 0 -> C

Status flags (N Z C I D V):
_ _ 0 _ _ _
```

## References
- "instruction_operation_clc" — expands on CLC pseudocode

## Mnemonics
- CLC
