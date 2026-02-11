# PNT ($D1-$D2) and PNTR ($D3) — Cursor Logical-Line Pointers

**Summary:** PNT ($D1-$D2) is a two-byte pointer to the screen RAM address of the first column of the logical line containing the cursor; PNTR ($D3) is the cursor column within that logical line (0–79) and matches the value returned by the BASIC POS function. These variables are used with the screen-line link table (TBLX) and the Kernal PLOT routine for locating and moving the cursor.

## Description
PNT is a two-byte little-endian pointer stored at $D1-$D2 that points into screen RAM at the first column of the logical line on which the cursor currently sits. A logical line can span up to two physical screen rows; PNT always points to the first (leftmost) column of that logical line.

PNTR at $D3 holds the cursor column index within that logical line. The value ranges from 0 to 79 (covering the full logical-line width) and is the same value returned by the BASIC POS function when querying cursor position. PNTR is the column offset relative to the address held in PNT.

The screen editing and cursor routines (including the table index TBLX and the Kernal PLOT routine) use PNT and PNTR to compute the cursor's physical screen address and to move the cursor. In practice:
- Use PNT as the base pointer to the logical line in screen RAM.
- Add PNTR (0–79) to that base to locate the cursor's column within the logical line.
- TBLX and the PLOT routine coordinate with these values when performing cursor motion and screen updates.

## Source Code
```text
209-210       $D1-$D2        PNT
Pointer to the Address of the Current Screen Line

This location points to the address in screen RAM of the first column
of the logical line upon which the cursor is currently positioned.

211           $D3            PNTR
Cursor Column on Current Line

The number contained here is the cursor column position within the
logical line pointed to by 209 ($D1).  Since a logical line can
contain up to two physical lines, this value may be from 0 to 79 (the
number here is the value returned by the POS function).
```

## Key Registers
- $00D1-$00D2 - KERNAL/BASIC variables - PNT: two-byte pointer to screen RAM address of the first column of the logical line containing the cursor
- $00D3 - KERNAL/BASIC variable - PNTR: cursor column index (0–79) within the logical line pointed to by PNT; equals BASIC POS

## References
- "ldtb1_screen_line_link_table" — how PNT is computed using the screen-line link table
- "qtsw_quote_mode_and_hook_example" — editing modes that affect cursor behavior tracked by PNT/PNTR

## Labels
- PNT
- PNTR
