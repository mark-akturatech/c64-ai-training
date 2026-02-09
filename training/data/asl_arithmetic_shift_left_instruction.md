# ASL — Arithmetic Shift Left (6502)

**Summary:** ASL (Arithmetic Shift Left) shifts a byte left one bit (C ← bit7; bit0 ← 0) for accumulator or memory operands; affects flags N, Z, C (I, D, V unchanged). Opcodes: $0A (Accumulator), $06 (Zero Page), $16 (Zero Page,X), $0E (Absolute), $1E (Absolute,X). (Ref: 10.2)

## Operation
ASL shifts the operand one bit toward the high bit. The prior bit7 is moved into the Carry flag; bit0 is cleared to 0. The Negative flag (N) is set from the new bit7 of the result; Zero (Z) is set if the result is zero; Carry (C) receives the old bit7. Interrupt, Decimal and Overflow flags (I, D, V) are unaffected. Applicable to the accumulator (ASL A) or a memory location (ASL oper).

## Source Code
```asm
  ASL          ASL Shift Left One Bit (Memory or Accumulator)           ASL
                   +-+-+-+-+-+-+-+-+
  Operation:  C <- |7|6|5|4|3|2|1|0| <- 0
                   +-+-+-+-+-+-+-+-+                    N Z C I D V
                                                        / / / _ _ _
                                 (Ref: 10.2)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Accumulator   |   ASL A               |    0A   |    1    |    2     |
  |  Zero Page     |   ASL Oper            |    06   |    2    |    5     |
  |  Zero Page,X   |   ASL Oper,X          |    16   |    2    |    6     |
  |  Absolute      |   ASL Oper            |    0E   |    3    |    6     |
  |  Absolute, X   |   ASL Oper,X          |    1E   |    3    |    7     |
  +----------------+-----------------------+---------+---------+----------+
```

## References
- "and_logical_and_instruction" — previous logical instruction (AND)
- "bcc_branch_on_carry_clear" — next instruction group (BCC)