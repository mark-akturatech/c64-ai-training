# SETTIM ($FFDB)

**Summary:** KERNAL routine SETTIM at vector $FFDB (real ROM address $F6E4) — writes the Time-of-Day clock bytes into zero page $00A0-$00A2. Call with A/X/Y = new TOD value (three bytes).

## Description
Sets the system Time‑of‑Day (TOD) clock by storing three bytes supplied in registers A, X and Y into zero page locations $00A0-$00A2. The official KERNAL entry vector is $FFDB; the ROM implementation lives at $F6E4. Calling convention (as documented): place the new TOD value bytes in A, X and Y, then call the KERNAL entry (JSR $FFDB).

This routine is the counterpart to the TOD read/update routines; see References for related KERNAL vectors.

## Key Registers
- $00A0-$00A2 - Zero page - Time-of-Day (TOD) clock bytes (three-byte storage)

## References
- "rdtim" — Read current TOD (RDTIM $FFDE)
- "udtim" — Update TOD and STOP indicator (UDTIM $FFEA)

## Labels
- SETTIM
