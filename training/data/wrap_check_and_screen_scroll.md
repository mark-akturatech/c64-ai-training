# KERNAL Editor (WLOG30 cont.): DWNCHK / DNLINE / CHKCOL / SCROL (screen scroll) routines

**Summary:** Disassembly of Commodore 64 Editor routines for downward-line checking (DWNCHK/DNLINE), color lookup (CHKCOL / COLTAB), and screen-scroll-up (SCROL). Shows use of editor variables TBLX ($D6), PNTR ($D3), saved pointer bytes SAL/SAH/EAL/EAH ($AC-$AF), LDTB1/LDTB2 pointers, and the COLOR slot at $0286.

## Overview
This chunk contains a continuation of the editor KERNAL routines that:

- DWNCHK: compares a pointer (PNTR at $D3) against a constant (LLEN-1/#$27) and, if not equal, adjusts an X counter by LLEN/#$28 in a tight loop to search/count; branches to DNLINE on match.
- DNLINE: increments the logical table index TBLX ($D6) unless it has reached NLINES (#$19), then returns.
- CHKCOL: scans a 15-entry color table (COLTAB) to find a match to the value at the table entry pointer $E8DA+X; on hit it stores the matching index into $0286 (COLOR).
- SCROL: a "scroll up" routine that preserves the current text pointer bytes (SAL/SAH/EAL/EAH at $AC-$AF) on the stack, decrements editor indices (TBLX at $D6, LSXP at $C9, LINTMP at $02A5), calls SETPNT to point to the next physical line, checks for completion (compares X to #$18), and for each line moves pointer data (LDTB2+1,X -> SAL, LDTB1+1,X -> $DA,X) then calls SCRLIN to move the line up. Looping continues while SCRLIN signals continuation (BMI branch back).

The code references LDTB1 and LDTB2 tables (LDTB2+1 is accessed from ROM at $ECF1 in the listing), and uses local editor variables to coordinate pointer updates during the scroll.

## DWNCHK / DNLINE behavior
- Entry (DWNCHK): loads X with #$27 (LLEN-1), compares with byte at $D3 (PNTR). If equal, branch to DNLINE. Otherwise:
  - Clear carry, add #$28 (LLEN) to A, decrement X, and loop until X becomes zero or match is found.
  - Returns (RTS) if loop falls through.
- DNLINE: loads TBLX (LDX $D6) and compares to #$19 (NLINES). If equal, returns; otherwise increments TBLX and returns. This ensures TBLX doesn't exceed room for the line table.

## CHKCOL / COLTAB
- CHKCOL loads X with #$0F (15 entries) and repeatedly compares the byte at COLTAB+X against the value at $E8DA+X (value being checked). If any comparison matches, it stores X into $0286 (label COLOR in the listing) via STX $0286, then returns.
- COLTAB is an array of 15+8 = 23 bytes in the listing (two .BYT lines). The first 8 bytes are the main 8-color mapping (comments: BLK,WHT,RED,CYAN,MAGENTA,GRN,BLUE,YELLOW); the remainder appear to map supplemental color codes used by the editor.

## SCROL (screen scroll up)
- SCROL preserves SAL/SAH/EAL/EAH (editor saved pointer bytes at $AC-$AF) on the stack.
- Sets X = #$FF and then:
  - DEC $D6 (TBLX) — move table index up one entry
  - DEC $C9 (LSXP) — editor scratch/index
  - DEC $02A5 (LINTMP) — temporary line counter
  - INX — increment X to form an index used for table accesses
  - JSR SETPNT — recompute PNT to point to the new 'to' line (SETPNT is expected to use X)
  - CPX #$18 and BCS to finish if done (X >= $18)
  - LDA $ECF1,X (LDTB2+1,X) -> STA $AC (SAL) — fetch pointer bytes from LDTB2
  - LDA $DA,X (LDTB1+1,X) -> passed as parameter to SCRLIN — fetch LDTB1 byte(s)
  - JSR SCRLIN — perform the per-line scroll-up operation
  - BMI loop back (branch if SCRLIN set negative result flag), repeating for subsequent lines until complete

Notes:
- The routine relies on table lookups in LDTB1/LDTB2 (LDTB2+1 is addressed in ROM at $ECF1 in this listing), and expects SETPNT to set pointer registers correctly for SCRLIN to use.
- The save/restore of SAL..EAH via the stack preserves the current pointer across the scroll operation.

## Source Code
```asm
.,E8B5 A9 27    LDA #$27               LDA #LLEN-1
.,E8B7 C5 D3    CMP $D3         DWNCHK CMP PNTR
.,E8B9 F0 07    BEQ $E8C2              BEQ DNLINE
.,E8BB 18       CLC                    CLC
.,E8BC 69 28    ADC #$28               ADC #LLEN
.,E8BE CA       DEX                    DEX
.,E8BF D0 F6    BNE $E8B7              BNE DWNCHK
.,E8C1 60       RTS                    RTS
                                ;
.,E8C2 A6 D6    LDX $D6         DNLINE LDX TBLX
.,E8C4 E0 19    CPX #$19               CPX #NLINES
.,E8C6 F0 02    BEQ $E8CA              BEQ DWNBYE
.,E8C8 E6 D6    INC $D6                INC TBLX
                                ;
.,E8CA 60       RTS             DWNBYE RTS
                                CHKCOL
.,E8CB A2 0F    LDX #$0F               LDX #15         ;THERE'S 15 COLORS
.,E8CD DD DA E8 CMP $E8DA,X     CHK1A  CMP COLTAB,X
.,E8D0 F0 04    BEQ $E8D6              BEQ CHK1B
.,E8D2 CA       DEX                    DEX
.,E8D3 10 F8    BPL $E8CD              BPL CHK1A
.,E8D5 60       RTS                    RTS
                                ;
                                CHK1B
.,E8D6 8E 86 02 STX $0286              STX COLOR       ;CHANGE THE COLOR
.,E8D9 60       RTS                    RTS
                                COLTAB
                                ;BLK,WHT,RED,CYAN,MAGENTA,GRN,BLUE,YELLOW
.:E8DA 90 05 1C 9F 9C 1E 1F 9E  .BYT   $90,$05,$1C,$9F,$9C,$1E,$1F,$9E
.:E8E2 81 95 96 97 98 99 9A 9B  .BYT   $81,$95,$96,$97,$98,$99,$9A,$9B
                                .END
                                ;.LIB CONKAT (JAPAN CONVERSION TABLES)
                                .LIB   EDITOR.2
                                ;SCREEN SCROLL ROUTINE
                                ;
.,E8EA A5 AC    LDA $AC         SCROL  LDA SAL
.,E8EC 48       PHA             PHA
.,E8ED A5 AD    LDA $AD         LDA    SAH
.,E8EF 48       PHA             PHA
.,E8F0 A5 AE    LDA $AE         LDA    EAL
.,E8F2 48       PHA             PHA
.,E8F3 A5 AF    LDA $AF         LDA    EAH
.,E8F5 48       PHA             PHA
                                ;
                                ;   S C R O L L   U P
                                ;
.,E8F6 A2 FF    LDX #$FF        SCRO0  LDX #$FF
.,E8F8 C6 D6    DEC $D6                DEC TBLX
.,E8FA C6 C9    DEC $C9                DEC LSXP
.,E8FC CE A5 02 DEC $02A5              DEC LINTMP
.,E8FF E8       INX             SCR10  INX             ;GOTO NEXT LINE
.,E900 20 F0 E9 JSR $E9F0              JSR SETPNT      ;POINT TO 'TO' LINE
.,E903 E0 18    CPX #$18               CPX #NLINES-1   ;DONE?
.,E905 B0 0C    BCS $E913              BCS SCR41       ;BRANCH IF SO
                                ;
.,E907 BD F1 EC LDA $ECF1,X            LDA LDTB2+1,X   ;SETUP FROM PNTR
.,E90A 85 AC    STA $AC                STA SAL
.,E90C B5 DA    LDA $DA,X              LDA LDTB1+1,X
.,E90E 20 C8 E9 JSR $E9C8              JSR SCRLIN      ;SCROLL THIS LINE UP1
.,E911 30 EC    BMI $E8FF              BMI SCR10
```

## Key Registers
- $AC-$AF - RAM - SAL, SAH, EAL, EAH (saved pointer bytes used during scroll/save)
- $D3 - RAM - PNTR (compared in DWNCHK)
- $D6 - RAM - TBLX (table index for current logical line)
- $C9 - RAM - LSXP (editor index adjusted during scroll)
- $02A5 - RAM - LINTMP (temporary line counter used in SCROL)
- $0286 - RAM - COLOR (editor color slot written by CHKCOL)
- $ECF1 - ROM - base LDTB2+1 (LDTB2 table referenced via LDA $ECF1,X)

## References
- "line_wrap_and_newline_handling" — expands on FINDST and SETPNT mapping logical to physical addresses and pointer correctness

## Labels
- SAL
- SAH
- EAL
- EAH
- PNTR
- TBLX
- LSXP
- COLOR
