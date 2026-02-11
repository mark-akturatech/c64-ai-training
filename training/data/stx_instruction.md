# 6502 STX — Store X Register

**Summary:** STX stores the X register to memory. Addressing modes: Absolute ($8E), Zero Page ($86), Zero Page,Y ($96); instruction lengths 3, 2, and 2 bytes respectively. No processor flags are affected.

## Description
STX copies the current value of the X register into a memory location determined by the chosen addressing mode. The instruction does not modify the processor status flags (N, V, B, D, I, Z, C).

## Addressing modes and opcodes
- Absolute: STX $aaaa — opcode $8E — 3 bytes
- Zero Page: STX $aa — opcode $86 — 2 bytes
- Zero Page Indexed,Y: STX $aa,Y — opcode $96 — 2 bytes

(Zero Page,Y is the only indexed form available for STX; there is no Absolute,X or Absolute,Y STX in 6502.)

## Source Code
```text
STX    Store X Register
Absolute            STX $aaaa    $8E    3    (no flags affected)
Zero Page           STX $aa      $86    2
Zero Page Indexed Y STX $aa,Y    $96    2
```

## References
- "sta_instruction" — store accumulator (related opcodes and addressing modes)
- "sty_instruction" — store Y register (related opcodes and addressing modes)

## Mnemonics
- STX
