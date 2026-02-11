# Screen-scrolling routine (C64 ROM)

**Summary:** ROM routine that scrolls the text screen up one or more lines while preserving tape buffer pointers ($AC-$AF), adjusting cursor and input-row markers ($D6, $C9), updating the screen-row marker ($02A5), and maintaining the start-of-logical-line bits in the start-of-line pointer tables ($D9-$DA). Also touches CIA1 ($DC00-$DC01) to drive/read the keyboard matrix.

## Routine overview
- Saves tape buffer pointers ($AC,$AD,$AE,$AF) on the stack so they are preserved across the scroll.
- Enters a loop set up with X = #$FF (pre-increment loop). Each iteration:
  - Decrements the cursor row ($D6) and the input cursor row ($C9).
  - Decrements the screen-row marker at $02A5.
  - Increments X and calls JSR $E9F0 to fetch a screen-address and set the start-of-line pointer for line X.
  - Compares X with #$18 to detect the last line; branches out of the move loop when reached.
  - For non-final lines, loads the next-line pointer low/high bytes (LDA $ECF1,X and LDA $DA,X), stores the low byte in $AC, and calls JSR $E9C8 to shift that screen line up.
  - Loops until all applicable lines have been shifted up.
- Calls JSR $E9FF to clear the now-empty bottom screen line.
- Runs a second loop over lines 0..$17 (CPX #$18) to shift the start-of-logical-line flag (bit 7) in the start-of-line pointer high-byte table:
  - Clears bit 7 in $D9,X (AND #$7F).
  - If the corresponding $DA,X high-byte has bit 7 set (BPL/bit test), ORA #$80 to re-set the bit in $D9,X and STA $D9,X.
- Marks the last display line as a logical-start line by ORA #$80 on $F1.
- If the first line's start-of-line high byte ($D9) does not have bit 7 set (BPL), the routine branches back to the top to scroll another logical line (allows multi-line scrolling when a logical line spans multiple physical lines).
- Restores/increments the cursor-row ($D6) and increments the screen-row marker $02A5 to account for the final cursor position.
- Updates the keyboard column drive through CIA1:
  - Writes #$7F to $DC00 (CIA1 DRA) to select column c7.
  - Reads $DC01 (CIA1 DRB) and compares with #$FB to detect row r2 active (CTL).
  - Preserves status with PHP and writes #$7F to $DC00 again before exiting.
- Tape pointers pushed at entry remain on the stack and are thus preserved across the entire scroll operation.

**[Note: Source may contain an error — the inline comment "branch if >= $16" contradicts the CPX #$18 used by the code; likely the comment should read $18.]**

## Source Code
```asm
                                *** scroll the screen
.,E8EA A5 AC    LDA $AC         copy the tape buffer start pointer
.,E8EC 48       PHA             save it
.,E8ED A5 AD    LDA $AD         copy the tape buffer start pointer
.,E8EF 48       PHA             save it
.,E8F0 A5 AE    LDA $AE         copy the tape buffer end pointer
.,E8F2 48       PHA             save it
.,E8F3 A5 AF    LDA $AF         copy the tape buffer end pointer
.,E8F5 48       PHA             save it
.,E8F6 A2 FF    LDX #$FF        set to -1 for pre increment loop
.,E8F8 C6 D6    DEC $D6         decrement the cursor row
.,E8FA C6 C9    DEC $C9         decrement the input cursor row
.,E8FC CE A5 02 DEC $02A5       decrement the screen row marker
.,E8FF E8       INX             increment the line number
.,E900 20 F0 E9 JSR $E9F0       fetch a screen address, set the start of line X
.,E903 E0 18    CPX #$18        compare with last line
.,E905 B0 0C    BCS $E913       branch if >= $16
.,E907 BD F1 EC LDA $ECF1,X     get the start of the next line pointer low byte
.,E90A 85 AC    STA $AC         save the next line pointer low byte
.,E90C B5 DA    LDA $DA,X       get the start of the next line pointer high byte
.,E90E 20 C8 E9 JSR $E9C8       shift the screen line up
.,E911 30 EC    BMI $E8FF       loop, branch always
.,E913 20 FF E9 JSR $E9FF       clear screen line X
                                now shift up the start of logical line bits
.,E916 A2 00    LDX #$00        clear index
.,E918 B5 D9    LDA $D9,X       get the start of line X pointer high byte
.,E91A 29 7F    AND #$7F        clear the line X start of logical line bit
.,E91C B4 DA    LDY $DA,X       get the start of the next line pointer high byte
.,E91E 10 02    BPL $E922       if next line is not a start of line skip the start set
.,E920 09 80    ORA #$80        set line X start of logical line bit
.,E922 95 D9    STA $D9,X       set start of line X pointer high byte
.,E924 E8       INX             increment line number
.,E925 E0 18    CPX #$18        compare with last line
.,E927 D0 EF    BNE $E918       loop if not last line
.,E929 A5 F1    LDA $F1         get start of last line pointer high byte
.,E92B 09 80    ORA #$80        mark as start of logical line
.,E92D 85 F1    STA $F1         set start of last line pointer high byte
.,E92F A5 D9    LDA $D9         get start of first line pointer high byte
.,E931 10 C3    BPL $E8F6       if not start of logical line loop back and
                                scroll the screen up another line
.,E933 E6 D6    INC $D6         increment the cursor row
.,E935 EE A5 02 INC $02A5       increment screen row marker
.,E938 A9 7F    LDA #$7F        set keyboard column c7
.,E93A 8D 00 DC STA $DC00       save VIA 1 DRA, keyboard column drive
.,E93D AD 01 DC LDA $DC01       read VIA 1 DRB, keyboard row port
.,E940 C9 FB    CMP #$FB        compare with row r2 active, [CTL]
.,E942 08       PHP             save status
.,E943 A9 7F    LDA #$7F        set keyboard column c7
.,E945 8D 00 DC STA $DC00       save VIA 1 DRA, keyboard column drive
```

## Key Registers
- $AC-$AF - RAM - Tape buffer pointers (start low/high: $AC/$AD, end low/high: $AE/$AF) saved on stack
- $02A5 - RAM - Screen row marker (decremented/incremented during scroll)
- $C9 - RAM - Input cursor row
- $D6 - RAM - Cursor row
- $D9-$DA - RAM - Start-of-line pointer table (high-byte entries); bit 7 = start-of-logical-line flag
- $F1 - RAM - Start-of-last-line pointer high byte (marked as logical start)
- $ECF1 - KERNAL ROM/data - Table base used with X (LDA $ECF1,X) to obtain start-of-next-line low byte
- $DC00-$DC01 - CIA 1 - DRA (keyboard column drive) / DRB (keyboard row input)

## References
- "newline_and_carriage_return_handling" — expands on calls this routine when newline reaches the bottom of the screen
- "insert_space_and_shift_screen_line" — expands on shared line/colour RAM shifting concepts
- "set_colour_code" — expands on colour state preserved while scrolling