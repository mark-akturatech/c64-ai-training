# 6502 INX (Increment X) — opcode $E8

**Summary:** INX (Implied) increments the X index register by one (X -> X + 1). Opcode $E8, 1 byte, 2 cycles; updates Negative (N) and Zero (Z) flags, other flags unchanged.

## Operation
INX adds 1 to the X register and stores the result back in X (X + 1 -> X). The instruction is implied addressing, single-byte, and takes 2 CPU cycles. It affects the processor status as follows:
- N (Negative) — set according to bit 7 of the result (1 = negative)
- Z (Zero) — set if result is zero
- C, I, D, V — unchanged

Note: arithmetic is modulo 256 (incrementing $FF wraps to $00). (Ref: 7.4)

## Source Code
```text
INX                    INX Increment Index X by one                   INX
                                                      N Z C I D V
Operation:  X + 1 -> X                                / / _ _ _ _
                                 (Ref: 7.4)
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Implied       |   INX                 |    E8   |    1    |    2     |
+----------------+-----------------------+---------+---------+----------+
```

## References
- "instruction_operation_inx" — expands on INX pseudocode and behavior

## Mnemonics
- INX
