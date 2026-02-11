# PLOT ($FFF0)

**Summary:** KERNAL vector $FFF0 (real ROM address $E50A) — PLOT routine for managing the cursor position. Call with Carry set/clear and X/Y holding column/row; returns column/row in X/Y when saving. Uses X and Y registers.

## Description
PLOT is a KERNAL entry that manages the current text cursor position. Behavior is controlled by the processor Carry flag and the X/Y registers on entry:

- Input:
  - Carry = 1 : Save current cursor position; routine returns the saved column/row in X/Y.
  - Carry = 0 : Restore cursor position; X = column, Y = row are provided as the position to restore.
- Output:
  - When called with Carry = 1, X and Y are set to the current cursor column and row on return.
- Registers used:
  - X, Y — both used by the routine (caller must expect X/Y to be clobbered or returned).

Call convention: JSR $FFF0 (vector) — the real ROM entry for this vector is at $E50A.

No additional side-effects or temporary storage details are given in the source text; treat X/Y as both input (when restoring) and output (when saving), and use the Carry flag to select the operation.

## Key Registers
- $FFF0 - KERNAL vector - PLOT entry vector (call with JSR $FFF0)
- $E50A - KERNAL ROM - PLOT real address in ROM

## References
- "SCREEN $FFED" — screen dimensions and related screen routines

## Labels
- PLOT
