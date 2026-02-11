# KERNAL: SCR41 / SCROLL / NEWLIN — screen line scroll and new-line insertion routines

**Summary:** Disassembly of Commodore 64 KERNAL routines (addresses shown) implementing vertical scrolling and new-line insertion. Covers manipulation of the LDTB1 line-pointer table ($D9/$DA/$F1), save/restore of indirect address bytes ($AC-$AF), interaction with CIA1 ports ($DC00/$DC01) for key/slow-scroll checks, and LINTMP/TBLX bookkeeping ($02A5/$D6).

## Description
This chunk documents the KERNAL code paths that scroll screen lines up/down and create a new blank line when inserting or wrapping text. The routines:

- Call CLRLN to clear a line (JSR $E9FF / label SCR41).
- Iterate the line-pointer table LDTB1 (zero page $D9,$DA and the last-line entry at $F1) to update high/low pointer bytes across NLINES-1 entries.
  - Each entry is loaded (LDA $D9,X / LDY $DA,X), masked with AND #$7F, conditionally ORA #$80, then stored back (STA $D9,X).
  - The loop advances using TBLX ($D6) as index and compares with NLINES-1 (CPX #$18 in this listing).
- After altering the table, set the terminal table entry (LDTB1+NLINES-1 at $F1) with bit 7 set (ORA #$80 / STA $F1).
- Detect whether another scroll is required by testing the sign of the first table entry (BPL branching to SCRO0 if set).
- Maintain bookkeeping counters TBLX ($D6) and LINTMP ($02A5), incrementing them when a scroll occurred.
- Implement a slow-scroll (control-key) delay loop that manipulates CIA1 port registers to check the Stop/Control key and to gate the delay.
  - Uses STA $DC00 and LDA $DC01 as shown.
- Restore previously saved indirect address bytes (SAL/SAH/EAL/EAH) from the stack into $AC–$AF before returning (PLA/STA sequence).
- NEWLIN routine scans LDTB1 starting at index TBLX to find the last display line; it treats a negative (sign bit set) entry (0xFF terminator) as table end, storing the found index into LINTMP ($02A5).

Labels shown in the listing include SCR41, SCRL5/SCRL3, MLP4/MLP42 (delay/restore), and BMT1/BMT2 (new line scan/store). The code carefully preserves and restores indirect pointers used by other KERNAL routines and updates internal line-table bookkeeping used by higher-level wrap/insert/scroll logic.

## Source Code
```asm
                                ;
                                SCR41
.,E913 20 FF E9 JSR $E9FF              JSR CLRLN
                                ;
.,E916 A2 00    LDX #$00        LDX    #0              ;SCROLL HI BYTE POINTERS
.,E918 B5 D9    LDA $D9,X       SCRL5  LDA LDTB1,X
.,E91A 29 7F    AND #$7F        AND    #$7F
.,E91C B4 DA    LDY $DA,X       LDY    LDTB1+1,X
.,E91E 10 02    BPL $E922       BPL    SCRL3
.,E920 09 80    ORA #$80        ORA    #$80
.,E922 95 D9    STA $D9,X       SCRL3  STA LDTB1,X
.,E924 E8       INX             INX
.,E925 E0 18    CPX #$18        CPX    #NLINES-1
.,E927 D0 EF    BNE $E918       BNE    SCRL5
                                ;
.,E929 A5 F1    LDA $F1         LDA    LDTB1+NLINES-1
.,E92B 09 80    ORA #$80        ORA    #$80
.,E92D 85 F1    STA $F1         STA    LDTB1+NLINES-1
.,E92F A5 D9    LDA $D9         LDA    LDTB1           ;DOUBLE LINE?
.,E931 10 C3    BPL $E8F6       BPL    SCRO0           ;YES...SCROLL AGAIN
                                ;
.,E933 E6 D6    INC $D6                INC TBLX
.,E935 EE A5 02 INC $02A5              INC LINTMP
.,E938 A9 7F    LDA #$7F               LDA #$7F        ;CHECK FOR CONTROL KEY
.,E93A 8D 00 DC STA $DC00              STA COLM        ;DROP LINE 2 ON PORT B
.,E93D AD 01 DC LDA $DC01              LDA ROWS
.,E940 C9 FB    CMP #$FB               CMP #$FB        ;SLOW SCROLL KEY?(CONTROL)
.,E942 08       PHP                    PHP             ;SAVE STATUS. RESTORE PORT B
.,E943 A9 7F    LDA #$7F               LDA #$7F        ;FOR STOP KEY CHECK
.,E945 8D 00 DC STA $DC00              STA COLM
.,E948 28       PLP                    PLP
.,E949 D0 0B    BNE $E956       BNE    MLP42
                                ;
.,E94B A0 00    LDY #$00        LDY    #0
.,E94D EA       NOP             MLP4   NOP             ;DELAY
.,E94E CA       DEX             DEX
.,E94F D0 FC    BNE $E94D       BNE    MLP4
.,E951 88       DEY             DEY
.,E952 D0 F9    BNE $E94D       BNE    MLP4
.,E954 84 C6    STY $C6         STY    NDX             ;CLEAR KEY QUEUE BUFFER
                                ;
.,E956 A6 D6    LDX $D6         MLP42  LDX TBLX
                                ;
.,E958 68       PLA             PULIND PLA             ;RESTORE OLD INDIRECTS
.,E959 85 AF    STA $AF         STA    EAH
.,E95B 68       PLA             PLA
.,E95C 85 AE    STA $AE         STA    EAL
.,E95E 68       PLA             PLA
.,E95F 85 AD    STA $AD         STA    SAH
.,E961 68       PLA             PLA
.,E962 85 AC    STA $AC         STA    SAL
.,E964 60       RTS             RTS
                                NEWLIN
.,E965 A6 D6    LDX $D6                LDX TBLX
.,E967 E8       INX             BMT1   INX
                                ; CPX #NLINES ;EXCEDED THE NUMBER OF LINES ???
                                ; BEQ BMT2 ;VIC-40 CODE
.,E968 B5 D9    LDA $D9,X              LDA LDTB1,X     ;FIND LAST DISPLAY LINE OF THIS LINE
.,E96A 10 FB    BPL $E967              BPL BMT1        ;TABLE END MARK=>$FF WILL ABORT...ALSO
.,E96C 8E A5 02 STX $02A5       BMT2   STX LINTMP      ;FOUND IT
```

## Key Registers
- $AC-$AF - Zero page - saved indirect address bytes (SAL, SAH, EAL, EAH); restored on return
- $D9-$DA - Zero page - LDTB1 line table (low/high bytes per line entry)
- $F1 - Zero page - LDTB1+NLINES-1 (terminal line-table entry)
- $D6 - Zero page - TBLX (table index/cursor)
- $02A5 - RAM - LINTMP (temporary line index/temp bookkeeping)
- $DC00-$DC0F - CIA1 - port register block (code writes $DC00 and reads $DC01 for control/stop key and row/column gating)

## References
- "wrap_check_and_screen_scroll" — expands on how wrap/insert invoke these routines to maintain the screen and line-table pointers.

## Labels
- LDTB1
- SAL
- SAH
- EAL
- EAH
- TBLX
- LINTMP
