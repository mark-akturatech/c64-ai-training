# INY — Increment Index Y

**Summary:** INY increments the Y index register by 1 (wraps at 8 bits). Implied addressing, opcode $C8, 1 byte, 2 cycles. Affects processor flags N (negative) and Z (zero); other flags unchanged. (Ref: 7.5)

## Description
INY performs Y <- Y + 1 on the 6502 core (C64). The operation is performed modulo 256 (8-bit wrap): incrementing $FF yields $00. After the result is written to Y the processor updates:
- Z set if result == $00, cleared otherwise.
- N set to the high bit (bit 7) of the result, cleared otherwise.
- C, V, I, D are unaffected.

Use case: adjust Y for indexed addressing or loop counters where only Y must change. Implied addressing: there is no operand byte.

**[Note: Source may contain an error — the original operation line shows "X + 1 -> X"; it should be "Y + 1 -> Y".]**

## Source Code
```text
INY  INY  Increment Index Y by one  INY

Operation:  Y + 1 -> Y                 N Z C I D V
                                     / / _ _ _ _

(Ref: 7.5)

+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Implied       |   INY                 |    C8   |    1    |    2     |
+----------------+-----------------------+---------+---------+----------+
```

## References
- "dey_decrement_y" — DEY (decrement Y)
- "tay_transfer_a_to_y" — TAY (transfer A to Y)
- "ldy_load_y" — LDY (load Y from memory)

## Mnemonics
- INY
