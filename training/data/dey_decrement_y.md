# COMMODORE 64 - DEY

**Summary:** DEY — Decrement index Y by one (Y - 1 -> Y); affects N and Z flags; addressing mode: Implied; opcode: 88; size: 1 byte; cycles: 2 (Ref: 7.7).

## Operation
DEY decrements the Y index register by one and stores the result back into Y (Y <- Y - 1). It updates the negative (N) flag from bit 7 of the result and the zero (Z) flag if the result is zero. Carry (C), Interrupt (I), Decimal (D), and Overflow (V) are not affected by this instruction.

**Encoding / timing**
- Addressing mode: Implied
- Opcode: 88
- Instruction length: 1 byte
- Cycles: 2

**Reference:** (Ref: 7.7)

**[Note: Source may contain an error — the source table shows "Operation: X - 1 -> Y", which contradicts the instruction name and function; correct operation is Y - 1 -> Y.]**

## Source Code
```text
  DEY                   DEY Decrement index Y by one                    DEY

  Operation:  X - 1 -> Y                                N Z C I D V
                                                        / / _ _ _ _
                                 (Ref: 7.7)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Implied       |   DEY                 |    88   |    1    |    2     |
  +----------------+-----------------------+---------+---------+----------+
```

## References
- "dex_decrement_x" — decrement X instruction (related index operation)
- "iny_increment_y" — increment Y instruction (inverse operation)
- "ldy_load_y" — load Y from memory
- "tay_transfer_a_to_y" — transfer A to Y (register transfer affecting Y)

## Mnemonics
- DEY
