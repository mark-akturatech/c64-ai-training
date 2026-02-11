# KERNAL: NXLN / NXT / SCROL / CLSR routines (E84E–E8B3)

**Summary:** Disassembly of C64 KERNAL routines handling newline/line-wrap, double-line wrapping, scrolling, and clearing lines; includes pointer transfers, HI-byte pointer fixes via LDTB1/LDTB2 table checks, and coordination with SETPNT to set PNT/Y for display operations. Contains code paths for CHKBAK/CHKCOL/SCROL/CLSR interactions and TBLX/LDTB1 checks.

**Description**
This chunk contains the low-level control-flow that the KERNAL uses when processing newline-like characters and moving the text pointer (PNTR/TBLX), handling wrapping and scrolling when the cursor moves off the bottom of the screen, and clearing or uppercasing characters in some branches.

Key behaviors visible in the listing:
- Entry around $E84E inspects the accumulator for specific control codes (#$1D and #$13) and branches to distinct behaviors:
  - If A == #$1D: tests Y (TYA), possibly calls CHKBAK at $E8A1, decrements PNTR, stores Y into PNTR, and jumps to the common LOOP2 handling at $E6A8.
  - If A == #$13: triggers CLSR (clear line) via JSR $E544 and continues at the main loop.
  - Otherwise, ORA #$80 and JSR CHKCOL ($E8CB) to attempt color handling, then jumps to an "UPPER" handler at $EC4F (previously JMP LOOP2 in comments).
- NXLN/NXLN2/NXLN1 sequence ($E87C–$E88E) manipulates LSXP (via LSR $C9), increments/adjusts TBLX ($D6) and checks against NLINES (#$19) to detect moving off the bottom — if off bottom, calls SCROL ($E8EA). It then loads the LDTB1 table entry (LDA $D9,X) to determine double-line handling (BPL loops back for another scroll). TBLX is preserved back to $D6 and then execution jumps to STUPT ($E56C).
- NXT1 entry ($E891) zeroes several zero-page variables (INSRT $D8, RVS $C7, QTSW $D4, PNTR $D3) and calls NXLN to perform newline behavior.
- CHKBAK ($E8A1) scans backwards to detect whether TBLX should be decremented: it sets X = #NWRAP (here shown as #$02), clears A, compares PNTR ($D3) in a loop adding LLEN (#$28) to accumulate across wraps, DEX until X rolls over; if PNTR equals the compared value it returns with X = #$02 still set; otherwise it decrements TBLX ($D6) in BACK ($E8B0) and returns.
- The chunk ends at the start of CHKDWN ($E8B3) with LDX #$02 — the remainder is not included.

Zero-page variables referenced (from comments and code): RVS ($C7), LSXP ($C9), PNTR ($D3), TBLX ($D6), LDTB1 base accessed at $D9,X, INSRT ($D8), QTSW ($D4). Constants used in arithmetic: LLEN (#$28), NLINES (#$19), NWRAP (#$02).

Control flow calls and external routines in this chunk:
- CHKBAK ($E8A1) — verify/backtrack table index (present)
- BKLN / BAKBAK / BKLN? — BAKBAK maps to BKLN JSR $E701
- CHKCOL ($E8CB) — attempt color handling after uppercasing
- SCROL ($E8EA) — perform scrolling up
- CLSR ($E544) — clear rest of line
- STUPT ($E56C) — continue setup of pointer/Y (SETPNT interaction occurs elsewhere)

No hardware registers (VIC/SID/CIA) are referenced directly in this chunk — only zero-page KERNAL variables and table lookups.

## Source Code
```asm
.,E84E D0 04    BNE $E854       BNE    NXT6
.,E850 A9 00    LDA #$00        LDA    #0
.,E852 85 C7    STA $C7         STA    RVS
.,E854 C9 1D    CMP #$1D        NXT6   CMP #$1D
.,E856 D0 12    BNE $E86A       BNE    NXT61
.,E858 98       TYA                    TYA
.,E859 F0 09    BEQ $E864       BEQ    BAKBAK
.,E85B 20 A1 E8 JSR $E8A1       JSR    CHKBAK
.,E85E 88       DEY             DEY
.,E85F 84 D3    STY $D3         STY    PNTR
.,E861 4C A8 E6 JMP $E6A8              JMP LOOP2
.,E864 20 01 E7 JSR $E701       BAKBAK JSR BKLN
.,E867 4C A8 E6 JMP $E6A8       JMP    LOOP2
.,E86A C9 13    CMP #$13        NXT61  CMP #$13
.,E86C D0 06    BNE $E874       BNE    SCCL
.,E86E 20 44 E5 JSR $E544       JSR    CLSR
.,E871 4C A8 E6 JMP $E6A8       JPL2   JMP LOOP2
                                SCCL
.,E874 09 80    ORA #$80        ORA    #$80            ;MAKE IT UPPER CASE
.,E876 20 CB E8 JSR $E8CB       JSR    CHKCOL          ;TRY FOR COLOR
.,E879 4C 4F EC JMP $EC4F              JMP UPPER       ;WAS JMP LOOP2
                                ;
.,E87C 46 C9    LSR $C9         NXLN   LSR LSXP
.,E87E A6 D6    LDX $D6         LDX    TBLX
.,E880 E8       INX             NXLN2  INX
.,E881 E0 19    CPX #$19        CPX    #NLINES         ;OFF BOTTOM?
.,E883 D0 03    BNE $E888       BNE    NXLN1           ;NO...
.,E885 20 EA E8 JSR $E8EA       JSR    SCROL           ;YES...SCROLL
.,E888 B5 D9    LDA $D9,X       NXLN1  LDA LDTB1,X     ;DOUBLE LINE?
.,E88A 10 F4    BPL $E880       BPL    NXLN2           ;YES...SCROLL AGAIN
.,E88C 86 D6    STX $D6         STX    TBLX
.,E88E 4C 6C E5 JMP $E56C       JMP    STUPT
                                NXT1
.,E891 A2 00    LDX #$00        LDX    #0
.,E893 86 D8    STX $D8         STX    INSRT
.,E895 86 C7    STX $C7         STX    RVS
.,E897 86 D4    STX $D4         STX    QTSW
.,E899 86 D3    STX $D3         STX    PNTR
.,E89B 20 7C E8 JSR $E87C       JSR    NXLN
.,E89E 4C A8 E6 JMP $E6A8       JPL5   JMP LOOP2
                                ;
                                ;
                                ; CHECK FOR A DECREMENT TBLX
                                ;
.,E8A1 A2 02    LDX #$02        CHKBAK LDX #NWRAP
.,E8A3 A9 00    LDA #$00               LDA #0
.,E8A5 C5 D3    CMP $D3         CHKLUP CMP PNTR
.,E8A7 F0 07    BEQ $E8B0              BEQ BACK
.,E8A9 18       CLC                    CLC
.,E8AA 69 28    ADC #$28               ADC #LLEN
.,E8AC CA       DEX                    DEX
.,E8AD D0 F6    BNE $E8A5              BNE CHKLUP
.,E8AF 60       RTS                    RTS
                                ;
.,E8B0 C6 D6    DEC $D6         BACK   DEC TBLX
.,E8B2 60       RTS                    RTS
                                ;
                                ;
                                ; CHECK FOR INCREMENT TBLX
                                ;
.,E8B3 A2 02    LDX #$02        CHKDWN LDX #NWRAP
```

## References
- "scrol_and_scrlin" — expands on SCROL and SCRLIN routines used to perform actual scrolling

## Labels
- RVS
- LSXP
- PNTR
- TBLX
- INSRT
- QTSW
- LDTB1
