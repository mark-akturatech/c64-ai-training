# Move cursor to previous line (ROM $E701–$E715)

**Summary:** Commodore 64 BASIC ROM routine at $E701–$E715 moves the text cursor to the previous line or, if already at the top row, clears the cursor column and pops a saved return address from the stack; uses zero page variables $D6 (cursor row), $D5 (line length), $D3 (cursor column) and calls $E56C to recompute screen pointers. Contains PLA/JSR/DEX/BNE/RTS mnemonics.

## Operation
This routine attempts to move the cursor up one text row:

- LDX $D6 — load cursor row (zero page) into X.
- BNE $E70B — if X != 0 (not top row) branch to decrement row handling.
- If X == 0 (already at top row):
  - STX $D3 — clear cursor column (store zero into zero page $D3).
  - PLA / PLA — pull two bytes from the stack (commented as "dump return address low/high byte"); these POPs modify A and processor flags.
  - BNE $E6A8 — branch based on the last PLA result (branch if A != 0). The branch target restores registers and exits (per ROM context).
- If not top row (branch taken at $E703):
  - DEX — decrement X (row -= 1).
  - STX $D6 — save decremented row back to $D6.
  - JSR $E56C — recompute/set screen pointers for the new cursor row/column.
  - LDY $D5 — load current screen line length (zero page $D5) into Y.
  - STY $D3 — store Y to $D3, saving the cursor column for the new row.
  - RTS — return.

Behavioral notes:
- The routine distinguishes top-of-screen handling (clear column + discard saved return address) from the normal case (decrement row and recompute pointers).
- The two PLA instructions pop two bytes (low then high) from the stack; the subsequent BNE tests the A register resulting from the second PLA.
**[Note: Source may contain an error — the original comment "branch always" for the BNE is incorrect; BNE is conditional and only taken if A != 0 after the second PLA.]**

## Source Code
```asm
                                *** back onto the previous line if possible
.,E701 A6 D6    LDX $D6         get the cursor row
.,E703 D0 06    BNE $E70B       branch if not top row
.,E705 86 D3    STX $D3         clear cursor column
.,E707 68       PLA             dump return address low byte
.,E708 68       PLA             dump return address high byte
.,E709 D0 9D    BNE $E6A8       restore registers, set quote flag and exit, branch always
.,E70B CA       DEX             decrement the cursor row
.,E70C 86 D6    STX $D6         save the cursor row
.,E70E 20 6C E5 JSR $E56C       set the screen pointers for cursor row, column
.,E711 A4 D5    LDY $D5         get current screen line length
.,E713 84 D3    STY $D3         save the cursor column
.,E715 60       RTS             
```

## References
- "advance_cursor_autoscroll_and_newline_handling" — handling when characters push cursor across lines
- "home_cursor_and_compute_line_pointers" — related pointer computations for cursor positioning