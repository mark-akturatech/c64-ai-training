# BIT — Test bits in memory with accumulator (6502)

**Summary:** BIT instruction (mnemonic BIT) performs A AND M, transfers memory bits 7 and 6 into the status flags (M7 -> N, M6 -> V), and sets Z if the AND result is zero; supported addressing modes: Zero Page ($24) and Absolute ($2C).

## Description
Operation: A /\ M (bitwise AND), M7 -> N, M6 -> V.

- Bit 7 of the memory operand (M7) is copied into the N (Negative) flag.
- Bit 6 of the memory operand (M6) is copied into the V (Overflow) flag.
- If (A AND M) == 0 then Z = 1, otherwise Z = 0.
- The instruction is presented in manuals as "BIT Test bits in memory with accumulator" (Ref: 4.2.1.1).

## Source Code
```text
Operation:  A /\ M, M7 -> N, M6 -> V
Ref: 4.2.1.1

+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
| Zero Page      | BIT Oper              | $24     |    2    |    3     |
| Absolute       | BIT Oper              | $2C     |    3    |    4     |
+----------------+-----------------------+---------+---------+----------+

Flags affected (notation from source): N Z C I D V
(Bit 7 of M -> N, Bit 6 of M -> V; Z set if A /\ M == 0)
```

## References
- "beq_branch_on_result_zero" — expands on previous branch instruction (BEQ)
- "bmi_branch_on_result_minus" — expands on next branch instruction (BMI)

## Mnemonics
- BIT
