# 6502: STX (Store X)

**Summary:** STX stores the X index register into memory. Addressing modes: Zero Page ($86), Zero Page,Y ($96), Absolute ($8E); does not modify processor flags (N, Z, C, I, D, V).

## Operation
STX copies the contents of the X register to the memory operand M (M ← X). It has three supported addressing modes: Zero Page, Zero Page indexed by Y, and Absolute. STX does not set or clear any processor status flags.

- Typical assembly forms:
  - STX addr     ; Absolute (3 bytes, $8E)
  - STX zp       ; Zero Page (2 bytes, $86)
  - STX zp,Y     ; Zero Page indexed by Y (2 bytes, $96) (wraps within zero page on 6502)

- Use cases: store X for later retrieval, save index across subroutines, write table index into memory.

## Source Code
```text
STX                    STX Store index X in memory                    STX

Operation: X -> M                                     N Z C I D V
                                                      _ _ _ _ _ _
                                 (Ref: 7.2)
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
| Zero Page      | STX Oper              | $86     | 2       | 3        |
| Zero Page,Y    | STX Oper,Y            | $96     | 2       | 4        |
| Absolute       | STX Oper              | $8E     | 3       | 4        |
+----------------+-----------------------+---------+---------+----------+
```

## References
- "instruction_operation_stx" — expands on STX pseudocode

## Mnemonics
- STX
