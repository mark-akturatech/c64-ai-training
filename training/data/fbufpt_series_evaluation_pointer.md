# FBUFPT ($71-$72) — Series Evaluation Pointer

**Summary:** FBUFPT at $71-$72 (decimal 113–114) is a pointer into free RAM used as a temporary table for series/formula evaluation and also reused as a TI$ work area, string-setup pointer, and array-size evaluation workspace. Documentation that labels it as a tape-buffer pointer conflicts with the BASIC ROM disassembly; the tape buffer pointer is at 178 ($B2).

## Description
FBUFPT ($71-$72) holds the address of a temporary table created in free RAM for evaluating formulas (series evaluation). The pointer is repurposed by BASIC for several internal work areas:

- Temporary table of values for series/formula evaluation.
- TI$ work area (temporary string handling).
- String setup pointer.
- Workspace for evaluating the size of an array.

The Programmer's Reference Guide labels this location as a pointer to the tape buffer, but a disassembly of the BASIC ROM shows no references using $71-$72 for tape buffering; the tape-buffer pointer is at location 178 (decimal) / $B2 (hex).

**[Note: Source may contain an error — Programmer's Reference Guide label for tape buffer pointer contradicts BASIC ROM disassembly.]**

## Key Registers
- $0071-$0072 - BASIC RAM - FBUFPT: pointer to temporary table for series/formula evaluation; also used for TI$ work area, string setup pointer, and array-size evaluation workspace.

## References
- "series_evaluation_sign_flag" — expands on the temporary table used during series/formula evaluation
- "basic_numeric_work_area_overview" — expands on the BASIC numeric and work-area layout

## Labels
- FBUFPT
