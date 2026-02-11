# SBC — Subtract memory from accumulator with borrow (6502)

**Summary:** SBC (Subtract with Borrow) performs A - M - C -> A on the 6502/Commodore 64 CPU; flags affected: N, Z, C, V. Relevant opcodes include $E9 (immediate), $E5/$F5 (zero page), $ED/$FD/$F9 (absolute modes), $E1/$F1 (indirect modes).

## Description
Operation: A - M - C -> A. The instruction subtracts the memory operand and the carry/borrow flag from the accumulator. Flags affected are Negative (N), Zero (Z), Carry (C) and Overflow (V). The source notes: C functions as borrow (see referenced section 2.2.2).

Addressing modes, opcodes, instruction lengths and cycle counts are given in the table below. For the modes marked with an asterisk (*) in the table, add 1 cycle when a page boundary is crossed.

- Flags affected: N, Z, C, V.
- Borrow semantics: source uses "C = Borrow" (see 2.2.2).
- Page-cross penalty: applies to modes explicitly marked with * in the table (Absolute,X and Absolute,Y per source).

## Source Code
```text
  SBC          SBC Subtract memory from accumulator with borrow         SBC
                      -
  Operation:  A - M - C -> A                            N Z C I D V
         -                                              / / / _ _ /
    Note:C = Borrow             (Ref: 2.2.2)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Immediate     |   SBC #Oper           |    E9   |    2    |    2     |
  |  Zero Page     |   SBC Oper            |    E5   |    2    |    3     |
  |  Zero Page,X   |   SBC Oper,X          |    F5   |    2    |    4     |
  |  Absolute      |   SBC Oper            |    ED   |    3    |    4     |
  |  Absolute,X    |   SBC Oper,X          |    FD   |    3    |    4*    |
  |  Absolute,Y    |   SBC Oper,Y          |    F9   |    3    |    4*    |
  |  (Indirect,X)  |   SBC (Oper,X)        |    E1   |    2    |    6     |
  |  (Indirect),Y  |   SBC (Oper),Y        |    F1   |    2    |    5     |
  +----------------+-----------------------+---------+---------+----------+
  * Add 1 when page boundary is crossed.
```

## References
- "sec_set_carry" — expands on SEC (sets carry flag used by SBC borrow semantics)
- "lda_load_accumulator" — expands on LDA (accumulator load operations)

## Mnemonics
- SBC
