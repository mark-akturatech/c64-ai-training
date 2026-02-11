# INC (6502) — Increment Memory

**Summary:** INC increments a memory location by one (M + 1 -> M). Searchable terms: opcodes E6/F6/EE/FE, addressing modes Zero Page / Zero Page,X / Absolute / Absolute,X, affected flags N and Z.

## Operation
INC adds one to the memory operand and stores the result back into the same memory location (M + 1 -> M). It affects the Negative (N) and Zero (Z) flags; the Carry (C) flag is not affected. Use the following addressing modes on the 6502: Zero Page, Zero Page,X, Absolute, and Absolute,X.

Opcodes (concise):
- E6 = INC Zero Page (2 bytes, 5 cycles)
- F6 = INC Zero Page,X (2 bytes, 6 cycles)
- EE = INC Absolute (3 bytes, 6 cycles)
- FE = INC Absolute,X (3 bytes, 7 cycles)

## Source Code
```text
  INC                    INC Increment memory by one                    INC
                                                        N Z C I D V
  Operation:  M + 1 -> M                                / / _ _ _ _
                                 (Ref: 10.6)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Zero Page     |   INC Oper            |    E6   |    2    |    5     |
  |  Zero Page,X   |   INC Oper,X          |    F6   |    2    |    6     |
  |  Absolute      |   INC Oper            |    EE   |    3    |    6     |
  |  Absolute,X    |   INC Oper,X          |    FE   |    3    |    7     |
  +----------------+-----------------------+---------+---------+----------+
```

## References
- "inx_increment_x" — increment X register counterpart
- "iny_increment_y" — increment Y register counterpart
- "lda_load_accumulator" — load accumulator / memory relations

## Mnemonics
- INC
