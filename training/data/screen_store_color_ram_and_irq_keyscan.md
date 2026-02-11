# Screen write and Color RAM synchronization routines; cursor & keyboard IRQ handlers (KERNAL)

**Summary:** Contains KERNAL ROM routine addresses and brief behavior for screen writes ($EA1C/$EA24), Color RAM pointer synchronization ($EA24), cursor/line timing clears ($E9FF/$EA13), and the CIA#1 Timer A driven IRQ entry ($EA31) that updates software clock, cursor flash, tape interlock and calls keyboard scan (SCNKEY $EA87). Also documents zero-page pointers used by the screen code (PNT $D1, PNTR $D3, quote switch $D4, TBLX $D6) and the VIC-II defaults table ($ECB9).

## Overview
This chunk documents a group of KERNAL routines that handle:
- Writing printable characters to screen memory and keeping Color RAM pointer in sync with the screen position.
- Cursor movement, advancing/returning over line boundaries, line insert/scroll behavior, and cursor blink timing.
- The main periodic IRQ entry (called by CIA#1 Timer A ~1/60s) that updates the software clock, toggles cursor flash, handles tape interlock timing, and invokes the keyboard scan routine (SCNKEY) which reads CIA#1 keyboard lines and converts hardware keycodes into PETSCII.
- Initialization of default I/O devices and writing default values to the VIC-II registers from a table in ROM.

Zero-page variables used by the screen/cursor code are named and given with addresses; the VIC-II default values are taken from a ROM table ($ECB9).

## Cursor, screen pointer and quote-state variables
- PNT (209, $D1) — pointer to the first byte of the current logical screen line. The routine that sets it accounts for the screen-line link table (that can join two physical lines as one logical line).
- PNTR (211, $D3) — used by the cursor-homing routine; set to 0 by the Home Cursor routine.
- Quote switch (212, $D4) — toggled when a quotation mark is encountered (controls quote mode).
- TBLX (214, $D6) — auxiliary pointer/index set to 0 by the Home Cursor routine.

These zero-page locations are set/updated by the screen/cursor routines so subsequent output and color synchronization use the correct screen line and column addresses.

## IRQ, keyboard scanning and timing
- IRQ entry $EA31 (59953 decimal) — main IRQ handler installed to be triggered by CIA#1 Timer A (~1/60 s). Responsibilities include:
  - Update software clock counters.
  - Toggle cursor blink state (cursor flash timing).
  - Maintain tape interlock timing.
  - Call SCNKEY ($EA87) to perform keyboard scanning and decoding.
- SCNKEY $EA87 (60039) — scans keyboard matrix via CIA#1, reads keycodes and decodes them into PETSCII (PETASCII).
- The CIA used is CIA#1 (C64's keyboard/CIA) — Timer A of CIA#1 is the IRQ source (text references Timer A but does not specify CIA register offsets here).

## VIC-II defaults and Color RAM synchronization
- Routine $E5A0 (58784) sets default I/O devices (keyboard and screen) and writes default values to VIC-II registers using the table at $ECB9 (60601 decimal).
- Store-to-screen and Color RAM pointer synchronization:
  - Store to screen: $EA1C (59932) and $EA24 (59940).
  - Synchronize Color RAM pointer to screen: $EA24 (59940) — this routine aligns the Color RAM pointer with the screen memory pointer so color writes correspond to the correct character cell.
- Clearing screen line and cursor blink timing: $E9FF (59903) and $EA13 (59923) are involved in clearing per-line state and resetting cursor blink timing.

## Routine index (addresses given both decimal and hex) — brief descriptions
- 58726  $E566 — Home the Cursor: sets PNTR ($D3) and TBLX ($D6) to 0, falls through to next routine.
- 58732  $E56C — Set Pointer to Current Screen Line: sets PNT ($D1) to the address of the first byte of the current logical line, accounting for the screen-line link table.
- 58784  $E5A0 — Set Default I/O Devices and VIC-II Defaults: selects keyboard/screen as I/O devices and writes VIC-II default register values from table at 60601 ($ECB9).
- 58804  $E5B4 (LP2) — Get a Character from the Keyboard Buffer: transfers first char from keyboard buffer into A, shifts rest up, decrements count.
- 58826  $E5CA — Wait for a Carriage Return from the Keyboard: used by CHKIN keyboard handler; turns cursor on, echoes characters until CR, handles shifted RUN/STOP to force LOAD/RUN.
- 58930  $E632 — Input a Character from Screen or Keyboard: CHRIN portion that returns bytes from current screen position or a keyboard line buffer.
- 59012  $E684 — Test for Quote Marks: checks current character for quote and toggles the quote switch at $D4.
- 59025  $E691 — Add a Character to the Screen: places printable characters into screen memory (part of CHROUT screen output).
- 59048  $E6A8 — Return from Outputting a Character to the Screen: common exit point for CHROUT screen output.
- 59062  $E6B6 — Advance the Cursor: advances cursor, handles end-of-screen scrolling and insertion of physical lines into logical lines.
- 59137  $E701 — Move Cursor Back over a 40-Column Line Boundary.
- 59158  $E716 — Output to the Screen: main CHROUT entry for screen device; prints or handles nonprinting control characters (cursor movement, color change, screen clearing, etc.).
- 59516  $E87C — Move Cursor to Next Line: moves cursor down or scrolls if at last line.
- 59537  $E891 — Output a Carriage Return: clears insert mode, reverse video, quote mode; moves cursor to next line.
- 59553  $E8A1 — If at Beginning of a Screen Line, Move Cursor to Previous Line.
- 59903  $E9FF — clear screen line and cursor blink timing (one of the routines referenced).
- 59923  $EA13 — clear screen line and cursor blink timing (another related routine).
- 59932  $EA1C — Store to screen (first store routine referenced).
- 59940  $EA24 — Store to screen and synchronize Color RAM pointer to screen.
- 59953  $EA31 — IRQ entry: main IRQ handler invoked by CIA#1 Timer A.
- 60039  $EA87 — SCNKEY: keyboard scan and decode routine (reads via CIA#1, decodes to PETSCII).
- 60601  $ECB9 — ROM table: VIC-II default register values (written by $E5A0).

## Key Registers
- $D1 - Zero page (PNT) - pointer to first byte of current logical screen line
- $D3 - Zero page (PNTR) - used by Home Cursor (set to 0)
- $D4 - Zero page (quote switch) - toggled by quote-test routine
- $D6 - Zero page (TBLX) - auxiliary pointer/index (set to 0 by Home Cursor)
- $E566 - ROM routine entry (Home Cursor)
- $E56C - ROM routine entry (Set Pointer to Current Screen Line)
- $E5A0 - ROM routine entry (VIC-II defaults / set I/O)
- $E5B4 - ROM routine entry (Get char from keyboard buffer)
- $E5CA - ROM routine entry (Wait for CR from keyboard)
- $E632 - ROM routine entry (Input char from screen/keyboard)
- $E684 - ROM routine entry (Test for quote marks)
- $E691 - ROM routine entry (Add character to screen)
- $E6A8 - ROM routine entry (Return from screen output)
- $E6B6 - ROM routine entry (Advance cursor)
- $E701 - ROM routine entry (Move cursor back over 40-col boundary)
- $E716 - ROM routine entry (CHROUT -> screen handler)
- $E87C - ROM routine entry (Move cursor to next line)
- $E891 - ROM routine entry (Output carriage return)
- $E8A1 - ROM routine entry (If at beginning of line, move to previous line)
- $E9FF - ROM routine entry (Clear screen line / cursor blink timing)
- $EA13 - ROM routine entry (Clear screen line / cursor blink timing)
- $EA1C - ROM routine entry (Store to screen)
- $EA24 - ROM routine entry (Store to screen + Color RAM pointer sync)
- $EA31 - ROM routine entry (IRQ entry; CIA#1 Timer A driven)
- $EA87 - ROM routine entry (SCNKEY — keyboard scan/decode)
- $ECB9 - ROM table address (VIC-II default register values)

## References
- "cia1_timer_usage_on_c64" — expands on using CIA#1 Timer A to generate IRQs for keyscan and software clock
- "keyboard_decode_tables_and_vectors" — expands on keycode→PETSCII translation tables and vectors

## Labels
- CHROUT
- CHRIN
- SCNKEY
- PNT
- PNTR
- TBLX
