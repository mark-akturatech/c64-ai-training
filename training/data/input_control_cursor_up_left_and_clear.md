# KERNAL: Input/Control-code handler (CURSOR UP / RVS OFF / CURSOR LEFT / CLR) $E832-$E879

**Summary:** Disassembly of the C64 KERNAL input handler at $E832–$E879 showing comparisons against control codes (CURSOR UP #$11, RVS OFF #$12, CURSOR LEFT #$1D, CLR #$13), updates to cursor zero-page variables $D6 (row) and $D3 (column), calls to screen/cursor helper routines ($E56C, $E8A1, $E701, $E544, $E8CB) and final jump to the special-character handler ($EC4F).

## Control-code handling and cursor logic
This code fragment tests the input character in A against several control codes and performs cursor and screen actions:

- CMP #$11 / BNE: If A == CURSOR UP (#$11) then:
  - LDX $D6 — load cursor row (zero-page $D6).
  - If row == 0 (top line) branch to restore/exit ($E871/$E6A8).
  - DEC $D6 — decrement row.
  - LDA $D3 — load cursor column (zero-page $D3).
  - SEC; SBC #$28 — subtract one line length (0x28) using carry (A - $28).
  - BCC $E847 — if stepped back to previous line, call set-screen-pointers JSR $E56C to recompute row/column pointers; if that routine signals failure (BNE $E871) restore/exit.
  - Otherwise STA $D3 to save the new column and exit.

- CMP #$12 / BNE: If A == RVS OFF (#$12) then clear reverse flag:
  - LDA #$00; STA $C7 — clear reverse flag at $C7.

- CMP #$1D / BNE: If A == CURSOR LEFT (#$1D) then:
  - TYA — transfer Y (cursor column copy).
  - If Y == 0, JSR $E701 to try moving to the previous line; then restore/exit.
  - Otherwise JSR $E8A1 (test for line decrement), DEY, STY $D3 — decrement column and save it, then JMP $E6A8 to restore/exit.

- CMP #$13 / BNE: If A == CLR (#$13) then JSR $E544 to clear the screen; then restore/exit.

After the control-code branches, the code restores bit 7 in A (ORA #$80) — the comment notes that only certain colour codes are valid (black, cyan, magenta, yellow) — and calls the colour-setting routine JSR $E8CB. Finally it JMPs to $EC4F to check for special character codes (jump to the special-character handler).

Notable zero-page variables used in this fragment:
- $D6 — cursor row (load/store with LDX/DEC)
- $D3 — cursor column (LDA/STA/STY)

Routine call targets (behavior depends on their implementations elsewhere):
- $E56C — set screen pointers for cursor row/column
- $E8A1 — test for line decrement (used before moving left)
- $E701 — move to previous line if possible (used for CURSOR LEFT when at column 0)
- $E544 — clear screen (CLR)
- $E8CB — set colour code for the character
- $E6A8 — restore registers, set quote flag, and exit (common return point)
- $EC4F — special-character handler entry

## Source Code
```asm
.,E832 C9 11    CMP #$11        compare with [CURSOR UP]
.,E834 D0 16    BNE $E84C       branch if not [CURSOR UP]
.,E836 A6 D6    LDX $D6         get the cursor row
.,E838 F0 37    BEQ $E871       if on the top line go restore the registers, set the
                                quote flag and exit
.,E83A C6 D6    DEC $D6         decrement the cursor row
.,E83C A5 D3    LDA $D3         get the cursor column
.,E83E 38       SEC             set carry for subtract
.,E83F E9 28    SBC #$28        subtract one line length
.,E841 90 04    BCC $E847       branch if stepped back to previous line
.,E843 85 D3    STA $D3         else save the cursor column ..
.,E845 10 2A    BPL $E871       .. and exit, branch always
.,E847 20 6C E5 JSR $E56C       set the screen pointers for cursor row, column ..
.,E84A D0 25    BNE $E871       .. and exit, branch always
.,E84C C9 12    CMP #$12        compare with [RVS OFF]
.,E84E D0 04    BNE $E854       if not [RVS OFF] continue
.,E850 A9 00    LDA #$00        else clear A
.,E852 85 C7    STA $C7         clear the reverse flag
.,E854 C9 1D    CMP #$1D        compare with [CURSOR LEFT]
.,E856 D0 12    BNE $E86A       if not [CURSOR LEFT] go ??
.,E858 98       TYA             copy the cursor column
.,E859 F0 09    BEQ $E864       if at start of line go back onto the previous line
.,E85B 20 A1 E8 JSR $E8A1       test for line decrement
.,E85E 88       DEY             decrement the cursor column
.,E85F 84 D3    STY $D3         save the cursor column
.,E861 4C A8 E6 JMP $E6A8       restore the registers, set the quote flag and exit
.,E864 20 01 E7 JSR $E701       back onto the previous line if possible
.,E867 4C A8 E6 JMP $E6A8       restore the registers, set the quote flag and exit
.,E86A C9 13    CMP #$13        compare with [CLR]
.,E86C D0 06    BNE $E874       if not [CLR] continue
.,E86E 20 44 E5 JSR $E544       clear the screen
.,E871 4C A8 E6 JMP $E6A8       restore the registers, set the quote flag and exit
.,E874 09 80    ORA #$80        restore b7, colour can only be black, cyan, magenta
                                or yellow
.,E876 20 CB E8 JSR $E8CB       set the colour code
.,E879 4C 4F EC JMP $EC4F       go check for special character codes except for switch
```

## References
- "insert_space_and_shift_screen_line" — expands on insert handling and insert-count test that may follow input handling
- "newline_and_carriage_return_handling" — expands on cursor movement and newline interactions
- "set_colour_code" — expands on the call to set the colour code for the character

## Labels
- $D6
- $D3
