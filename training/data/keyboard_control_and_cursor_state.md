# Zero Page $00C6-$00CF: Keyboard buffer & cursor state

**Summary:** Zero page variables at $00C6-$00CF store keyboard buffer length, reverse mode flag ($00/$12), line/column limits, and cursor state (row/column, visibility, delay, character under cursor). Searchable terms: $00C6, $00C7, $00C8, $00C9, $00CA, $00CB, $00CC, $00CD, $00CE, keyboard buffer, reverse mode, cursor row/column, cursor visibility.

## Description
This zero page block holds the runtime state used by the C64's screen-input and cursor handling routines:

- $00C6 — Keyboard Buf Len: number of entries currently in the keyboard buffer (valid range 0–10).
- $00C7 — Reverse Mode: switch controlling reverse/inverse display mode; $00 = normal, $12 = reverse.
- $00C8 — Line Length: screen line length minus one (used by input routines to enforce line wrap).
- $00C9 — Cursor Row: row position of the cursor during screen input (0–24).
- $00CA — Cursor Column: column position of the cursor during screen input (0–39).
- $00CB — Current Key Matrix: code of currently pressed key (keyboard matrix code).
- $00CC — Cursor Visibility: flag indicating cursor on/off state (visibility).
- $00CD — Cursor Delay: delay counter for cursor phase changes (timing of cursor blinking).
- $00CE — Char Under Cursor: screen code of the character currently under the cursor (saved so cursor can be removed/restored).
- $00CF — (unused/undocumented in this block) left reserved for related cursor/state use in some builds.

These bytes are part of the KERNAL/BASIC screen-input and cursor implementation and map directly to the in-memory cursor and keyboard state used when editing lines on-screen. See referenced "default_screen_memory" for how cursor coordinates map to $0400 screen memory.

## Source Code
```text
$00C6   Keyboard Buf Len        Keyboard buffer length (0-10 entries)
$00C7   Reverse Mode            Reverse mode switch ($00 normal, $12 reverse)
$00C8   Line Length             Screen line length minus 1
$00C9   Cursor Row              Cursor row during screen input (0-24)
$00CA   Cursor Column           Cursor column during screen input (0-39)
$00CB   Current Key Matrix      Currently pressed key (matrix code)
$00CC   Cursor Visibility       Cursor on/off flag
$00CD   Cursor Delay            Cursor phase change delay counter
$00CE   Char Under Cursor       Screen code of character under cursor
$00CF   (reserved)              Related cursor/state (varies by implementation)
```

## Key Registers
- $00C6-$00CF - Zero Page - keyboard buffer length, reverse mode, line length, cursor row/column, current key matrix, cursor visibility/delay, character under cursor

## References
- "default_screen_memory" — screen memory layout and cursor mapping at $0400