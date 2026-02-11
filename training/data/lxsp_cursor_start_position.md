# ********* - LXSP ($C9-$CA) — Cursor X,Y position at the start of input

**Summary:** LXSP at $C9-$CA (decimal 201–202) holds the logical line number and column position of the cursor at the start of BASIC input. Values: logical line 1–25, column 1–40 or 1–80 (depends on whether the logical line occupies one or two 40‑column physical lines).

## Description
LXSP is a two‑byte BASIC workspace entry that records the cursor position when input begins, stored as (line, column).  
- The first byte (at $C9) is the logical line number: range 1–25.  
- The second byte (at $CA) is the column offset on that logical line: range 1–40 or 1–80 depending on whether the logical line spans one or two 40‑column physical screen lines.

Logical vs. physical lines:
- A logical line may map to one or two 40‑column physical screen lines.  
- Therefore the number of logical lines visible at one time can vary (as few as 13 up to 25). LXSP records the logical-line index and the cursor column within that logical line rather than a physical screen row.

For detailed behavior of logical/physical line mapping and how LXSP is used during input/edit operations, see the screen line link table description at address 217 (decimal) / $D9.

## Key Registers
- $C9-$CA - BASIC workspace - LXSP: Cursor X,Y position at start of input (logical line, column)

## References
- "ldtb1_screen_line_link_table" — expands on logical vs. physical line mapping used by LXSP  
- "indx_end_of_logical_line_pointer" — expands on end-of-logical-line column index used during input

## Labels
- LXSP
