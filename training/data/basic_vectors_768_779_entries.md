# BASIC indirect vectors $0300-$030B (IERROR..IEVAL)

**Summary:** Table of BASIC indirect vector entries at $0300-$030B pointing to ROM routines (IERROR, IMAIN, ICRNCH, IQPLOP, IGONE, IEVAL) used for error reporting, the main BASIC loop, tokenizing/crunching, listing tokens, executing tokens, and evaluating single-term expressions. These are stored as 2-byte little-endian pointers.

## Overview
These six vectors (six 16-bit addresses stored little-endian) live at $0300 through $030B and are used by the ROM-based BASIC interpreter to jump to core text/token handling and execution routines:

- IERROR ($0300-$0301): vector to the ERROR routine that prints BASIC error messages.
- IMAIN ($0302-$0303): vector to the main BASIC program loop (direct mode, statement execution/storage).
- ICRNCH ($0304-$0305): vector to the CRUNCH routine that converts ASCII keywords into token form.
- IQPLOP ($0306-$0307): vector to QPLOP, the routine that lists program tokens as ASCII text.
- IGONE ($0308-$0309): vector to GONE, which executes the next BASIC program token.
- IEVAL ($030A-$030B): vector to EVAL, which evaluates single-term arithmetic expressions (used by functions like INT and ABS).

Each vector contains the 16-bit address (low byte first) of the ROM routine (pointer format: little-endian).

## Source Code
```text
768-769   $0300-$0301   IERROR   -> ERROR routine at 58251 ($E38B)
770-771   $0302-$0303   IMAIN    -> Main BASIC loop at 42115 ($A483)
772-773   $0304-$0305   ICRNCH   -> CRUNCH (tokenizer) at 42364 ($A57C)
774-775   $0306-$0307   IQPLOP   -> QPLOP (list tokens) at 42778 ($A71A)
776-777   $0308-$0309   IGONE    -> GONE (execute next token) at 42980 ($A7E4)
778-779   $030A-$030B   IEVAL    -> EVAL (evaluate single-term expressions) at 44678 ($AE86)
```

## Key Registers
- $0300-$030B - BASIC ROM indirect vectors (IERROR, IMAIN, ICRNCH, IQPLOP, IGONE, IEVAL) — 6 16-bit pointers to ROM routines

## References
- "basic_indirect_vector_table_overview" — overview and reasons to modify these vectors  
- "qp_lop_and_crunch_handlers" — details on QPLOP and CRUNCH token conversion/tokenizing routines

## Labels
- IERROR
- IMAIN
- ICRNCH
- IQPLOP
- IGONE
- IEVAL
