# GO TO NEXT LINE (KERNAL)

**Summary:** KERNAL routine at $E87C that advances the cursor to the start of the next logical screen line, handling linked (double) logical lines via the LTDB1 link table ($D9). Uses zero page pointers LXSP ($C9) and TBLX ($D6), tests for bottom-of-screen (CPX #$19) and calls the scroll routine ($E8EA) when needed; stores updated TBLX and jumps to set screen pointers ($E56C).

## Description
This routine moves the cursor to the start of the next logical line. Sequence and behavior:

- LSR $C9: shifts the LXSP zero-page byte right (LXSP holds cursor X–Y position; operation is part of cursor position handling).
- LDX $D6 / INX: load TBLX (current logical-line index) and increment it to point to the next logical line.
- CPX #$19 / BNE $E888 / JSR $E8EA: compare the incremented index against $19 (decimal 25; test behaves as "26th line"), and if equal, call the scroll-down routine at $E8EA before continuing.
- LDA $D9,X / BPL $E880: test the LTDB1 (link table) entry indexed by X. If the test indicates a linked (double) logical line, branch to increment X again (advance an extra physical line).
- STX $D6: store the updated line index back to TBLX.
- JMP $E56C: jump to the routine that sets screen pointers for the new cursor position.

Behavioral notes:
- The routine handles linked logical lines by advancing two physical lines when LTDB1 indicates a link (the LDA/BPL pair).
- The bottom-of-screen check uses the incremented TBLX value; when it reaches the threshold ($19), the scroll routine is invoked.
- Final jump transfers control to the screen-pointer setup routine rather than returning.

## Source Code
```asm
; GO TO NEXT LINE
; The cursor is placed at the start of the next logical
; screen line. This involves moving down two lines for a
; linked line. If this places the cursor below the bottom of
; the screen, then the screen is scrolled.
.,E87C 46 C9    LSR $C9         ; LXSP, cursor X-Y position
.,E87E A6 D6    LDX $D6         ; TBLX, current line number
.,E880 E8       INX             ; next line
.,E881 E0 19    CPX #$19        ; 26th line
.,E883 D0 03    BNE $E888       ; nope, scroll is not needed
.,E885 20 EA E8 JSR $E8EA       ; scroll down
.,E888 B5 D9    LDA $D9,X       ; test LTDB1, screen line link table if first of two
.,E88A 10 F4    BPL $E880       ; yes, jump down another line
.,E88C 86 D6    STX $D6         ; store in TBLX
.,E88E 4C 6C E5 JMP $E56C       ; set screen pointers
```

## Key Registers
- $C9 - Zero page - LXSP (cursor X-Y position)
- $D6 - Zero page - TBLX (current logical line index / table index)
- $D9 - Zero page - LTDB1 (screen line link table; indexed by TBLX to detect linked lines)

## References
- "scroll_screen" — expands on called when cursor moves past bottom of screen (scroll down)
- "set_start_of_line" — expands on sets screen pointers after moving to the next line
- "output_carriage_return" — expands on used by carriage return to position cursor

## Labels
- GO_TO_NEXT_LINE
- LXSP
- TBLX
- LTDB1
