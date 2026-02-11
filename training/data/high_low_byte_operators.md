# 65xx high/low-byte operators (>,<) — Kick Assembler

**Summary:** Explains the 65xx assembler unary operators > (high byte) and < (low byte) used in Kick Assembler and other 65xx assemblers to extract the high and low 8-bit parts of a 16-bit address or numeric expression; typical usage stores those bytes into vector addresses (e.g. $0314/$0315).

## Operator behavior
- <expr yields the low byte of expr (expr & $00FF).
- >expr yields the high byte of expr ((expr >> 8) & $00FF).
- These operators are evaluated at assemble time and produce an 8-bit immediate value usable with immediate instructions (e.g. LDA #<label).
- Common use: split a 16-bit address or symbol into two bytes for storing into a two-byte vector or table entry.

## Typical usage
Store a 16-bit symbol/address into two consecutive bytes (low then high):
- lda #<interrupt1    ; load low byte of interrupt1
- sta $0314           ; store low byte at $0314 (vector low)
- lda #>interrupt1    ; load high byte of interrupt1
- sta $0315           ; store high byte at $0315 (vector high)

You can apply the operators to any numeric expression the assembler accepts (symbols, constants, expression results), e.g. #<label+2 or #>($C000+$20).

## Source Code
```asm
lda #<interrupt1
sta $0314
lda #>interrupt1
sta $0315

// Takes the lowbyte of the interupt1 value
// Takes the high byte of the interupt1 value
```

## References
- "numeric_values_and_basic_arithmetic" — expands on Using numeric expressions in assembler code
- "numeric_values_table_and_number_function" — expands on Formal table entries for 'High byte' and 'Low byte' operators
