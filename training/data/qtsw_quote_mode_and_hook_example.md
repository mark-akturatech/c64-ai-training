# QTSW ($D4) — Quote mode flag and behaviors

**Summary:** QTSW at $D4 is the BASIC/editor quote-mode flag on the C64: 0 = not in quote mode, nonzero = in quote mode. Covers quote-toggle semantics (per-quote on a line), how nonprinting characters are shown/ deferred while in quote/insert mode, the DELETE key exception, exit methods, and a BASIC+machine-language example that hooks the key-scan interrupt to clear $D4 with F1.

## Behavior and semantics
- Purpose: QTSW ($D4) reflects whether the BASIC line editor is currently in quote mode. When nonzero, the editor treats the line as being "inside quotes".
- Toggle rule: Quote mode is toggled each time you type a quotation mark (") on a given line. The 1st quote turns it on, the 2nd turns it off, the 3rd on again, etc. (toggle per-quote on that line).
- Nonprinting characters while in quote mode:
  - If the editor is in quote mode and you enter a cursor-control character or other nonprinting control, a printed/symbolic equivalent is placed on the screen instead of performing the control action immediately.
  - The actual control action (cursor movement, etc.) is deferred until the string is later executed by a PRINT statement, at which time the deferred control operations occur.
- DELETE key exception:
  - The DELETE key functions normally in quote mode (it deletes characters on the line).
  - To enter a character that is equivalent to the DELETE key (i.e., to print the delete-character itself), you must use insert mode (see location $D8).
- Exiting quote mode:
  - Enter a closing quotation mark on the same line to toggle quote mode off.
  - Press RETURN or SHIFT-RETURN to exit quote mode (these end the line).
- Escaping quote/insert mode without moving to a new line:
  - The provided machine-language hook example intercepts the key-scan interrupt and clears $D4 when F1 is pressed, allowing you to exit quote mode (set QTSW to 0) without advancing to a new line. The BASIC loader in the example POKEs the machine code into RAM starting at $0352 (decimal 850) and SYSs to it.

## Source Code
```basic
10 FOR I=850 TO I+41:READ A:POKE I,A:NEXT
20 PRINTCHR$(147)"PRESS F1 KEY TO ESCAPE QUOTE MODE"
30 PRINT"TO RESTART AFTER RESTORE ONLY, SYS 850":SYS850:NEW
40 DATA  173 , 143 , 2 , 141 , 46 , 3 , 173 , 144 , 2 , 141
50 DATA 47 , 3 , 120 , 169 , 107 , 141 , 143 , 2 , 169 , 3
60 DATA 141 , 144 , 2 , 88 , 96 , 165 , 203 , 201 , 4 , 208
70 DATA 8 , 169 , 0 , 133 , 212 , 133 , 216 , 133 , 199 , 108 , 46 , 3
```

(Above BASIC writes a 42-byte machine-language routine at address 850 ($0352) and SYSs to it. The ML routine hooks the key-scan interrupt and clears $D4 when F1 is detected.)

## Key Registers
- $D4 - BASIC/editor RAM flag - Quote mode flag: 0 = not in quote mode; nonzero = quote mode active

## References
- "insrt_insert_mode_flag" — expands on insert mode interaction and differences from quote mode
- "pnt_pointer_and_pntr_cursor_column" — expands on cursor/line pointers updated when quote/insert mode changes affect editing

## Labels
- QTSW
