# STA (Store Accumulator) — 6502

**Summary:** STA stores the accumulator (A) to memory (A -> M). Searchable terms: opcodes $85 $95 $80 $90 $99 $81 $91, addressing modes (Zero Page, Zero Page,X, Absolute, Absolute,X, Absolute,Y, (Indirect,X), (Indirect),Y), cycle counts, flags unaffected.

## Description
Operation: A -> M

- Effect: Writes the current accumulator value into the target memory location. Does not change processor flags (N, Z, C, I, D, V remain unaffected).
- Usage: Use the addressing mode appropriate to the target address (zero page for short addresses, absolute for full 16-bit addresses, indirect indexed forms for pointer-based addressing).
- Timing: STA cycle counts vary by addressing mode (see table in Source Code). Note that the opcode and byte-size also depend on addressing mode.

## Source Code
```text
  STA                  STA Store accumulator in memory                  STA

  Operation:  A -> M                                    N Z C I D V
                                                        _ _ _ _ _ _
                                (Ref: 2.1.2)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Zero Page     |   STA Oper            |    $85  |    2    |    3     |
  |  Zero Page,X   |   STA Oper,X          |    $95  |    2    |    4     |
  |  Absolute      |   STA Oper            |    $80  |    3    |    4     |
  |  Absolute,X    |   STA Oper,X          |    $90  |    3    |    5     |
  |  Absolute,Y    |   STA Oper, Y         |    $99  |    3    |    5     |
  |  (Indirect,X)  |   STA (Oper,X)        |    $81  |    2    |    6     |
  |  (Indirect),Y  |   STA (Oper),Y        |    $91  |    2    |    6     |
  +----------------+-----------------------+---------+---------+----------+
```

## References
- "instruction_operation_sta" — expands on STA pseudocode (STORE into memory)

## Mnemonics
- STA
