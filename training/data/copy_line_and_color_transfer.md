# SCRLIN / TOFROM / SETPNT / CLRLN / CLR10 — KERNAL scroll/new-line routines ($E96F–$E9D6)

**Summary:** KERNAL routines used to generate a new line, scroll/insert lines, copy a text line from SAL to the PNT buffer, transfer color bytes from EAL to the user color area, and set PNT/PNT+1 from LDTB2/LDTB1 table entries. Searchable terms: $E96F, SCRLIN, TOFROM, SETPNT, CLRLN, SAL/SAH, EAL/EAH, LDTB1/LDTB2, LINTMP ($02A5), LLEN.

## Operation overview
This chunk implements new-line generation and per-line scrolling/copying used by the KERNAL text routines:

- Top-level decision (at $E96F) checks X against NLINES-1 to decide whether to clear the last line (NEWLX) or insert/scroll lines (JSR SCROL).
- When inserting, current SAL/SAH (source address low/high) and EAL/EAH (color source low/high) are pushed; SETPNT is called to initialize PNT (destination pointer) before per-line work.
- For each line to move/insert, table entries from LDTB2/LDTB1 (one byte and one attribute/continuation byte) are read (LDA LDTB2-1,X / LDA LDTB1-1,X) and SCRLIN is invoked to copy the character bytes from (SAL) to (PNT) and transfer color bytes via TOFROM.
- The SCRLIN routine:
  - Cleans low bits (AND #$03) and ORAs in high-order bits from $0288 (HIBASE) to produce SAL+1,
  - Calls TOFROM to move color bytes (EAL/EAH ↔ user color area),
  - Uses Y-indexed indirect loads/stores (LDA (SAL),Y / STA (PNT),Y) over LLEN-1 bytes (LDY #$27) to copy the character bytes of the line.
- When insertion is finished CLRLN is called to clear the new/last line (JSR $E9FF).
- The code uses LINTMP ($02A5) as a loop limit / comparison (CPX $02A5) and uses LDTB1/LDTB2 table bytes to set PNT & continuation flags for subsequent processing.

(Parentheticals: SAL/SAH = source address pointer; PNT = destination pointer; EAL/EAH = color source pointer — zero page variables used by KERNAL routines.)

## Source Code
```asm
                                ;GENERATE A NEW LINE
.,E96F E0 18    CPX #$18        CPX    #NLINES-1       ;IS ONE LINE FROM BOTTOM?
.,E971 F0 0E    BEQ $E981       BEQ    NEWLX           ;YES...JUST CLEAR LAST
.,E973 90 0C    BCC $E981       BCC    NEWLX           ;<NLINES...INSERT LINE
.,E975 20 EA E8 JSR $E8EA              JSR SCROL       ;SCROLL EVERYTHING
.,E978 AE A5 02 LDX $02A5              LDX LINTMP
.,E97B CA       DEX                    DEX
.,E97C C6 D6    DEC $D6                DEC TBLX
.,E97E 4C DA E6 JMP $E6DA              JMP WLOG30
.,E981 A5 AC    LDA $AC         NEWLX  LDA SAL
.,E983 48       PHA             PHA
.,E984 A5 AD    LDA $AD         LDA    SAH
.,E986 48       PHA             PHA
.,E987 A5 AE    LDA $AE         LDA    EAL
.,E989 48       PHA             PHA
.,E98A A5 AF    LDA $AF         LDA    EAH
.,E98C 48       PHA             PHA
.,E98D A2 19    LDX #$19               LDX #NLINES
.,E98F CA       DEX             SCD10  DEX
.,E990 20 F0 E9 JSR $E9F0              JSR SETPNT      ;SET UP TO ADDR
.,E993 EC A5 02 CPX $02A5              CPX LINTMP
.,E996 90 0E    BCC $E9A6              BCC SCR40
.,E998 F0 0C    BEQ $E9A6              BEQ SCR40       ;BRANCH IF FINISHED
.,E99A BD EF EC LDA $ECEF,X            LDA LDTB2-1,X   ;SET FROM ADDR
.,E99D 85 AC    STA $AC                STA SAL
.,E99F B5 D8    LDA $D8,X              LDA LDTB1-1,X
.,E9A1 20 C8 E9 JSR $E9C8              JSR SCRLIN      ;SCROLL THIS LINE DOWN
.,E9A4 30 E9    BMI $E98F              BMI SCD10
                                SCR40
.,E9A6 20 FF E9 JSR $E9FF              JSR CLRLN
.,E9A9 A2 17    LDX #$17               LDX #NLINES-2
                                SCRD21
.,E9AB EC A5 02 CPX $02A5              CPX LINTMP      ;DONE?
.,E9AE 90 0F    BCC $E9BF              BCC SCRD22      ;BRANCH IF SO
.,E9B0 B5 DA    LDA $DA,X              LDA LDTB1+1,X
.,E9B2 29 7F    AND #$7F               AND #$7F
.,E9B4 B4 D9    LDY $D9,X              LDY LDTB1,X     ;WAS IT CONTINUED
.,E9B6 10 02    BPL $E9BA              BPL SCRD19      ;BRANCH IF SO
.,E9B8 09 80    ORA #$80               ORA #$80
.,E9BA 95 DA    STA $DA,X       SCRD19 STA LDTB1+1,X
.,E9BC CA       DEX                    DEX
.,E9BD D0 EC    BNE $E9AB              BNE SCRD21
                                SCRD22
.,E9BF AE A5 02 LDX $02A5              LDX LINTMP
.,E9C2 20 DA E6 JSR $E6DA              JSR WLOG30
                                ;
.,E9C5 4C 58 E9 JMP $E958              JMP PULIND      ;GO PUL OLD INDIRECTS AND RETURN
                                ;
                                ; SCROLL LINE FROM SAL TO PNT
                                ; AND COLORS FROM EAL TO USER
                                ;
                                SCRLIN
.,E9C8 29 03    AND #$03               AND #$03        ;CLEAR ANY GARBAGE STUFF
.,E9CA 0D 88 02 ORA $0288              ORA HIBASE      ;PUT IN HIORDER BITS
.,E9CD 85 AD    STA $AD                STA SAL+1
.,E9CF 20 E0 E9 JSR $E9E0              JSR TOFROM      ;COLOR TO & FROM ADDRS
.,E9D2 A0 27    LDY #$27               LDY #LLEN-1
                                SCD20
.,E9D4 B1 AC    LDA ($AC),Y            LDA (SAL)Y
.,E9D6 91 D1    STA ($D1),Y            STA (PNT)Y
```

## References
- "scroll_routines_and_newline_generation" — expands on SCRLIN and TOFROM invoked during scroll/newline operations

## Labels
- SCRLIN
- TOFROM
- SETPNT
- CLRLN
- SAL
- SAH
- PNT
- LLEN
