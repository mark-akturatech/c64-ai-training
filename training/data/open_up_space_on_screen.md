# Open a space on the screen (KERNAL routine E965-E9C5)

**Summary:** Routine (JSR entry at $E965) that opens a blank line at the cursor row: increments the cursor row ($D6), scans RAM/ROM start-of-line pointer tables ($D9/$DA and $ECEF), decides whether to scroll ($JSR $E8EA / $JSR $E9C8) or clear a line ($JSR $E9FF), temporarily pushes tape buffer pointers ($AC-$AF) while modifying lines, updates the logical line marker ($02A5) and finally restores tape pointers and returns.

## Description
This KERNAL routine inserts space at the current cursor row by advancing the cursor and moving lines below the insertion point down (or clearing the last line) while preserving logical-line bookkeeping.

High-level flow:
- Load cursor row from $D6 into X and increment X to examine the next row.
- Loop upward (incrementing X) while the start-of-line marker at $D9,X indicates "not a start-of-logical-line" (BPL tests bit7 clear). When a start-of-logical-line is found, store the row index in $02A5 (logical line marker).
- Compare the found row index against the last visible line (#$18). If equal or less, skip scrolling; if greater, call $E8EA to scroll the screen, decrement the screen-row marker, decrement $D6 (the cursor row) and JMP to $E6DA to add that row to the current logical line and return.
- If scrolling/shift/clear is required for lines below the marker:
  - Save tape buffer pointers from $AC-$AF by PHA four times (push to stack).
  - Set X = #$19 and loop with a pre-decrement (DEX) to iterate line indexes downward.
  - For each X: call the fetch-screen-address routine (JSR $E9F0), then compare the fetched index in X with the logical screen-row marker $02A5 (CPX $02A5).
    - If X < or = $02A5, branch to clear the screen line (JSR $E9FF).
    - Otherwise use ROM table $ECEF,X to load the low byte of the previous line start address and copy that into $AC, take the corresponding high byte from RAM table $D8,X and call $E9C8 to shift that line down (copy characters/colours).
  - Loop until all candidate lines are processed.
- After shifting, call $E9FF to clear the target screen line.
- Recompute/fix the RAM pointer bytes for lines from X = #$17 down to the logical marker:
  - For each entry, load $DA,X (low/high pointer with flags), AND #$7F (clear bit7), load $D9,X into Y and, if negative (bit7 set), ORA #$80 to restore bit7 before storing back to $DA,X. This preserves the logical-line bit flag in the pointer table.
- Reload the logical marker into X (LDX $02A5), call $E6DA to add the row to the current logical line bookkeeping, then jump to $E958 which restores the tape buffer pointers (popped previously) and exits.

Important constants and loop bounds used:
- #$19 used when scanning lines downward (pre-decremented loop).
- #$18 tested as the "last line" comparison.
- #$17 used when fixing pointer flags after shifting.

Remarks:
- The routine treats bit7 of the pointer-high table entries as the logical-line-start marker (BPL/branch tests).
- Several helper JSRs are used:
  - $E9F0: fetch screen address for a given line index.
  - $E9C8: shift/copy a screen line down (source/target bytes transfer).
  - $E9FF: clear a full screen line.
  - $E8EA: top-level screen scroll (called when insertion goes past last visible line).
  - $E6DA: add this row to the current logical line.
  - $E958: restores tape buffer pointers and returns (suffix path).
- Tape buffer pointers at $AC-$AF are preserved on the stack during long operations to avoid corrupting tape variables.

## Source Code
```asm
; open up a space on the screen
.,E965 A6 D6    LDX $D6         get the cursor row
.,E967 E8       INX             increment the row
.,E968 B5 D9    LDA $D9,X       get the start of line X pointer high byte
.,E96A 10 FB    BPL $E967       loop if not start of logical line
.,E96C 8E A5 02 STX $02A5       save the screen row marker
.,E96F E0 18    CPX #$18        compare it with the last line
.,E971 F0 0E    BEQ $E981       if = last line go ??
.,E973 90 0C    BCC $E981       if < last line go ??
                                else it was > last line
.,E975 20 EA E8 JSR $E8EA       scroll the screen
.,E978 AE A5 02 LDX $02A5       get the screen row marker
.,E97B CA       DEX             decrement the screen row marker
.,E97C C6 D6    DEC $D6         decrement the cursor row
.,E97E 4C DA E6 JMP $E6DA       add this row to the current logical line and return
.,E981 A5 AC    LDA $AC         copy tape buffer pointer
.,E983 48       PHA             save it
.,E984 A5 AD    LDA $AD         copy tape buffer pointer
.,E986 48       PHA             save it
.,E987 A5 AE    LDA $AE         copy tape buffer end pointer
.,E989 48       PHA             save it
.,E98A A5 AF    LDA $AF         copy tape buffer end pointer
.,E98C 48       PHA             save it
.,E98D A2 19    LDX #$19        set to end line + 1 for predecrement loop
.,E98F CA       DEX             decrement the line number
.,E990 20 F0 E9 JSR $E9F0       fetch a screen address
.,E993 EC A5 02 CPX $02A5       compare it with the screen row marker
.,E996 90 0E    BCC $E9A6       if < screen row marker go ??
.,E998 F0 0C    BEQ $E9A6       if = screen row marker go ??
.,E99A BD EF EC LDA $ECEF,X     else get the start of the previous line low byte from the ROM table
.,E99D 85 AC    STA $AC         save previous line pointer low byte
.,E99F B5 D8    LDA $D8,X       get the start of the previous line pointer high byte
.,E9A1 20 C8 E9 JSR $E9C8       shift the screen line down
.,E9A4 30 E9    BMI $E98F       loop, branch always
.,E9A6 20 FF E9 JSR $E9FF       clear screen line X
.,E9A9 A2 17    LDX #$17        
.,E9AB EC A5 02 CPX $02A5       compare it with the screen row marker
.,E9AE 90 0F    BCC $E9BF       
.,E9B0 B5 DA    LDA $DA,X       
.,E9B2 29 7F    AND #$7F        
.,E9B4 B4 D9    LDY $D9,X       get start of line X pointer high byte
.,E9B6 10 02    BPL $E9BA       
.,E9B8 09 80    ORA #$80        
.,E9BA 95 DA    STA $DA,X       
.,E9BC CA       DEX             
.,E9BD D0 EC    BNE $E9AB       
.,E9BF AE A5 02 LDX $02A5       get the screen row marker
.,E9C2 20 DA E6 JSR $E6DA       add this row to the current logical line
.,E9C5 4C 58 E9 JMP $E958       restore the tape buffer pointers and exit
```

## Key Registers
- $02A5 - Logical screen-row marker (saved screen row index)
- $AC-$AF - Tape buffer pointers/end pointers (saved to stack by PHA)
- $D6 - Cursor row (current cursor row index)
- $D8 - RAM pointer table high bytes (start-of-line pointer high byte table)
- $D9-$DA - RAM pointer tables (start-of-line pointer table; bit7 used as logical-line start flag)
- $ECEF - ROM table base used to fetch previous-line low bytes (ROM start-of-line table)

## References
- "fetch_screen_address" — expands on the JSR $E9F0 routine used to fetch a screen line start address
- "shift_screen_line_up_down" — expands on JSR $E9C8 that copies character/colour bytes between lines when scrolling
- "clear_screen_line_x" — expands on JSR $E9FF that clears a full screen line
- "calc_screen_line_colour_pointers_e9e0" — expands on computing the colour-RAM pointers for source/target lines
- "wait_delay_and_restore_tape_pointers" — earlier routine that restores tape pointers and returns; related flow