# BASZPT ($00FF) — BASIC temporary byte for FP→ASCII

**Summary:** Zero-page address $00FF (decimal 255) labeled BASZPT; used by BASIC ROM as temporary storage during floating-point to ASCII conversion. Searchable terms: $00FF, zero page, BASZPT, BASIC, floating-point to ASCII.

## Description
Address $00FF (decimal 255) is reserved/used by BASIC ROM as a single-byte temporary storage location during the process of converting floating-point (BASIC floating-point format) values into ASCII character strings. The label in reference listings is BASZPT.

No further bit fields or multi-byte structure apply — this is a single zero-page byte used transiently by BASIC conversion routines.

## Source Code
```text
255           $FF            BASZPT
BASIC Temporary Data for Floating Point to ASCII Conversion

This location is used for temporary storage in the process of
converting floating point numbers to ASCII characters..
```

## Key Registers
- $00FF - Zero page - BASZPT: BASIC temporary byte used during floating-point to ASCII conversion

## References
- "freezp_user_zero_page_bytes" — adjacent zero-page usage and reserved bytes for BASIC/ML routines