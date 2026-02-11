# STY — Store Y in memory

**Summary:** STY stores the Y index register into memory (Y -> M). Addressing modes: Zero Page, Zero Page,X, Absolute. Opcodes: $84 (Zero Page), $94 (Zero Page,X), $8C (Absolute). No processor status flags are affected (N Z C I D V).

## Operation
STY copies the current value of the Y register into a memory location specified by the addressing mode. It does not change any processor status flags. Assembly forms:
- STY oper        (Zero Page or Absolute)
- STY oper,X      (Zero Page,X)

(Ref: 7.3)

## Source Code
```text
  STY                    STY Store index Y in memory                    STY

  Operation: Y -> M                                     N Z C I D V
                                                        _ _ _ _ _ _
                                 (Ref: 7.3)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Zero Page     |   STY Oper            |   $84   |    2    |    3     |
  |  Zero Page,X   |   STY Oper,X          |   $94   |    2    |    4     |
  |  Absolute      |   STY Oper            |   $8C   |    3    |    4     |
  +----------------+-----------------------+---------+---------+----------+
```

## References
- "stx_store_x" — expands on STX (store X)
- "sta_store_accumulator" — expands on STA (store A)
- "ldy_load_y" — expands on LDY (load Y)

## Mnemonics
- STY
