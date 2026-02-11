# KERNAL CHROUT (E716–E7D1) — prologue and unshifted character handling

**Summary:** KERNAL CHROUT entry and unshifted-character path ($E716..$E7D1). Saves registers, clears CRSW ($D0), selects shifted vs unshifted handling, implements unshifted character processing including <RETURN>, <DEL>, cursor right/down, HOME, RVS, insert-mode/quotes interactions, moving text and colour RAM synchronization, and hands off to setup_screen_print / graphics-text control. Uses zero-page pointers ($D1,$D3,$D5,$D6,$D7,$D8,$C7,$F3) and current colour at $0286.

## Description
This chunk is the CHROUT entry prologue and the complete unshifted-character handling path. On entry A contains the character to output and registers are pushed to the stack. CRSW is cleared ($D0:=0), PNTR (cursor column) is loaded from $D3 and the value in A is temporarily saved in $D7. The sign of A (bit7) selects shifted vs unshifted: negative A branches to the shifted-character handler; otherwise the unshifted path starts at $E72A.

Unshifted processing:
- <RETURN> ($0D): branches to the RETURN handling routine at $E891.
- Space vs PET-graphics test: distinguishes ordinary space and PET graphics range by comparing against $20 and $60; bit-masking (AND #$DF/#$3F) is used before calling QUOTES TSET ($E684) to decide whether quotes are open; then jumps to SET UP SCREEN PRINT ($E693/$E697) as appropriate.
- Insert mode ($INSRT,$D8): if insert mode is set, control characters are not interpreted; instead they are output as reversed literals (branch to output reversed character).
- <DEL> ($14): deletion within a line shifts characters left to fill the gap. The code updates PNTR and uses ($D1),Y to copy screen characters backwards, synchronises colour RAM via ($F3),Y, and repeats until it reaches the physical line length LNMX ($D5). It stores a space (#$20) and the current colour ($0286) at the end of the line.
- Quotes mode ($QTSW,$D4): if quotes mode is set, control characters other than <DEL> are emitted reversed.
- RVS ($12): sets RVS output flag in $C7.
- HOME ($13): JSR $E566 to home the cursor.
- Cursor right ($1D): increments PNTR ($D3/Y), checks line length LNMX ($D5); if PNTR exceeds line length, decrements TBLX ($D6) and JSR $E87C to go to the next logical line; sets PNTR to 0 and finishes screen print.
- Cursor down ($11): adds 40 to the cursor column to move down a logical line (ADC #$28), increments TBLX ($D6), compares to LNMX and either finishes or adjusts PNTR; may call $E87C to go to next line.
- On completion of unshifted handling it calls SET COLOUR CODE ($E8CB) then jumps to the graphics/text control handler at $EC44.

Several subroutines are invoked from this path:
- QUOTES TSET (test/toggle quote mode) at $E684
- SET UP SCREEN PRINT at $E693/$E697 (performs actual rendering)
- Line/row movement helpers at $E701, $E87C, $E8A1, $E8B3, $EA24
- Final colour setup at $E8CB
Shifted-character handling branches are at $E7D4 and beyond (not included here).

## Source Code
```asm
.,E716 48       PHA             store (A), (X) and (Y) on stack
.,E717 85 D7    STA $D7         temp store
.,E719 8A       TXA
.,E71A 48       PHA
.,E71B 98       TYA
.,E71C 48       PHA
.,E71D A9 00    LDA #$00
.,E71F 85 D0    STA $D0         store in CRSW
.,E721 A4 D3    LDY $D3         PNTR, cursor positions on line
.,E723 A5 D7    LDA $D7         retrieve from temp store
.,E725 10 03    BPL $E72A       do unshifted characters
.,E727 4C D4 E7 JMP $E7D4       do shifted characters

                                UNSHIFTED CHARACTERS. Ordinary unshifted ASCII characters
                                and PET graphics are output directly to the screen. The
                                following control codes are trapped and precessed:
                                <RETURN>, <DEL>, <CRSR RIGHT>, <CRSR DOWN>. If either
                                insert mode is on or quotes are open (except for <DEL>)
                                then the control characters are not processed, but output
                                as reversed ASCII literals.
.,E72A C9 0D    CMP #$0D        <RETURN>?
.,E72C D0 03    BNE $E731       nope
.,E72E 4C 91 E8 JMP $E891       execute return
.,E731 C9 20    CMP #$20        <SPACE>?
.,E733 90 10    BCC $E745
.,E735 C9 60    CMP #$60        #$60, first PET graphic character?
.,E737 90 04    BCC $E73D
.,E739 29 DF    AND #$DF        %11011111
.,E73B D0 02    BNE $E73F
.,E73D 29 3F    AND #$3F        %00111111
.,E73F 20 84 E6 JSR $E684       do quotes test
.,E742 4C 93 E6 JMP $E693       setup screen print
.,E745 A6 D8    LDX $D8         INSRT, insert mode flag
.,E747 F0 03    BEQ $E74C       mode not set
.,E749 4C 97 E6 JMP $E697       output reversed character
.,E74C C9 14    CMP #$14        <DEL>?
.,E74E D0 2E    BNE $E77E       nope
.,E750 98       TYA             (Y) holds cursor column
.,E751 D0 06    BNE $E759       not start of line
.,E753 20 01 E7 JSR $E701       back on previous line
.,E756 4C 73 E7 JMP $E773
.,E759 20 A1 E8 JSR $E8A1       check line decrement
.,E75C 88       DEY             decrement cursor column
.,E75D 84 D3    STY $D3         and store in PNTR
.,E75F 20 24 EA JSR $EA24       synchronise colour pointer
.,E762 C8       INY             copy character at cursor position (Y+1) to (Y)
.,E763 B1 D1    LDA ($D1),Y     read character
.,E765 88       DEY
.,E766 91 D1    STA ($D1),Y     and store it one position back
.,E768 C8       INY
.,E769 B1 F3    LDA ($F3),Y     read character  colour
.,E76B 88       DEY
.,E76C 91 F3    STA ($F3),Y     and store it one position back
.,E76E C8       INY             more characters to move
.,E76F C4 D5    CPY $D5         compare with LNMX, length of physical screen line
.,E771 D0 EF    BNE $E762       if not equal, move more characters
.,E773 A9 20    LDA #$20
.,E775 91 D1    STA ($D1),Y     store <SPACE> at end of line
.,E777 AD 86 02 LDA $0286       COLOR, current character colour
.,E77A 91 F3    STA ($F3),Y     store colour at end of line
.,E77C 10 4D    BPL $E7CB       always jump
.,E77E A6 D4    LDX $D4         QTSW, editor in quotes mode
.,E780 F0 03    BEQ $E785       no
.,E782 4C 97 E6 JMP $E697       output reversed character
.,E785 C9 12    CMP #$12        <RVS>?
.,E787 D0 02    BNE $E78B       no
.,E789 85 C7    STA $C7         RVS, reversed character output flag
.,E78B C9 13    CMP #$13        <HOME>?
.,E78D D0 03    BNE $E792       no
.,E78F 20 66 E5 JSR $E566       home cursor
.,E792 C9 1D    CMP #$1D        <CRSR RIGHT>?
.,E794 D0 17    BNE $E7AD       nope
.,E796 C8       INY             increment (Y), internal counter for column
.,E797 20 B3 E8 JSR $E8B3       check line increment
.,E79A 84 D3    STY $D3         store (Y) in PNTR
.,E79C 88       DEY             decrement (Y)
.,E79D C4 D5    CPY $D5         and compare to LNMX
.,E79F 90 09    BCC $E7AA       not exceeded line length
.,E7A1 C6 D6    DEC $D6         TBLX, current physical line number
.,E7A3 20 7C E8 JSR $E87C       goto next line
.,E7A6 A0 00    LDY #$00
.,E7A8 84 D3    STY $D3         set PNTR to zero, cursor to the left
.,E7AA 4C A8 E6 JMP $E6A8       finish screen print
.,E7AD C9 11    CMP #$11        <CRSR DOWN>?
.,E7AF D0 1D    BNE $E7CE       no
.,E7B1 18       CLC             prepare for add
.,E7B2 98       TYA             (Y) holds cursor column
.,E7B3 69 28    ADC #$28        add 40 to next line
.,E7B5 A8       TAY             to (Y)
.,E7B6 E6 D6    INC $D6         increment TBLX, physical line number
.,E7B8 C5 D5    CMP $D5         compare to LNMX
.,E7BA 90 EC    BCC $E7A8       finish screen print
.,E7BC F0 EA    BEQ $E7A8       finish screen print
.,E7BE C6 D6    DEC $D6         restore TBLX
.,E7C0 E9 28    SBC #$28
.,E7C2 90 04    BCC $E7C8
.,E7C4 85 D3    STA $D3         store PNTR
.,E7C6 D0 F8    BNE $E7C0
.,E7C8 20 7C E8 JSR $E87C       go to next line
.,E7CB 4C A8 E6 JMP $E6A8       finish screen print
.,E7CE 20 CB E8 JSR $E8CB       set colour code
.,E7D1 4C 44 EC JMP $EC44       do graphics/text control
```

## Key Registers
- $D0 - CRSW - carriage/character switch (cleared on entry)
- $D1 - ZP pointer (used with indirect,Y for screen memory reads/writes)
- $D3 - PNTR - cursor column pointer (cursor position on line)
- $D4 - QTSW - quotes/editor mode flag
- $D5 - LNMX - length of physical screen line (used to stop shifts)
- $D6 - TBLX - current physical line number / table index
- $D7 - temporary save of A (character)
- $D8 - INSRT - insert-mode flag
- $C7 - RVS - reversed-character output flag (set by <RVS>)
- $F3 - ZP pointer (colour RAM pointer, used with indirect,Y)
- $0286 - current character COLOR (absolute memory used to fill colour on deletion)

## References
- "setup_screen_print" — performs the actual character rendering (called from this output path)
- "advance_cursor" — moves cursor after printing
- "retreat_cursor" — used when backspacing across logical lines
- "quotes_tset" — tests/toggles quote mode while echoing characters
- "output_to_screen_shifted_characters" — shifted-character handler branch (continues at $E7D4)

## Labels
- CHROUT
- PNTR
- QTSW
- LNMX
- TBLX
