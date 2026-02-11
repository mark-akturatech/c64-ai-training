# KERNAL ROM: Mode/Keyboard Mapping and CASE/LOCK Handler (ROM $EBFA–$EC75)

**Summary:** Contains MODE3 key-mapping tables (left-window graphics keymap), table terminators, and the CASE/LOCK keyboard-mode handler that toggles VIC-II character table via $D018 and sets/clears a keyboard lock byte at $0291. Searchable terms: $D018, $0291, VIC-II, MODE3, MODE table, MODE/LOCK, PET/KATAKANA.

**Mode tables and keyboard-mode handler (overview)**

This chunk holds:

- MODE3 mapping bytes (a left-window graphics keymap) with a terminating $FF byte.
- A small KERNAL keyboard-mode routine that:
  - Tests for a LOWER request (compare with #$0E), sets the VIC-II register $D018 bit $02 if so.
  - Tests for an UPPER request (compare with #$8E), clears VIC-II $D018 bit $02 if so.
  - Tests for LOCK/UNLOCK requests (compare with #$08 and #$09) and sets/clears a KERNAL RAM byte at $0291 (labelled MODE).
  - On mode changes, jumps to $E6A8 (exit back to main keyboard loop).
- Commented-out alternate tables (CCTTA3 etc.) that are present as comments in the ROM listing but not active bytes here.
- Notes in comments referencing PET/KATAKANA mode and additional mapping tables (LINZ, LDTB2), which are not included in this chunk.

Behavioral details preserved from the disassembly:

- The LOWER path loads $D018, ORAs #$02, then writes it back to $D018 — enabling the VIC character-pointer bit used to select the alternate (lowercase/PET) character set.
- The UPPER path ANDs $D018 with #$FD (i.e., clears bit $02) and writes that back to $D018 — selecting the UPPER/PET set.
- The LOCK path loads A with #$80 and ORAs it into $0291 (MODE), then branches on BMI to skip further unlock handling.
- The UNLOCK path loads A with #$7F and ANDs it with $0291 to clear the lock bit.
- The code uses immediate compares with the handler input byte values: #$0E (LOWER), #$8E (UPPER), #$08 (LOCK), #$09 (UNLOCK).
- All table data and the assembly listing are preserved in the Source Code section below.

## Source Code

```asm
; ROM addresses / byte-data and handler (disassembly excerpt)
.;EBFA 21 5F 04 22 A0 02 D1 83  .BYT   $21,$5F,$04,$22,$A0,$02,$D1,$83
.;EC02 FF                       .BYT   $FF             ;END OF TABLE NULL
;
; MODE3                  ;LEFT WINDOW GRAPHICS
; INS,C10,C12,C14,9,+,POUND SIGN,C8
.;EC03 94 8D 9D 8C 89 8A 8B 91  .BYT   $94,$8D,$9D,$8C,$89,$8A,$8B,$91
; RETURN,W,R,Y,I,P,*,LFT.ARROW
.;EC0B 96 B3 B0 97 AD AE B1 01  .BYT   $96,$B3,$B0,$97,$AD,$AE,$B1,$01
; LF.CRSR,A,D,G,J,L,;,CTRL
.;EC13 98 B2 AC 99 BC BB A3 BD  .BYT   $98,$B2,$AC,$99,$BC,$BB,$A3,$BD
; F8,C11,C13,C15,0,-,HOME,C9
.;EC1B 9A B7 A5 9B BF B4 B8 BE  .BYT   $9A,$B7,$A5,$9B,$BF,$B4,$B8,$BE
; F2,Z,C,B,M,.,R.SHIFT,SPACE
.;EC23 29 A2 B5 30 A7 A1 B9 AA  .BYT   $29,$A2,$B5,$30,$A7,$A1,$B9,$AA
; F4,S,F,H,K,:,=,COM.KEY
.;EC2B A6 AF B6 DC 3E 5B A4 3C  .BYT   $A6,$AF,$B6,$DC,$3E,$5B,$A4,$3C
; F6,E,T,U,O,@,PI,Q
.;EC33 A8 DF 5D 93 01 3D DE 3F  .BYT   $A8,$DF,$5D,$93,$01,$3D,$DE,$3F
; CRSR.UP,L.SHIFT,X,V,N,,,/,STOP
.;EC3B 81 5F 04 95 A0 02 AB 83  .BYT   $81,$5F,$04,$95,$A0,$02,$AB,$83
.;EC43 FF                       .BYT   $FF             ;END OF TABLE NULL
; CCTTA2 ;WAS CCTTA2 IN JAPANESE VERSION
; LOWER
.,EC44 C9 0E    CMP #$0E               CMP #$0E        ;DOES HE WANT LOWER CASE?
.,EC46 D0 07    BNE $EC4F              BNE UPPER       ;BRANCH IF NOT
.,EC48 AD 18 D0 LDA $D018              LDA VICREG+24   ;ELSE SET VIC TO POINT TO LOWER CASE
.,EC4B 09 02    ORA #$02               ORA #$02
.,EC4D D0 09    BNE $EC58              BNE ULSET       ;JMP
; UPPER
.,EC4F C9 8E    CMP #$8E               CMP #$8E        ;DOES HE WANT UPPER CASE
.,EC51 D0 0B    BNE $EC5E              BNE LOCK        ;BRANCH IF NOT
.,EC53 AD 18 D0 LDA $D018              LDA VICREG+24   ;MAKE SURE VIC POINT TO UPPER/PET SET
.,EC56 29 FD    AND #$FD               AND #$FF-$02
.,EC58 8D 18 D0 STA $D018       ULSET  STA VICREG+24
.,EC5B 4C A8 E6 JMP $E6A8       OUTHRE JMP LOOP2
; LOCK
.,EC5E C9 08    CMP #$08               CMP #8          ;DOES HE WANT TO LOCK IN THIS MODE?
.,EC60 D0 07    BNE $EC69              BNE UNLOCK      ;BRANCH IF NOT
.,EC62 A9 80    LDA #$80               LDA #$80        ;ELSE SET LOCK SWITCH ON
.,EC64 0D 91 02 ORA $0291              ORA MODE        ;DON'T HURT ANYTHING - JUST IN CASE
.,EC67 30 09    BMI $EC72              BMI LEXIT
; UNLOCK
.,EC69 C9 09    CMP #$09               CMP #9          ;DOES HE WANT TO UNLOCK THE KEYBOARD?
.,EC6B D0 EE    BNE $EC5B              BNE OUTHRE      ;BRANCH IF NOT
.,EC6D A9 7F    LDA #$7F               LDA #$7F        ;CLEAR THE LOCK SWITCH
.,EC6F 2D 91 02 AND $0291              AND MODE        ;DONT HURT ANYTHING
.,EC72 8D 91 02 STA $0291       LEXIT  STA MODE
.,EC75 4C A8 E6 JMP $E6A8              JMP LOOP2       ;GET OUT
; CCTTA3
; .BYT $04,$FF,$FF,$FF,$FF,$FF,$E2,$9D
; RUN-K24-K31
; .BYT $83,$01,$FF,$FF,$FF,$FF,$FF,$91
; K32-K39.F5
; .BYT $A0,$FF,$FF,$FF,$FF,$EE,$01,$89
; CO.KEY,K40-K47.F6
; .BYT $02,$FF,$FF,$FF,$FF,$E1,$FD,$8A
; K48-K55
; .BYT $FF,$FF,$FF,$FF,$FF,$B0,$E0,$8B
; K56-K63
; .BYT $F2,$F4,$F6,$FF,$F0,$ED,$93,$8C
```

## Key Registers

- $D018 - VIC-II - control register (VIC register used to select character/bitmap memory; here bit $02 toggled to select alternate character set for LOWER/UPPER)
- $0291 - KERNAL RAM - MODE/lock byte used by the keyboard handler; ORA #$80 sets lock, AND #$7F clears it

## Labels
- D018
- MODE
