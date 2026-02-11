# KERNAL Editor main loop (LP*, PRT, run-key buffering) — $E5CA-$E64A

**Summary:** Disassembly of Commodore 64 KERNAL editor main loop and print/entry handling (PRT at $E716, LP2/LP21/LP22/LP23). Covers editor flags CRSW, PNTR, QTSW, AUTODN, run-key buffering (RUNTB -> KEYD), and line-input loop using (PNT),Y.

## Editor main loop — behavior and responsibilities
This chunk is a section of the KERNAL editor main loop beginning at $E5CA. Main behaviors handled here:

- Entry through PRT ($E716) to process/print a character; control then flows into the editor loop.
- Editor-mode flag handling:
  - BLNSW (stored from $C6 into $CC) and AUTODN ($0292) are set to enable/disable auto-scroll-down.
  - BLNON ($CF) is tested to take an alternate path (LP21) when blanking is disabled.
  - When BLNON is set the code restores GDBLN ($CE) and GDCOL ($0287) and calls DSPP to redraw/update display.
- LP21/LP22/LP23: handle run-key (fast-run) buffer and special-key processing:
  - After JSR LP2 (removes a character from the keyboard queue) the code checks for the run-key code (CMP #$83).
  - If run-key detected, LP23 sets up a 10-byte copy from RUNTB-1 (source) into KEYD-1 (destination) using X=9..0. This preserves the run-buffer into the keyboard buffer and re-enters the loop.
  - If the character is not run-key, LP22 checks for carriage return (#$0D) and branches accordingly.
- Carriage-return handling:
  - On CR the code stores LNMX ($D5) into CRSW ($D0) — marking CR state — then examines the text at (PNT),Y.
  - The loop at CLP5/CLP6 scans backwards over trailing spaces (CMP #$20 / DEY / loop) before advancing (INY). The final Y is stored in INDX ($C8).
  - It then clears AUTODN ($0292), sets PNTR ($D3) and QTSW ($D4) to zero, and continues to FINDST to locate the first physical line if needed.
- Line input loop (LOOP5..LOP54):
  - Saves A/X/Y on the stack while testing CRSW.
  - Fetches bytes from (PNT),Y into DATA ($D7), masks and shifts (AND #$3F / ASL / BIT) and branches based on bit results — low-level character/category handling for further processing.

Important variables and flags referenced (names from commented disassembly):
- PRT ($E716) — print/character routine entry (preserves registers and uses CRSW/PNTR to fetch).
- LP2 — routine invoked to remove a character from the keyboard queue.
- RUNTB / KEYD — run-key source/destination buffers (copied by LP23).
- AUTODN ($0292) — auto-scroll down flag (set/cleared).
- CRSW ($D0) — carriage-return switch/state.
- PNTR ($D3) — pointer index saved from Y when processing CR.
- QTSW ($D4) — quote-toggle switch (cleared here).
- INDX ($C8) — index derived from PNTR/Y on CR handling.
- LSXP ($C9), TBLX ($D6), FINDST — used to find the first physical line and compare table indices.

This chunk focuses on control flow, flag updates, and run-key buffering; lower-level formatting and plotting are referenced (see plot_routine for PLOT/PNTR usage).

## Source Code
```asm
.,E5CA 20 16 E7 JSR $E716       LOOP4  JSR PRT
                                LOOP3
.,E5CD A5 C6    LDA $C6         LDA    NDX
.,E5CF 85 CC    STA $CC         STA    BLNSW
.,E5D1 8D 92 02 STA $0292       STA    AUTODN          ;TURN ON AUTO SCROLL DOWN
.,E5D4 F0 F7    BEQ $E5CD       BEQ    LOOP3
.,E5D6 78       SEI             SEI
.,E5D7 A5 CF    LDA $CF         LDA    BLNON
.,E5D9 F0 0C    BEQ $E5E7       BEQ    LP21
.,E5DB A5 CE    LDA $CE         LDA    GDBLN
.,E5DD AE 87 02 LDX $0287       LDX    GDCOL           ;RESTORE ORIGINAL COLOR
.,E5E0 A0 00    LDY #$00        LDY    #0
.,E5E2 84 CF    STY $CF         STY    BLNON
.,E5E4 20 13 EA JSR $EA13       JSR    DSPP
.,E5E7 20 B4 E5 JSR $E5B4       LP21   JSR LP2
.,E5EA C9 83    CMP #$83        CMP    #$83            ;RUN KEY?
.,E5EC D0 10    BNE $E5FE       BNE    LP22
.,E5EE A2 09    LDX #$09        LDX #9
.,E5F0 78       SEI             SEI
.,E5F1 86 C6    STX $C6         STX NDX
.,E5F3 BD E6 EC LDA $ECE6,X     LP23   LDA RUNTB-1,X
.,E5F6 9D 76 02 STA $0276,X     STA KEYD-1,X
.,E5F9 CA       DEX             DEX
.,E5FA D0 F7    BNE $E5F3       BNE LP23
.,E5FC F0 CF    BEQ $E5CD       BEQ LOOP3
.,E5FE C9 0D    CMP #$0D        LP22   CMP #$D
.,E600 D0 C8    BNE $E5CA       BNE    LOOP4
.,E602 A4 D5    LDY $D5         LDY    LNMX
.,E604 84 D0    STY $D0         STY    CRSW
.,E606 B1 D1    LDA ($D1),Y     CLP5   LDA (PNT)Y
.,E608 C9 20    CMP #$20        CMP    #' '
.,E60A D0 03    BNE $E60F       BNE    CLP6
.,E60C 88       DEY             DEY
.,E60D D0 F7    BNE $E606       BNE    CLP5
.,E60F C8       INY             CLP6   INY
.,E610 84 C8    STY $C8         STY    INDX
.,E612 A0 00    LDY #$00        LDY    #0
.,E614 8C 92 02 STY $0292       STY AUTODN          ;TURN OFF AUTO SCROLL DOWN
.,E617 84 D3    STY $D3         STY    PNTR
.,E619 84 D4    STY $D4         STY    QTSW
.,E61B A5 C9    LDA $C9         LDA    LSXP
.,E61D 30 1B    BMI $E63A       BMI    LOP5
.,E61F A6 D6    LDX $D6         LDX    TBLX
.,E621 20 ED E6 JSR $E6ED       JSR FINDST      ;FIND 1ST PHYSICAL LINE
.,E624 E4 C9    CPX $C9         CPX LSXP
.,E626 D0 12    BNE $E63A       BNE    LOP5
.,E628 A5 CA    LDA $CA         LDA    LSTP
.,E62A 85 D3    STA $D3         STA    PNTR
.,E62C C5 C8    CMP $C8         CMP    INDX
.,E62E 90 0A    BCC $E63A       BCC    LOP5
.,E630 B0 2B    BCS $E65D       BCS    CLP2
                                ;INPUT A LINE UNTIL CARRIAGE RETURN
                                ;
.,E632 98       TYA             LOOP5  TYA
.,E633 48       PHA             PHA
.,E634 8A       TXA             TXA
.,E635 48       PHA             PHA
.,E636 A5 D0    LDA $D0         LDA    CRSW
.,E638 F0 93    BEQ $E5CD       BEQ    LOOP3
.,E63A A4 D3    LDY $D3         LOP5   LDY PNTR
.,E63C B1 D1    LDA ($D1),Y     LDA    (PNT)Y
                                NOTONE
.,E63E 85 D7    STA $D7         STA    DATA
.,E640 29 3F    AND #$3F        LOP51  AND #$3F
.,E642 06 D7    ASL $D7         ASL    DATA
.,E644 24 D7    BIT $D7         BIT    DATA
.,E646 10 02    BPL $E64A       BPL    LOP54
.,E648 09 80    ORA #$80        ORA    #$80
.,E64A 90 04    BCC $E650       LOP54  BCC LOP52
```

## Key Registers
- $E716 - KERNAL - PRT (print/character routine entry point, called via JSR $E716)
- $ECE6-$ECEF - RAM/ROM area - RUNTB-1..RUNTB-? (run-key source buffer, copied by LP23 with X=9..0)
- $0276-$027F - RAM - KEYD-1..KEYD+? (keyboard buffer destination for run-key copy)
- $0292 - RAM - AUTODN (auto-scroll-down flag)
- $0287 - RAM - GDCOL (display color value restored when BLNON set)
- $D1 - RAM - PNT (pointer base used with Y for (PNT),Y string access)
- $D3 - RAM - PNTR (saved pointer/index)
- $D4 - RAM - QTSW (quote switch / toggle)
- $D5 - RAM - LNMX (line index/length used to set CRSW)
- $D6 - RAM - TBLX (table index used by FINDST)
- $C6 - RAM - NDX (index/NDX saved into BLNSW)
- $CC - RAM - BLNSW (blank-switch mirror of NDX)
- $CF - RAM - BLNON (blanking enabled/disabled)
- $CE - RAM - GDBLN (display blank state)
- $C8 - RAM - INDX (index derived from PNTR/Y after trimming spaces)
- $C9 - RAM - LSXP (line/table index used in branching)
- $CA - RAM - LSTP (line start pointer used to set PNTR)
- $D0 - RAM - CRSW (carriage-return switch)
- $D7 - RAM - DATA (temporary fetched character)

## References
- "plot_routine" — expands on PLOT/PNTR usage for cursor and printing

## Labels
- CRSW
- PNTR
- QTSW
- AUTODN
- INDX
