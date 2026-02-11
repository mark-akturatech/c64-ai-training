# KERNAL PRT/PRINT routine internals ($E76B-$E7D8)

**Summary:** Disassembly of KERNAL PRINT/PRT inner loop at $E76B-$E7D8, showing register saves/loads, character processing (space insertion, case mapping), checks against control codes ($11,$12,$13,$1D), calls to NXTD/NXLN/CHKCOL/CHKDWN/LOWER, and use of KERNAL variables QTSW/LNMX/TBLX/PNTR/USER. Searchable symbols: QTSW, NXTD, CHKCOL, CHKDWN, NXLN, LOWER, RVS, COLOR.

## Description
This chunk is a straight disassembly fragment from the KERNAL PRINT handler. It walks through the code paths performed as characters are placed into the screen/user buffer and how special control codes are handled:

- The routine updates Y (DEY/INY) and stores using indirect-indexed STA (USER),Y and STA (PNT),Y to write character and pointer targets.
- It writes a space (LDA #$20) into the (PNT)Y destination when appropriate.
- The value at absolute $0286 (labelled COLOR in the listing) is loaded and stored into (USER),Y to propagate a color value alongside the character.
- The code checks the sign of the last result (BPL to JPL3/loop) and inspects the KERNAL flag QTSW (LDX $D4) to decide whether to jump to a non-print path (NC3 / JMP $E697).
- It compares the character/control byte against several immediate constants: $12, $13, $1D, $11. Each match directs flow into special handling:
  - CMP #$12 then STA $C7 (RVS) — set reverse-video flag.
  - CMP #$13 then JSR NXTD — execute next-line/carriage behavior.
  - CMP #$1D then various pointer/line-index arithmetic and JSR NXLN (GOTDWN path).
  - CMP #$11 triggers color handling path via JSR CHKCOL.
- Cursor and pointer bookkeeping: INY/DEY plus CPY $D5 (LNMX) and adjustments to $D6 (TBLX) and $D3 (PNTR). There are branches to maintain cursor within line length (LLEN) and to call NXLN when moving down a line.
- Calls invoked:
  - JSR NXTD ($E566) — labeled NXTD in listing.
  - JSR CHKDWN ($E8B3) — checks or handles downward movement.
  - JSR NXLN ($E87C) — next-line handling.
  - JSR CHKCOL ($E8CB) — check for a color control sequence.
  - JMP LOWER ($EC44) — transfer to lowercase-mapping path (commented "WAS JMP LOOP2").
- After color checking the code reaches a path labeled LOWER that handles shifted keys / case mapping: it masks the high bit (AND #$7F) and compares against $7F to branch accordingly.

The fragment contains inline comments from the original disassembly (e.g., RVS, LNMX, JPL3, GOTDWN) and reveals how the ROM mixes buffer writes, color propagation, control-code detection, and cursor bookkeeping before delegating to other KERNAL subroutines for display updates and editor actions.

## Source Code
```asm
.,E76B 88       DEY             DEY
.,E76C 91 F3    STA ($F3),Y     STA    (USER)Y
.,E76E C8       INY             INY
.,E76F C4 D5    CPY $D5         CPY    LNMX
.,E771 D0 EF    BNE $E762       BNE    BK15
.,E773 A9 20    LDA #$20        BK2    LDA #' 
.,E775 91 D1    STA ($D1),Y     STA    (PNT)Y
.,E777 AD 86 02 LDA $0286       LDA    COLOR
.,E77A 91 F3    STA ($F3),Y     STA    (USER)Y
.,E77C 10 4D    BPL $E7CB       BPL    JPL3
.,E77E A6 D4    LDX $D4         NTCN1  LDX QTSW
.,E780 F0 03    BEQ $E785       BEQ    NC3W
.,E782 4C 97 E6 JMP $E697       CNC3   JMP NC3
.,E785 C9 12    CMP #$12        NC3W   CMP #$12
.,E787 D0 02    BNE $E78B       BNE    NC1
.,E789 85 C7    STA $C7         STA    RVS
.,E78B C9 13    CMP #$13        NC1    CMP #$13
.,E78D D0 03    BNE $E792       BNE    NC2
.,E78F 20 66 E5 JSR $E566       JSR    NXTD
.,E792 C9 1D    CMP #$1D        NC2    CMP #$1D
.,E794 D0 17    BNE $E7AD       BNE    NCX2
.,E796 C8       INY             INY
.,E797 20 B3 E8 JSR $E8B3              JSR CHKDWN
.,E79A 84 D3    STY $D3         STY    PNTR
.,E79C 88       DEY             DEY
.,E79D C4 D5    CPY $D5         CPY    LNMX
.,E79F 90 09    BCC $E7AA       BCC    NCZ2
.,E7A1 C6 D6    DEC $D6                DEC TBLX
.,E7A3 20 7C E8 JSR $E87C       JSR    NXLN
.,E7A6 A0 00    LDY #$00        LDY    #0
.,E7A8 84 D3    STY $D3         JPL4   STY PNTR
.,E7AA 4C A8 E6 JMP $E6A8       NCZ2   JMP LOOP2
.,E7AD C9 11    CMP #$11        NCX2   CMP #$11
.,E7AF D0 1D    BNE $E7CE       BNE    COLR1
.,E7B1 18       CLC             CLC
.,E7B2 98       TYA             TYA
.,E7B3 69 28    ADC #$28        ADC    #LLEN
.,E7B5 A8       TAY             TAY
.,E7B6 E6 D6    INC $D6                INC TBLX
.,E7B8 C5 D5    CMP $D5         CMP    LNMX
.,E7BA 90 EC    BCC $E7A8       BCC    JPL4
.,E7BC F0 EA    BEQ $E7A8       BEQ    JPL4
.,E7BE C6 D6    DEC $D6                DEC TBLX
.,E7C0 E9 28    SBC #$28        CURS10 SBC #LLEN
.,E7C2 90 04    BCC $E7C8              BCC GOTDWN
.,E7C4 85 D3    STA $D3                STA PNTR
.,E7C6 D0 F8    BNE $E7C0              BNE CURS10
.,E7C8 20 7C E8 JSR $E87C       GOTDWN JSR NXLN
.,E7CB 4C A8 E6 JMP $E6A8       JPL3   JMP LOOP2
.,E7CE 20 CB E8 JSR $E8CB       COLR1  JSR CHKCOL      ;CHECK FOR A COLOR
.,E7D1 4C 44 EC JMP $EC44              JMP LOWER       ;WAS JMP LOOP2
                                ;CHECK COLOR
                                ;
                                ;SHIFTED KEYS
                                ;
                                NXTX
                                KEEPIT
.,E7D4 29 7F    AND #$7F        AND    #$7F
.,E7D6 C9 7F    CMP #$7F        CMP    #$7F
.,E7D8 D0 02    BNE $E7DC       BNE    NXTX1
```

## References
- "cursor_movement_and_editing_operations" — expands on called routines (NXTD, NXLN, CHKDWN) and how characters are rendered as the user types

## Labels
- QTSW
- RVS
- LNMX
- TBLX
- PNTR
- COLOR
- USER
