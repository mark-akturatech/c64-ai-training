# KERNAL ROM: Control-Key Dispatch (cursor R/L, CLR/HOME, RVS) — ROM $E77E-$E7CB

**Summary:** ROM routine at $E77E handles control-key dispatch for reverse-video toggle, CLR/HOME, CURSOR RIGHT ($1D) and CURSOR DOWN ($11). Uses KERNAL/ZP variables $D4 (quote flag), $C7 (reverse flag), $D3 (cursor column), $D5 (current screen line length), $D6 (cursor row); calls JSRs $E566 (home), $E8B3 (line-wrap test), $E87C (newline), and $E697 (insert reversed char).

## Description
This ROM fragment implements dispatch for several control characters:

- Quote/reverse-character handling:
  - LDX $D4 tests the "quote" flag. If set, it jumps to $E697 to insert a reversed character (re-used insertion path).
  - CMP #$12 detects the [RVS ON] control ($12). If equal, STA $C7 sets the reverse-video flag in $C7.

- CLR/HOME:
  - CMP #$13 detects the [CLR HOME] control ($13). If equal, JSR $E566 is called to home the cursor.

- CURSOR RIGHT ($1D):
  - CMP #$1D branches to the CURSOR RIGHT handler when matched.
  - INY increments Y (cursor column), JSR $E8B3 performs the "test for line increment" routine.
  - STY $D3 saves the new cursor column.
  - DEY restores Y; CPY $D5 compares the cursor column with the current screen line length ($D5).
  - If column >= line length, DEC $D6 decrements the cursor row and JSR $E87C executes a newline, then clears the column (LDY #$00; STY $D3).
  - Otherwise the routine exits (JMP $E6A8) after restoring registers and setting quote flag.

- CURSOR DOWN ($11):
  - CMP #$11 enters the CURSOR DOWN handler.
  - Clears carry, TYA, ADC #$28, TAY — the code adds #$28 (decimal 40) to the Y register (cursor column) before comparison; this shifts the column for logical-line boundaries (keeps column within the logical start).
  - INC $D6 increments the cursor row.
  - CMP $D5 compares adjusted column with current screen line length.
  - If column < or = line length, saves column (STY $D3) and exits; otherwise the cursor has moved past the end of the line:
    - DEC $D6 and SBC #$28 back the column and row toward the logical start; stores column (STA $D3) and loops until at the start of the logical line, then JSR $E87C to newline and JMP $E6A8 to restore/exit.

Calls and jumps:
- JSR $E566 — home cursor (CLR/HOME)
- JSR $E8B3 — test for line increment (used by CURSOR RIGHT)
- JSR $E87C — perform newline (used by both right-at-end and down handlers)
- JMP $E697 — insert reversed character path (when in quote mode)
- JMP $E6A8 — restore registers, set quote flag and exit

Notes:
- The code uses several zero-page/KERNAL variables for cursor state; the comparison against $D5 determines line-wrapping behaviour.
- #$28 (40 decimal) is used as an offset when moving CURSOR DOWN to respect the logical start of the line.

## Source Code
```asm
.,E77E A6 D4    LDX $D4         get cursor quote flag, $xx = quote, $00 = no quote
.,E780 F0 03    BEQ $E785       branch if not quote mode
.,E782 4C 97 E6 JMP $E697       insert reversed character
.,E785 C9 12    CMP #$12        compare with [RVS ON]
.,E787 D0 02    BNE $E78B       if not [RVS ON] skip setting the reverse flag
.,E789 85 C7    STA $C7         else set the reverse flag
.,E78B C9 13    CMP #$13        compare with [CLR HOME]
.,E78D D0 03    BNE $E792       if not [CLR HOME] continue
.,E78F 20 66 E5 JSR $E566       home the cursor
.,E792 C9 1D    CMP #$1D        compare with [CURSOR RIGHT]
.,E794 D0 17    BNE $E7AD       if not [CURSOR RIGHT] go ??
.,E796 C8       INY             increment the cursor column
.,E797 20 B3 E8 JSR $E8B3       test for line increment
.,E79A 84 D3    STY $D3         save the cursor column
.,E79C 88       DEY             decrement the cursor column
.,E79D C4 D5    CPY $D5         compare cursor column with current screen line length
.,E79F 90 09    BCC $E7AA       exit if less
                                else the cursor column is >= the current screen line
                                length so back onto the current line and do a newline
.,E7A1 C6 D6    DEC $D6         decrement the cursor row
.,E7A3 20 7C E8 JSR $E87C       do newline
.,E7A6 A0 00    LDY #$00        clear cursor column
.,E7A8 84 D3    STY $D3         save the cursor column
.,E7AA 4C A8 E6 JMP $E6A8       restore the registers, set the quote flag and exit
.,E7AD C9 11    CMP #$11        compare with [CURSOR DOWN]
.,E7AF D0 1D    BNE $E7CE       if not [CURSOR DOWN] go ??
.,E7B1 18       CLC             clear carry for add
.,E7B2 98       TYA             copy the cursor column
.,E7B3 69 28    ADC #$28        add one line
.,E7B5 A8       TAY             copy back to Y
.,E7B6 E6 D6    INC $D6         increment the cursor row
.,E7B8 C5 D5    CMP $D5         compare cursor column with current screen line length
.,E7BA 90 EC    BCC $E7A8       if less go save cursor column and exit
.,E7BC F0 EA    BEQ $E7A8       if equal go save cursor column and exit
                                else the cursor has moved beyond the end of this line
                                so back it up until it's on the start of the logical line
.,E7BE C6 D6    DEC $D6         decrement the cursor row
.,E7C0 E9 28    SBC #$28        subtract one line
.,E7C2 90 04    BCC $E7C8       if on previous line exit the loop
.,E7C4 85 D3    STA $D3         else save the cursor column
.,E7C6 D0 F8    BNE $E7C0       loop if not at the start of the line
.,E7C8 20 7C E8 JSR $E87C       do newline
.,E7CB 4C A8 E6 JMP $E6A8       restore the registers, set the quote flag and exit
```

## Key Registers
- $D4 - KERNAL/RAM - cursor "quote" flag (non-zero = quote mode)
- $C7 - KERNAL/RAM - reverse-video flag (set by [RVS ON] $12)
- $D3 - KERNAL/RAM - saved cursor column
- $D5 - KERNAL/RAM - current screen line length (used for wrap tests)
- $D6 - KERNAL/RAM - cursor row

## References
- "insert_delete_close_line_and_clear_last_char" — expands on insert/delete and line adjustments
- "output_character_unshifted_and_control_dispatch" — expands dispatch for other control characters

## Labels
- $D4
- $C7
- $D3
- $D5
- $D6
