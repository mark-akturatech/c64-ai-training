# USER ($F3-$F4) — Pointer to current screen color RAM location

**Summary:** $F3-$F4 (USER) is a 16-bit pointer to the first byte of color RAM for the current screen line; it is synchronized with the screen-RAM pointer PNT ($D1). Search terms: $F3, $F4, USER, color RAM pointer, PNT, $D1.

## Description
This two-byte pointer at $F3-$F4 (USER) contains the address of the first byte of color RAM for the screen line currently being processed. It is kept in step with the corresponding screen RAM pointer stored in location 209 ($D1 / PNT), so that the color RAM address refers to the same horizontal line as the screen RAM address.

(Stored as a 16-bit little-endian pointer — low byte at $F3, high byte at $F4.)

## Key Registers
- $F3-$F4 - USER - Pointer to the address of the first byte of color RAM for the current screen line; synchronized with PNT ($D1) which points to the first byte of screen RAM for that line.

## References
- "pnt_pointer_and_pntr_cursor_column" — expands on synchronization between the screen RAM pointer and the color-RAM pointer

## Labels
- USER
