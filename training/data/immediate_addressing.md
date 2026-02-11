# 6502 Immediate Addressing

**Summary:** Immediate addressing on the 6502 supplies a one-byte literal operand (format: #aa) — indicated by a leading '#' — e.g. LDA #$48 or LDA #'H'. Searchable terms: 6502, immediate addressing, LDA, '#', literal operand.

## Description
Immediate addressing supplies a single-byte data value (not an address) as the operand. The operand is prefixed with the hash symbol (#) so the assembler treats the following token as a literal byte.

- Operand size: 1 byte (literal).
- Indicator: leading '#'.
- Numeric/character forms: assemblers accept hex (commonly $ prefix), binary (%), decimal (no prefix on some assemblers), or character literals in single quotes.

Examples show loading a literal into the accumulator with LDA. The assembler converts a character literal (e.g. 'H') to its ASCII code.

**[Note: Source may contain an error — the original example used "LDA #48" while stating the loaded value is $48 (hex). Plain 48 can be interpreted as decimal by some assemblers; best practice is to use $48 for hex to avoid ambiguity.]**

## Source Code
```asm
; Immediate addressing examples
LDA #$48    ; Load A with literal $48 (ASCII 'H', decimal 72)
LDA #'H'    ; Load A with ASCII code for 'H' (equivalent to LDA #$48)
; General syntax notation:
;   <mnemonic> #aa    ; aa = one-byte literal
```

## References
- "accumulator_addressing" — contrast with accumulator mode for operations on A