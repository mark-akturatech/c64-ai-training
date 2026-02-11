# RDTIM ($FFDE) — Read Time-of-Day (TOD) clock

**Summary:** KERNAL function RDTIM at $FFDE (real ROM address $F6DD) reads the Time-of-Day (TOD) clock from zero page $00A0-$00A2 and returns the current TOD bytes in registers A, X, and Y. Overwrites A, X, Y.

## Description
RDTIM is a Commodore 64 KERNAL entry that copies the current TOD clock bytes stored at zero page addresses $00A0-$00A2 into the CPU registers:

- On return: A = byte from $00A0, X = byte from $00A1, Y = byte from $00A2.
- Registers used/overwritten: A, X, Y.
- Vector/entry: $FFDE (KERNAL vector). Implementation (real ROM address): $F6DD.
- Source TOD storage: zero page $00A0-$00A2 (Time-of-Day clock bytes).

This routine is related to the KERNAL TOD management functions SETTIM ($FFDB) and UDTIM ($FFEA).

## Key Registers
- $FFDE - KERNAL ROM vector - RDTIM entry (reads TOD into A/X/Y)
- $F6DD - ROM - RDTIM implementation (real address)
- $00A0-$00A2 - Zero page - Time-of-Day clock storage (read by RDTIM)

## References
- "settim" — SETTIM $FFDB: sets Time-of-Day (TOD)
- "udtim" — UDTIM $FFEA: updates TOD and STOP key indicator

## Labels
- RDTIM
