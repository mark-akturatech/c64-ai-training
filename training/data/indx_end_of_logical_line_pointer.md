# INDX ($C8) — Pointer: End of Logical Line for Input

**Summary:** $C8 (decimal 200) — INDX is a zero-page pointer holding the column index of the last nonblank character on the logical input line (column range 0–79, since logical lines can be up to 80 characters).

## Description
- Address: $00C8 (decimal 200).
- Name: INDX.
- Purpose: Stores the column number of the last nonblank character on the logical line to be input.
- Value range: 0–79 (logical lines can be up to 80 characters long).
- Notes: The value represents a column index (0-based) within the logical input buffer.

## Key Registers
- $00C8 - Zero Page - INDX: Pointer to end of logical input line (last nonblank column index, 0–79)

## References
- "lxsp_cursor_start_position" — expands on cursor start X,Y and logical line position used when performing input editing
- "pnt_pointer_and_pntr_cursor_column" — expands on screen line pointer and cursor column in relation to INDX

## Labels
- INDX
