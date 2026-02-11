# Kick Assembler Quick Reference — LDA, LSR, Stack ops (PHA/PHP/PLA/PLP), ROL, ROR, RTI, RTS

**Summary:** 6502 opcodes and brief semantics for LDA (load accumulator), LSR (logical shift right), stack instructions PHA/PHP/PLA/PLP, rotate instructions ROL/ROR, and interrupt/return instructions RTI/RTS with their opcode bytes by addressing mode (A9, B5, B9, 4A, 46, 56, 4E, 5E, 48, 08, 68, 28, 2A, 26, 36, 2E, 3E, 6A, 66, 76, 6E, 7E, 40, 60).

**Instruction summaries**
- LDA — Load Accumulator: loads memory into A; sets Negative (N) from bit 7 of result and Zero (Z) if result == 0. (Does not affect C or V.)
- LSR — Logical Shift Right: shifts operand right one bit. Bit 0 -> Carry (C); bit 7 is filled with 0 (so N cleared). Sets Z if result == 0.
- PHA — Push Accumulator: pushes A to stack. Flags unaffected.
- PHP — Push Processor Status: pushes status register to stack (the pushed value sets the Break flag bit as seen by software; bit 5 is set in the pushed copy per 6502 conventions).
- PLA — Pull Accumulator: pulls value from stack into A; sets N and Z according to result.
- PLP — Pull Processor Status: pulls status register from stack (restores processor flags from pulled value).
- ROL — Rotate Left: shifts operand left one bit. Old bit 7 -> Carry; Carry -> bit 0. Sets N from new bit 7 and Z if result == 0.
- ROR — Rotate Right: shifts operand right one bit. Old bit 0 -> Carry; Carry -> new bit 7. Sets N from new bit 7 and Z if result == 0.
- RTI — Return from Interrupt: pulls status then pulls PC from stack (restores state saved by an interrupt).
- RTS — Return from Subroutine: pulls return address from stack and increments it, then resumes execution (returns from JSR).

(Parenthetical: addressing-mode names — immediate, zero page, zero page,X, absolute, absolute,X, absolute,Y, (indirect,X), (indirect),Y, accumulator — are used below.)

## Source Code
```text
; Opcode summary table (6502) — instruction : addressing mode -> opcode (hex)

LDA
  Immediate        -> A9
  Zero Page        -> A5
  Zero Page,X      -> B5
  Absolute         -> AD
  Absolute,X       -> BD
  Absolute,Y       -> B9
  (Indirect,X)     -> A1
  (Indirect),Y     -> B1

LSR
  Accumulator      -> 4A
  Zero Page        -> 46
  Zero Page,X      -> 56
  Absolute         -> 4E
  Absolute,X       -> 5E

PHA
  Implied (stack)  -> 48

PHP
  Implied (stack)  -> 08

PLA
  Implied (stack)  -> 68

PLP
  Implied (stack)  -> 28

ROL
  Accumulator      -> 2A
  Zero Page        -> 26
  Zero Page,X      -> 36
  Absolute         -> 2E
  Absolute,X       -> 3E

ROR
  Accumulator      -> 6A
  Zero Page        -> 66
  Zero Page,X      -> 76
  Absolute         -> 6E
  Absolute,X       -> 7E

RTI
  Implied (interrupt) -> 40

RTS
  Implied (return)    -> 60
```

## References
- "logical_or_nop_and_related" — expands on logical and miscellaneous opcodes (preceding section)
- "store_instructions_sta_stx_sty" — expands on store instructions that follow this block (STA/STX/STY)

## Mnemonics
- LDA
- LSR
- PHA
- PHP
- PLA
- PLP
- ROL
- ROR
- RTI
- RTS
