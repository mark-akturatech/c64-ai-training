# STY (Store Y)

**Summary:** STY stores the Y index register into memory using Zero Page ($84), Zero Page,X ($94), or Absolute ($8C) addressing; instruction sizes and cycle counts are listed, and the operation does not affect any processor status flags.

**Operation**
STY copies the current Y register value into the specified memory location: Y -> M. Addressing modes supported are Zero Page, Zero Page,X, and Absolute. The instruction does not affect any processor status flags; all flags remain unchanged.

- Operation: Y -> M
- Affected flags: None; all flags remain unchanged.

**Encoding and Timing**
Supported addressing modes, opcodes, instruction length, and cycle counts:

- Zero Page: STY Oper — opcode $84 — 2 bytes — 3 cycles
- Zero Page,X: STY Oper,X — opcode $94 — 2 bytes — 4 cycles
- Absolute: STY Oper — opcode $8C — 3 bytes — 4 cycles

(See references for pseudocode expansion.)

## Source Code
```text
  STY                    STY Store index Y in memory                    STY

  Operation: Y -> M                                     N Z C I D V
                                                        - - - - - -
                                 (Ref: 7.3)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Zero Page     |   STY Oper            |    84   |    2    |    3     |
  |  Zero Page,X   |   STY Oper,X          |    94   |    2    |    4     |
  |  Absolute      |   STY Oper            |    8C   |    3    |    4     |
  +----------------+-----------------------+---------+---------+----------+
```

## References
- "instruction_operation_sty" — expands on STY pseudocode and behaviors
- "6502 Instruction Set" — ([nesdev.org](https://www.nesdev.org/obelisk-6502-guide/instructions.html?utm_source=openai))
- "6502 Instruction Reference – Call-A.P.P.L.E." — ([callapple.org](https://www.callapple.org/obelisk-6502-reference/?utm_source=openai))

## Mnemonics
- STY
