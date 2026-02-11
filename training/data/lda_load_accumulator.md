# LDA — Load accumulator (6502 / C64)

**Summary:** LDA (Load Accumulator) transfers memory to the A register (M -> A), affects flags N and Z, and is implemented on the 6502/Commodore 64 with opcodes A9, A5, B5, AD, BD, B9, A1, B1; Absolute,X, Absolute,Y and (Indirect),Y may add one cycle if a page boundary is crossed.

## Operation
LDA reads a value from memory and places it into the accumulator (A). It sets the Negative (N) and Zero (Z) flags based on the result; it does not modify Carry, Interrupt, Decimal, or Overflow flags. Some addressing modes add one extra cycle when the effective address crosses a 256-byte page boundary (see table in Source Code).

## Source Code
```text
LDA                  LDA Load accumulator with memory                 LDA

Operation:  M -> A                                    N Z C I D V
                                                      / / _ _ _ _
                                (Ref: 2.1.1)
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Immediate     |   LDA #Oper           |    A9   |    2    |    2     |
|  Zero Page     |   LDA Oper            |    A5   |    2    |    3     |
|  Zero Page,X   |   LDA Oper,X          |    B5   |    2    |    4     |
|  Absolute      |   LDA Oper            |    AD   |    3    |    4     |
|  Absolute,X    |   LDA Oper,X          |    BD   |    3    |    4*    |
|  Absolute,Y    |   LDA Oper,Y          |    B9   |    3    |    4*    |
|  (Indirect,X)  |   LDA (Oper,X)        |    A1   |    2    |    6     |
|  (Indirect),Y  |   LDA (Oper),Y        |    B1   |    2    |    5*    |
+----------------+-----------------------+---------+---------+----------+
* Add 1 if page boundary is crossed.
```

## References
- "ora_or_accumulator" — expands on ORA (logical OR with accumulator)
- "eor_exclusive_or" — expands on EOR (exclusive OR with accumulator)
- "sta_store_accumulator" — expands on STA (store accumulator — writes A to memory)

## Mnemonics
- LDA
