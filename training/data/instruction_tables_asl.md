# 6502 ASL (Arithmetic Shift Left) Instruction

**Summary:** ASL shifts an operand left one bit, moving bit 7 into the Carry and inserting 0 into bit 0; it affects N, Z and C flags. Opcodes: $0A (accumulator), $06 (zero page), $16 (zero page,X), $0E (absolute), $1E (absolute,X); cycle counts 2–7.

## Description
ASL (Arithmetic Shift Left) shifts the selected operand left one bit. The former bit7 is copied into the Carry flag; bit0 is filled with zero. The accumulator form (ASL A) updates the A register; memory forms read-modify-write the addressed memory location.

Effect on flags:
- C <- previous bit 7 of operand
- N <- bit 7 of result (result & $80)
- Z <- 1 if result == 0 else 0
- I, D, V unaffected

Minimal pseudocode (byte result):
- temp = operand
- C = (temp & $80) >> 7
- result = (temp << 1) & $FF
- N = (result & $80) != 0
- Z = (result == 0)
- store result (A or memory)

(Ref: manual section 10.2)

## Source Code
```text
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
- "instruction_operation_asl" — expands on ASL pseudocode and detailed examples

## Mnemonics
- ASL
