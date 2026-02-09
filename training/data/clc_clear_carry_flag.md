# CLC — Clear Carry Flag

**Summary:** Clears the CPU carry flag (0 -> C). Implied addressing, opcode $18, 1 byte, 2 cycles. Affects status flags N Z C I D V (C → 0, others unchanged). (Ref: 3.0.2)

## Description
CLC forces the processor carry flag to 0. It uses the implied addressing mode (no operand). The instruction does not modify the negative, zero, interrupt, decimal, or overflow flags — only the carry flag is cleared.

- Operation: 0 -> C
- Flags after instruction: N unaffected, Z unaffected, C = 0, I unaffected, D unaffected, V unaffected
- Assembler mnemonic: CLC
- Opcode: $18
- Size: 1 byte
- Cycles: 2

(Ref: 3.0.2)

## Source Code
```text
CLC                       CLC Clear carry flag                        CLC

Operation:  0 -> C                                    N Z C I D V
                                                      _ _ 0 _ _ _
                              (Ref: 3.0.2)
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Implied       |   CLC                 |    18   |    1    |    2     |
+----------------+-----------------------+---------+---------+----------+
```

## References
- "bvs_branch_on_overflow_set" — branch on overflow set (BVS)
- "cld_clear_decimal_mode" — clear decimal mode (CLD)