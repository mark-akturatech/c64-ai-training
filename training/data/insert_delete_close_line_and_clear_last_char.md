# KERNAL: Insert/Delete Control Handling (ROM $E745-$E7CB)

**Summary:** Disassembly of the Commodore 64 KERNAL routine that handles [INSERT]/[DELETE] control characters (compare with #$14), inserts reversed characters via $E697, tests/handles line-wrap and back-to-previous-line, shifts characters left to close a deleted position (moving both screen bytes and colour RAM bytes), clears the last character on the line to SPACE, and stores the line colour from $0286.

**Behavior and Flow**

This routine is entered with a character value in A (compared against #$14 for [INSERT]/[DELETE]) and uses several zero-page pointers to operate on the screen and colour RAM:

- It first checks a zero-page insert count at $D8; if zero, it skips the insert path.
- For insert behavior, it jumps to $E697, which handles inserting a reversed character.
- If the current character equals #$14 ([INSERT]/[DELETE]), it continues to remove/close up the current line position:
  - It tests the Y register (TYA / BNE) and may JSR $E701 to move to the previous line when at column 0, or JSR $E8A1 to test for line decrement conditions.
  - It then shifts characters left across the line: using ($D1),Y to read/write screen RAM and ($F3),Y to read/write colour RAM while decrementing the index (DEY) to move bytes from the right to the left until reaching the current line length in $D5.
  - After shifting, it writes a SPACE (#$20) into the last position on the current screen line and writes the current colour (LDA $0286) to the corresponding colour RAM location.
- Control flow branches out at several points (not all targets shown in this chunk).

This chunk operates on zero-page pointers and system variables rather than VIC/SID/CIA hardware registers; it manipulates both screen memory (via a pointer in $D1) and colour RAM (via a pointer in $F3), and keeps track of cursor column ($D3), line length ($D5), and insert count ($D8).

## Source Code

```asm
        ; character was < [SPACE] so is a control character
        ; of some sort
.,E745  A6 D8    LDX $D8         ; get the insert count
.,E747  F0 03    BEQ $E74C       ; if no characters to insert continue
.,E749  4C 97 E6 JMP $E697       ; insert reversed character
.,E74C  C9 14    CMP #$14        ; compare the character with [INSERT]/[DELETE]
.,E74E  D0 2E    BNE $E77E       ; if not [INSERT]/[DELETE] go ??
.,E750  98       TYA
.,E751  D0 06    BNE $E759
.,E753  20 01 E7 JSR $E701       ; back onto the previous line if possible
.,E756  4C 73 E7 JMP $E773
.,E759  20 A1 E8 JSR $E8A1       ; test for line decrement
                                ; now close up the line
.,E75C  88       DEY             ; decrement index to previous character
.,E75D  84 D3    STY $D3         ; save the cursor column
.,E75F  20 24 EA JSR $EA24       ; calculate the pointer to colour RAM
.,E762  C8       INY             ; increment index to next character
.,E763  B1 D1    LDA ($D1),Y     ; get character from current screen line
.,E765  88       DEY             ; decrement index to previous character
.,E766  91 D1    STA ($D1),Y     ; save character to current screen line
.,E768  C8       INY             ; increment index to next character
.,E769  B1 F3    LDA ($F3),Y     ; get colour RAM byte
.,E76B  88       DEY             ; decrement index to previous character
.,E76C  91 F3    STA ($F3),Y     ; save colour RAM byte
.,E76E  C8       INY             ; increment index to next character
.,E76F  C4 D5    CPY $D5         ; compare with current screen line length
.,E771  D0 EF    BNE $E762       ; loop if not there yet
.,E773  A9 20    LDA #$20        ; set [SPACE]
.,E775  91 D1    STA ($D1),Y     ; clear last character on current screen line
.,E777  AD 86 02 LDA $0286       ; get the current colour code
.,E77A  91 F3    STA ($F3),Y     ; save to colour RAM
.,E77C  10 4D    BPL $E7CB       ; branch (positive) to further handling
.,E77E  A6 D4    LDX $D4         ; load quote mode flag
.,E780  F0 03    BEQ $E785       ; if not in quote mode, continue
.,E782  4C 97 E6 JMP $E697       ; insert reversed character
.,E785  C9 12    CMP #$12        ; compare with reverse on code
.,E787  D0 02    BNE $E78B       ; if not reverse on, continue
.,E789  85 C7    STA $C7         ; set reverse flag
.,E78B  C9 13    CMP #$13        ; compare with home code
.,E78D  D0 03    BNE $E792       ; if not home, continue
.,E78F  20 66 E5 JSR $E566       ; perform home function
.,E792  C9 1D    CMP #$1D        ; compare with cursor right code
.,E794  D0 17    BNE $E7AD       ; if not cursor right, continue
.,E796  C8       INY             ; increment Y (move cursor right)
.,E797  20 B3 E8 JSR $E8B3       ; check for end of line
.,E79A  84 D3    STY $D3         ; update cursor column
.,E79C  88       DEY             ; decrement Y
.,E79D  C4 D5    CPY $D5         ; compare with line length
.,E79F  90 09    BCC $E7AA       ; if not at end, continue
.,E7A1  C6 D6    DEC $D6         ; decrement row
.,E7A3  20 7C E8 JSR $E87C       ; scroll screen up
.,E7A6  A0 00    LDY #$00        ; reset Y
.,E7A8  84 D3    STY $D3         ; reset cursor column
.,E7AA  4C A8 E6 JMP $E6A8       ; return
.,E7AD  C9 11    CMP #$11        ; compare with cursor down code
.,E7AF  D0 1D    BNE $E7CE       ; if not cursor down, continue
.,E7B1  18       CLC             ; clear carry
.,E7B2  98       TYA             ; transfer Y to A
.,E7B3  69 28    ADC #$28        ; add 40 (next line)
.,E7B5  A8       TAY             ; transfer A to Y
.,E7B6  E6 D6    INC $D6         ; increment row
.,E7B8  C5 D5    CMP $D5         ; compare with line length
.,E7BA  90 EC    BCC $E7A8       ; if not at end, continue
.,E7BC  F0 EA    BEQ $E7A8       ; if at end, continue
.,E7BE  C6 D6    DEC $D6         ; decrement row
.,E7C0  E9 28    SBC #$28        ; subtract 40 (previous line)
.,E7C2  90 04    BCC $E7C8       ; if borrow, continue
.,E7C4  85 D3    STA $D3         ; update cursor column
.,E7C6  D0 F8    BNE $E7C0       ; if not zero, continue
.,E7C8  20 7C E8 JSR $E87C       ; scroll screen up
.,E7CB  4C A8 E6 JMP $E6A8       ; return
```

## Key Registers

- $D1 - Zero page pointer (used with Y: ($D1),Y) to access screen memory bytes for the current line
- $F3 - Zero page pointer (used with Y: ($F3),Y) to access colour RAM bytes for the current line
- $D3 - Zero page - saved cursor column (STY $D3)
- $D5 - Zero page - current screen line length (compared against Y)
- $D6 - Zero page - current row number
- $D8 - Zero page - insert count (LDX $D8)
- $D4 - Zero page - quote mode flag
- $C7 - Zero page - reverse flag
- $0286 - RAM - current colour code (LDA $0286)

## References

- "output_character_unshifted_and_control_dispatch" — expands on invoked when control character is insert/delete
- "advance_cursor_autoscroll_and_newline_handling" — expands on may call back to newline logic when moving across lines