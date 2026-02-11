# SCREEN ($FFED)

**Summary:** KERNAL vector $FFED (SCREEN) — call with JSR $FFED; returns screen dimensions in X/Y registers: X = 40 columns, Y = 25 rows. Real ROM routine entry at $E505.

## Description
Returns the current text screen dimensions. Calling convention:
- Call: JSR $FFED (SCREEN vector)
- Returns: X = 40 (columns), Y = 25 (rows)
- Registers used: X, Y (no parameters required)

This is a KERNAL vector; the ROM entry point for the routine is at $E505 (vector $FFED points to that ROM address). No additional status is returned in A or flags by the documented description.

## Key Registers
- $FFED - KERNAL vector - SCREEN (JSR entry; returns width/height)
- $E505 - ROM - real routine address pointed to by $FFED

## References
- "SCINIT ($FF81)" — SCINIT initializes the VIC and display
- "PLOT ($FFF0)" — PLOT manages cursor position and plotting routines

## Labels
- SCREEN
