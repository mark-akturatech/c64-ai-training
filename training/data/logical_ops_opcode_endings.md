# 6502 Opcode Encoding Grid — ORA, AND, EOR, ADC, STA, LDA, CMP, SBC

**Summary:** Opcode hex grid for logical and related 6502 instructions (ORA, AND, EOR, ADC, STA, LDA, CMP, SBC) arranged by addressing mode (IMM, ZP, ZP,X, (IND,X), (IND),Y, ABS, ABS,X, ABS,Y). Includes operand byte counts per addressing mode and the low‑nibble pattern note: opcodes end in -1, -5, -9, or -D.

## Opcode Grid
This chunk reproduces the opcode matrix for the listed instructions, with the column order:
IMM, ZP, ZP,X, (IND,X), (IND),Y, ABS, ABS,X, ABS,Y — and the operand byte counts shown below the column headings.

The table uses the canonical 6502 encodings. STA has no immediate form (no IMM entry). Note: **[Note: Source may contain an error — original source showed duplicated/truncated entries for LDA, CMP, SBC; the table below uses the standard 6502 opcodes].**

## Source Code
```text
        *------------------------------------------------------------*
        |       IMM   ZP   ZP,X  (IND,X)  (IND),Y  ABS  ABS,X  ABS,Y |
        |        2     2     2      2        2      3     3      3   |
        |     +------------------------------------------------------+
        | ORA | 09    05    15     01       11     0D   1D     19    |
        | AND | 29    25    35     21       31     2D   3D     39    |
        | EOR | 49    45    55     41       51     4D   5D     59    |
        | ADC | 69    65    75     61       71     6D   7D     79    |
        | STA |      85    95     81       91     8D   9D     99    |
        | LDA | A9    A5    B5     A1       B1     AD   BD     B9    |
        | CMP | C9    C5    D5     C1       D1     CD   DD     D9    |
        | SBC | E9    E5    F5     E1       F1     ED   FD     F9    |
        *-----+------------------------------------------------------*
                      Op Code low-nibble pattern: ends in -1, -5, -9, or -D
```

## References
- "shifts_rotates_inc_dec_ldx_ldy_opcode_endings" — similar opcode-ending pattern table for shifts/rotates and inc/dec/ldx/ldy
- "instruction_table_header" — describes addressing modes and cycle/byte counts for instruction tables
- "instruction_timing_table_part1" — detailed opcode + cycle rows for many of these instructions

## Mnemonics
- ORA
- AND
- EOR
- ADC
- STA
- LDA
- CMP
- SBC
