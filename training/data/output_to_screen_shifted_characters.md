# KERNAL CHROUT (shifted characters) $E7D4..$E874

**Summary:** KERNAL CHROUT handler for shifted characters and shifted control keys ($E7D4..$E874). Handles shifted ASCII/PET graphics, shifted RETURN/INST/CRSR UP/RVS OFF/CRSR LEFT/CLR, insert-mode insertion (open space + move chars and colour bytes), colour synchronisation and final colour/graphics-mode setup (JSR $E8CB / JMP $EC4F).

## Shifted-character handling (behavior and flow)
This routine processes characters received in the “shifted” state. The checks are performed in this order: shifted ordinary ASCII and PET graphics, <shift RETURN>, <INST>, <CRSR UP>, <RVS OFF>, <CRSR LEFT>, <CLR>. If insert mode is on, or quotes (QTSW) are set, control characters are not executed; instead the character is printed as a reversed ASCII literal.

Main flow (branch targets and effects):
- $E7D4..$E7DC: Clear bit 7 (AND #$7F) and compare to #$7F; a special-case load (#$5E) occurs when matched.
- Space (ASCII #$20): branch to screen-print setup (JMP $E691).
- Shifted RETURN (CMP #$0D): branch to return handler (JMP $E891).
- Quotes check (LDX $D4; BNE $E82D): if quotes mode (QTSW set), skip control processing and treat character literally.
- <INST> (CMP #$14 at $E7EE):
  - Verify insertion possible: compare LNMX ($D5) against PNTR ($D3) and check end-of-logical-line (CPY #$4F).
  - If at end or insertion impossible, skip insertion.
  - If insertion allowed:
    - JSR $E965 — open space on the line.
    - JSR $EA24 — synchronise colour pointer.
    - Loop ($E80A..$E819) to move characters right by one position:
      - Read character via ($D1),Y and re-store one position right (STA ($D1),Y).
      - Move corresponding colour bytes via ($F3),Y.
    - Store a space (#$20) into new cursor position and store the current colour (LDA $0286; STA ($F3),Y).
    - INC $D8 (INSRT FLAG).
    - JMP $E6A8 to finish screen print.
- If <INST> was requested but insert flag ($D8) is set, set bit ORA #$40 and go to normal screen-print setup (JMP $E697).
- <CRSR UP> (CMP #$11):
  - Read TBLX ($D6). If at topline (TBLX==0) do nothing.
  - Else DEC $D6 and subtract $28 (40 decimal) from PNTR ($D3) to move pointer up one logical line; update PNTR and, if necessary, call set screen pointer (JSR $E56C).
- <RVS OFF> (CMP #$12): clear reverse flag ($C7 = 0).
- <CRSR LEFT> (CMP #$1D):
  - Use Y (cursor column). If zero, JSR $E8A1 (check line decrement), otherwise DEY, STY $D3 and finish.
  - If at first position, JSR $E701 to go to previous line.
- <CLR> (CMP #$13): JSR $E544 (clear screen).
- End of shifted routine ($E874..$E879):
  - ORA #$80 then JSR $E8CB (set colour code).
  - JMP $EC4F (set graphics/text mode and return to common exit).

Behavioral notes preserved from source:
- Insert operation not only shifts screen characters but also shifts associated colour bytes; colour pointer synchronisation occurs before the move.
- Insertion is blocked when cursor is at the logical line end (#$4F / 79).
- Control-key actions are suppressed when quotes mode ($D4) is set; the character is output literally.
- Reverse-printing is controlled by $C7 (RVS) and can be explicitly cleared by <RVS OFF>.
- Cursor movement manipulates PNTR ($D3) and uses TBLX ($D6) for topline checks; moving up subtracts 40 columns (decimal) from PNTR.

## Source Code
```asm
.,E7D4 29 7F    AND #$7F
.,E7D6 C9 7F    CMP #$7F
.,E7D8 D0 02    BNE $E7DC
.,E7DA A9 5E    LDA #$5E
.,E7DC C9 20    CMP #$20
.,E7DE 90 03    BCC $E7E3
.,E7E0 4C 91 E6 JMP $E691
.,E7E3 C9 0D    CMP #$0D
.,E7E5 D0 03    BNE $E7EA
.,E7E7 4C 91 E8 JMP $E891
.,E7EA A6 D4    LDX $D4
.,E7EC D0 3F    BNE $E82D
.,E7EE C9 14    CMP #$14
.,E7F0 D0 37    BNE $E829
.,E7F2 A4 D5    LDY $D5
.,E7F4 B1 D1    LDA ($D1),Y
.,E7F6 C9 20    CMP #$20
.,E7F8 D0 04    BNE $E7FE
.,E7FA C4 D3    CPY $D3
.,E7FC D0 07    BNE $E805
.,E7FE C0 4F    CPY #$4F
.,E800 F0 24    BEQ $E826
.,E802 20 65 E9 JSR $E965
.,E805 A4 D5    LDY $D5
.,E807 20 24 EA JSR $EA24
.,E80A 88       DEY
.,E80B B1 D1    LDA ($D1),Y
.,E80D C8       INY
.,E80E 91 D1    STA ($D1),Y
.,E810 88       DEY
.,E811 B1 F3    LDA ($F3),Y
.,E813 C8       INY
.,E814 91 F3    STA ($F3),Y
.,E816 88       DEY
.,E817 C4 D3    CPY $D3
.,E819 D0 EF    BNE $E80A
.,E81B A9 20    LDA #$20
.,E81D 91 D1    STA ($D1),Y
.,E81F AD 86 02 LDA $0286
.,E822 91 F3    STA ($F3),Y
.,E824 E6 D8    INC $D8
.,E826 4C A8 E6 JMP $E6A8
.,E829 A6 D8    LDX $D8
.,E82B F0 05    BEQ $E832
.,E82D 09 40    ORA #$40
.,E82F 4C 97 E6 JMP $E697
.,E832 C9 11    CMP #$11
.,E834 D0 16    BNE $E84C
.,E836 A6 D6    LDX $D6
.,E838 F0 37    BEQ $E871
.,E83A C6 D6    DEC $D6
.,E83C A5 D3    LDA $D3
.,E83E 38       SEC
.,E83F E9 28    SBC #$28
.,E841 90 04    BCC $E847
.,E843 85 D3    STA $D3
.,E845 10 2A    BPL $E871
.,E847 20 6C E5 JSR $E56C
.,E84A D0 25    BNE $E871
.,E84C C9 12    CMP #$12
.,E84E D0 04    BNE $E854
.,E850 A9 00    LDA #$00
.,E852 85 C7    STA $C7
.,E854 C9 1D    CMP #$1D
.,E856 D0 12    BNE $E86A
.,E858 98       TYA
.,E859 F0 09    BEQ $E864
.,E85B 20 A1 E8 JSR $E8A1
.,E85E 88       DEY
.,E85F 84 D3    STY $D3
.,E861 4C A8 E6 JMP $E6A8
.,E864 20 01 E7 JSR $E701
.,E867 4C A8 E6 JMP $E6A8
.,E86A C9 13    CMP #$13
.,E86C D0 06    BNE $E874
.,E86E 20 44 E5 JSR $E544
.,E871 4C A8 E6 JMP $E6A8
.,E874 09 80    ORA #$80
.,E876 20 CB E8 JSR $E8CB
.,E879 4C 4F EC JMP $EC4F
```

## Key Registers
- $D1 - KERNAL variable - indirect pointer to current screen character buffer (used as ($D1),Y)
- $D3 - KERNAL variable - PNTR (current cursor pointer / character index)
- $D4 - KERNAL variable - QTSW (quotes switch, if set suppresses control processing)
- $D5 - KERNAL variable - LNMX (line index within logical line)
- $D6 - KERNAL variable - TBLX (topline index used for CRSR UP checks)
- $D8 - KERNAL variable - INSRT FLAG (insert-mode flag; incremented on insertion)
- $C7 - KERNAL variable - RVS (reverse-print flag; cleared by RVS OFF)
- $F3 - KERNAL variable - colour pointer (used as ($F3),Y)
- $0286 - RAM - current character colour byte (loaded/stored during insert)

## References
- "output_to_screen_unshifted_and_control_codes" — expands on the unshifted output path (counterpart to this shifted branch) and shared helpers like set colour / graphics/text routines
- "setup_screen_print" — expands on the common screen-print setup used when shifted characters are displayed as reversed/insertion output
- "advance_cursor" — expands on cursor movement, wrapping and line pointer arithmetic relied upon by the shifted-character operations

## Labels
- PNTR
- QTSW
- LNMX
- TBLX
- INSRT
- RVS
