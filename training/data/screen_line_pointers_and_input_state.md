# Zero Page $00CF-$00F1 — Cursor/Input State and Screen Line Pointers

**Summary:** Zero-page locations $00CF and $00D0-$00F1 hold cursor/input state (cursor phase, EOL switch, current column/row, quote mode, insertions, input character) and the high-byte table for 25 screen-line pointers used by the C64 screen memory mapping ($0400-$07FF). Terms: zero page, PETSCII, screen line table, line pointer.

## Description
This zero-page block is used by the C64 text input/line-editing routines to track the current cursor and editing state and to index the screen-line pointer table. Relevant bytes:

- $00CF — Cursor Phase: visibility phase (0 or 1) used to toggle cursor blink/visibility.
- $00D0 — EOL Switch: end-of-line indicator set/cleared by input routines.
- $00D1-$00D2 — Screen Line Pointer: pointer (low/high) to the current screen line in the screen-line table.
- $00D3 — Current Column: current cursor column (range 0–39).
- $00D4 — Quote Mode: quotation-mode flag used during input parsing (affects how quotes are handled).
- $00D5 — Screen Line Length: stored as (line length minus 1).
- $00D6 — Current Row: current cursor row (range 0–24).
- $00D7 — Input Character: PETSCII code or temporary buffer used during I/O (holds the character being processed).
- $00D8 — Insertions Count: number of character insertions (used by insert/shift editing).
- $00D9-$00F1 — Screen Line Table: 25 bytes containing the high bytes for each screen-line pointer (one per screen row). These bytes, combined with low-byte pointers elsewhere, form pointers to each of the 25 display lines (screen memory mapping reference: $0400-$07FF).

(Parenthetical: PETSCII = Commodore character encoding.)

## Source Code
```text
$00CF   Cursor Phase            ; Cursor visibility phase (0 or 1)
$00D0   EOL Switch              ; End-of-line indicator
$00D1   Screen Line Ptr (low)   ; Low byte of pointer to current screen line
$00D2   Screen Line Ptr (high)  ; High byte of pointer to current screen line
$00D3   Current Column          ; Cursor column (0-39)
$00D4   Quote Mode              ; Quotation/input mode flag
$00D5   Screen Line Len         ; Screen line length minus 1
$00D6   Current Row             ; Cursor row (0-24)
$00D7   Input Character         ; PETSCII code / buffer during I/O
$00D8   Insertions Count        ; Number of character insertions
$00D9-$00F1  Screen Line Table  ; 25 bytes: high bytes for screen line pointers (one per row)
```

## Key Registers
- $00CF - Zero Page - Cursor Phase (visibility phase 0/1)
- $00D0 - Zero Page - EOL Switch (end-of-line indicator)
- $00D1-$00D2 - Zero Page - Pointer to current screen line (low/high)
- $00D3 - Zero Page - Current Column (0-39)
- $00D4 - Zero Page - Quote Mode (input parsing flag)
- $00D5 - Zero Page - Screen Line Length (stored as length minus 1)
- $00D6 - Zero Page - Current Row (0-24)
- $00D7 - Zero Page - Input Character (PETSCII buffer)
- $00D8 - Zero Page - Insertions Count (insertions tally)
- $00D9-$00F1 - Zero Page - Screen Line Table: high bytes of 25 screen-line pointers

## References
- "default_screen_memory" — expands on screen RAM mapping and line pointers at $0400-$07FF

## Labels
- CURSOR_PHASE
- EOL_SWITCH
- SCREEN_LINE_PTR_LO
- SCREEN_LINE_PTR_HI
- CURRENT_COLUMN
- QUOTE_MODE
- CURRENT_ROW
- SCREEN_LINE_TABLE
