# BLNSW ($CC), BLNCT ($CD), GDBLN ($CE), BLNON ($CF) — Cursor blink control and state

**Summary:** Zero-page cursor blink control and state bytes at $CC-$CF (decimal 204–207): BLNSW (blink enable/disable), BLNCT (blink countdown timer), GDBLN (saved screen code under cursor), BLNON (current blink state). Terms: $CC, $CD, $CE, $CF, BLNSW, BLNCT, GDBLN, BLNON, jiffy, cursor blink.

## Description
These four consecutive zero-page locations are used by the BASIC/ROM interrupt routines to control the on-screen cursor flashing and to remember the character under the cursor.

- BLNSW ($CC / decimal 204)
  - Cursor blink enable/disable flag. Value 0 = allow flashing; nonzero = inhibit flashing.
  - The system sets this nonzero while characters are waiting in the keyboard buffer or while a program is running. Programs can clear it to re-enable flashing.

- BLNCT ($CD / decimal 205)
  - Countdown timer used by the blink interrupt. The blink routine stores 20 here, and every jiffy (1/60 second) it is decremented. When it reaches zero the cursor is toggled and BLNCT is reloaded with 20. Under normal timing this yields about 3 toggles per second.

- GDBLN ($CE / decimal 206)
  - Holds the normal screen code (PETSCII/charset code) of the character currently at the cursor position so the blink routine can restore it when the cursor is moved or when the blink shows the normal character.

- BLNON ($CF / decimal 207)
  - Tracks whether the cursor is currently showing the reversed character (0) or the normal character (1) for the last blink update.

## Usage
- To force the cursor to flash while a program is running (e.g., to indicate input is expected), clear BLNSW:
  - BASIC: POKE 204,0
- Typical blink cycle: BLNCT is initialized to 20, decremented every jiffy (1/60 s), when zero the blink toggle runs and BLNCT is reset to 20.

## Source Code
```text
; Cursor blink control zero-page register map (decimal / hex)
; 204 / $CC  BLNSW  - Cursor Blink Enable flag (0 = flash cursor; nonzero = inhibit)
; 205 / $CD  BLNCT  - Blink countdown timer (interrupt sets to 20; decremented every jiffy)
; 206 / $CE  GDBLN  - Saved normal screen code at cursor position (restoration value)
; 207 / $CF  BLNON  - Blink state flag (0 = character shown reversed; 1 = character normal)

; Example BASIC usage to force cursor blinking during a program:
```

```basic
10 REM Force cursor to flash
20 POKE 204,0  : REM Clear BLNSW to enable blinking
30 REM ... program that expects input ...
```

## Key Registers
- $00CC-$00CF - Zero Page - Cursor blink control and state (BLNSW, BLNCT, GDBLN, BLNON)

## References
- "pnt_pointer_and_pntr_cursor_column" — expands on cursor position used by blink routines
- "rvs_reverse_print_flag" — expands on reversed-character printing concept related to cursor inversion