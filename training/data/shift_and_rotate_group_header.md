# 6502 Shift and Rotate Group (ASL, LSR, ROL, ROR)

**Summary:** Shift and rotate instructions on the 6502: ASL (arithmetic shift left), LSR (logical shift right), ROL (rotate left through carry), ROR (rotate right through carry). Covers accumulator and memory addressing modes, opcode bytes, cycle counts, and exact flag effects (N, Z, C).

## Overview
These four instructions either shift bits within the accumulator or a memory byte, or rotate bits through the processor carry. They affect the Negative (N), Zero (Z), and Carry (C) flags; they do not affect the Overflow (V) flag. Accumulator mode operates on the A register; memory modes read-modify-write the specified memory location.

Key behavioral rules:
- ASL: shift left; bit 7 goes into C; bit 0 becomes 0.
- LSR: shift right; bit 0 goes into C; bit 7 becomes 0.
- ROL: shift left through C; old bit 7 -> C, old C -> bit 0.
- ROR: shift right through C; old bit 0 -> C, old C -> bit 7.
- N is set from the post-operation bit 7 (except LSR always clears N because bit7 becomes 0).
- Z set if result == 0.
- C set to the bit shifted out.

## Instruction Details

ASL (Arithmetic Shift Left)
- Purpose: Multiply an unsigned value by 2 (with bit 7 overflow into C).
- Modes: Accumulator, Zero Page, Zero Page,X, Absolute, Absolute,X.
- Effects: C <- bit7(original); result <- (value << 1) & $FF; N,Z updated.
- Notes: In accumulator mode, A is replaced. In memory modes, the memory location is read, shifted, and written back (read-modify-write cycle).

LSR (Logical Shift Right)
- Purpose: Divide an unsigned value by 2 (LSB moves to C, MSB filled with 0).
- Modes: Accumulator, Zero Page, Zero Page,X, Absolute, Absolute,X.
- Effects: C <- bit0(original); result <- (value >> 1); N cleared (bit7 = 0), Z updated.
- Notes: Logical shift — high bit is filled with zero (not sign-extended).

ROL (Rotate Left through Carry)
- Purpose: Rotate bits left including the carry (circular shift across C).
- Modes: Accumulator, Zero Page, Zero Page,X, Absolute, Absolute,X.
- Effects: temp = bit7(original); result <- ((value << 1) & $FF) | C; C <- temp; N,Z updated.

ROR (Rotate Right through Carry)
- Purpose: Rotate bits right including the carry.
- Modes: Accumulator, Zero Page, Zero Page,X, Absolute, Absolute,X.
- Effects: temp = bit0(original); result <- (value >> 1) | (C << 7); C <- temp; N,Z updated.

Common notes
- All memory variants are read-modify-write and have fixed cycle counts (no additional page-cross penalty).
- Accumulator mode is faster (2 cycles).
- Decimal mode (D flag) does not affect these instructions.
- These instructions do not change V (overflow) or I (interrupt) flags.

## Source Code
```text
Opcode table: Instruction — Addressing Mode — Opcode — Bytes — Cycles

ASL
  Accumulator        ASL A        0A    1 byte   2 cycles
  Zero Page          ASL $zz      06    2 bytes  5 cycles
  Zero Page,X        ASL $zz,X    16    2 bytes  6 cycles
  Absolute           ASL $hhhh    0E    3 bytes  6 cycles
  Absolute,X         ASL $hhhh,X  1E    3 bytes  7 cycles

LSR
  Accumulator        LSR A        4A    1 byte   2 cycles
  Zero Page          LSR $zz      46    2 bytes  5 cycles
  Zero Page,X        LSR $zz,X    56    2 bytes  6 cycles
  Absolute           LSR $hhhh    4E    3 bytes  6 cycles
  Absolute,X         LSR $hhhh,X  5E    3 bytes  7 cycles

ROL
  Accumulator        ROL A        2A    1 byte   2 cycles
  Zero Page          ROL $zz      26    2 bytes  5 cycles
  Zero Page,X        ROL $zz,X    36    2 bytes  6 cycles
  Absolute           ROL $hhhh    2E    3 bytes  6 cycles
  Absolute,X         ROL $hhhh,X  3E    3 bytes  7 cycles

ROR
  Accumulator        ROR A        6A    1 byte   2 cycles
  Zero Page          ROR $zz      66    2 bytes  5 cycles
  Zero Page,X        ROR $zz,X    76    2 bytes  6 cycles
  Absolute           ROR $hhhh    6E    3 bytes  6 cycles
  Absolute,X         ROR $hhhh,X  7E    3 bytes  7 cycles

Examples:
  ASL A        ; shift accumulator left, cycles=2
  LSR $10      ; logical shift right memory at $0010, cycles=5
  ROL $0200,X  ; rotate left memory at $0200 + X, cycles=7
  ROR $FF      ; rotate right zero page $00FF, cycles=5
```

## References
- "asl_instruction" — expands on ASL (arithmetic shift left)
- "lsr_instruction" — expands on LSR (logical shift right)
- "rol_instruction" — expands on ROL (rotate left)
- "ror_instruction" — expands on ROR (rotate right)

## Mnemonics
- ASL
- LSR
- ROL
- ROR
