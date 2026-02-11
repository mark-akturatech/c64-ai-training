# STX — Store index X in memory

**Summary:** STX stores the X index register into memory (X -> M). Searchable terms: opcodes $86, $96, $8E; addressing modes Zero Page, Zero Page,Y, Absolute; cycles 3/4; flags unaffected (N Z C I D V).

## Description
STX writes the contents of the X register to a memory operand. It does not affect any processor status flags (N, Z, C, I, D, V remain unchanged). The instruction supports Zero Page, Zero Page,Y (indexed by Y), and Absolute addressing modes.

Assembly forms:
- STX oper        ; store X to memory (Zero Page or Absolute)
- STX oper,Y      ; store X to Zero Page with Y offset

Timing and size depend on addressing mode (see table in Source Code).

## Source Code
```text
Operation: X -> M
Processor flags affected: N Z C I D V  -> unchanged (_ _ _ _ _ _)
(Ref: 7.2)

+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form|  OP    |No. Bytes|No. Cycles|
+----------------+-----------------------+--------+---------+----------+
| Zero Page      | STX oper              | $86    |   2     |    3     |
| Zero Page,Y    | STX oper,Y            | $96    |   2     |    4     |
| Absolute       | STX oper              | $8E    |   3     |    4     |
+----------------+-----------------------+--------+---------+----------+
```

```asm
; Examples
    LDX #$12
    STX $10        ; Zero Page, opcode $86, stores $12 at $0010
    STX $20,Y      ; Zero Page,Y, opcode $96, stores X at ($0020 + Y) & $FF
    STX $1234      ; Absolute, opcode $8E, stores X at $1234
```

## References
- "sty_store_y" — STY (store Y) related store operation
- "sta_store_accumulator" — STA (store A) related store operation
- "ldx_load_x" — LDX (load X) — load/store relation for X

## Mnemonics
- STX
