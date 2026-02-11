# STA (Store Accumulator) — 6502 instruction summary

**Summary:** STA stores the accumulator (A) to memory using multiple 6502 addressing modes. Encodings and instruction sizes: Absolute $8D (3 bytes), Zero Page $85 (2), Absolute,X $9D (3), Absolute,Y $99 (3), Zero Page,X $95 (2), (Indirect,X) $81 (2), (Indirect),Y $91 (2). No processor flags are affected.

## Description
STA writes the contents of the accumulator into memory (A → M). The instruction does not modify the accumulator and does not affect the processor status flags (N, Z, C, V, I, D, B). Supported addressing modes are listed below; see the Source Code section for exact opcode bytes and instruction lengths.

- Absolute — store A to a 16-bit address.
- Zero Page — store A to a zero-page (8-bit) address.
- Absolute Indexed (X/Y) — base 16-bit address plus X or Y added (no page‑cross penalty for STA opcodes listed).
- Zero Page Indexed (X) — zero-page base plus X (wraps within page).
- Indexed Indirect (a,X) — zero-page base plus X, then indirect to 16-bit address (first add X to zero-page address, then fetch pointer).
- Indirect Indexed (a),Y — fetch 16-bit pointer from zero page, then add Y to it.

## Source Code
```text
STA    Store Accumulator

Addressing modes and opcodes:
Absolute               STA $aaaa    $8D    3    (no flags affected)
Zero Page              STA $aa      $85    2
Absolute Indexed, X    STA $aaaa,X  $9D    3
Absolute Indexed, Y    STA $aaaa,Y  $99    3
Zero Page Indexed, X   STA $aa,X    $95    2
Indexed Indirect       STA ($aa,X)  $81    2
Indirect Indexed       STA ($aa),Y  $91    2

Alternate tabular form:
STA    Store Accumulator    Absolute    STA $aaaa    $8D    3    none
       Zero Page            STA $aa      $85    2
       Absolute Indexed, X  STA $aaaa,X  $9D    3
       Absolute Indexed, Y  STA $aaaa,Y  $99    3
       Zero Page Indexed,X  STA $aa,X    $95    2
       Indexed Indirect     STA ($aa,X)  $81    2
       Indirect Indexed     STA ($aa),Y  $91    2
```

## References
- "lda_instruction" — load accumulator (LDA) counterpart
- "stx_instruction" — store X register (STX)
- "sty_instruction" — store Y register (STY)

## Mnemonics
- STA
