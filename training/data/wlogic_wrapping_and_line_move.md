# WLOGIC — Wrap logic and line increment/decrement (KERNAL $E6B6–$E701)

**Summary:** Wrap/line-increment code from KERNAL $E6B6 that handles cursor pointer increment (PNTR $D3), tests against line limits (LNMX $D5, MAXCHR #$4F), optional auto-scroll (AUTODN $0292), table index (TBLX $D6) and line-table entries (LDTB1 at $D9,X). Calls CHKDWN ($E8B3), BMT1 ($E967), SCROL ($E8EA), NXLN ($E87C) and SETPNT ($E9F0).

## Operation
This routine is the editor wrap/line handling executed after inserting a character. Key behaviors (preserving original comments and control flow):

- Entry (JSR $E8B3 / CHKDWN): first calls CHKDWN, then increments PNTR ($D3) — the character pointer within the current physical line.
- Compare PNTR vs LNMX ($D5): If PNTR >= LNMX, control branches to WLGRTS ($E700) which returns (no wrapping required).
- Max-character check: CMP #$4F tests PNTR against MAXCHR-1; if equal, execution branches to WLOG10 ($E6F7) which performs a line increment (DEC TBLX), calls NXLN, clears PNTR and returns.
- Auto-scroll decision: If PNTR < MAXCHR-1, load AUTODN from $0292; if AUTODN set, jump to BMT1 ($E967) (scroll decision handled there).
- No AUTODN: check TBLX ($D6) against NLINES (#$19). If TBLX < NLINES, call SCROL ($E8EA) to perform a scroll-up and DEC TBLX to move the table index up one physical line.
- Wrap the line into the next physical line:
  - Operating on LDTB1,X (line descriptor table): ASL/LSR instructions are used on LDTB1,X (code preserves the byte but manipulates it to mark continuation status).
  - Increment X and set bit 7 (ORA #$80) on LDTB1,X to mark the next line as a non-continuation (start of a wrapped physical line).
  - Update LNMX ($D5) by adding LLEN (#$28) to account for bytes moved into the new physical line.
- FINDST loop: backs up through LDTB1 entries (DEX loop) until a byte with bit 7 set (negative flag) is found — that marks the first physical line of the logical line. Once found, JMP SETPNT ($E9F0) to ensure the pointer/table pointers are consistent.
- WLOG10 branch (when MAXCHR reached): DEC TBLX; JSR NXLN; clear PNTR and RTS.

Behavioral details preserved from the code:
- PNTR ($D3) is incremented per inserted character; LNMX ($D5) is the current logical-line maximum (bytes available); LLEN (#$28) is added to LNMX when a line is wrapped (reflects bytes moved to the next physical line).
- Bit 7 in LDTB1,X denotes a non-continuation (start) line entry; FINDST uses this to find the start of the logical line.
- AUTODN at $0292 gates automatic scrolling — when set, control is delegated to BMT1 to decide scroll direction.
- NLINES is compared as #$19 when deciding whether to call SCROL and decrement TBLX.

Calls and transfers:
- JSR $E8B3 — CHKDWN
- JMP $E967 — BMT1 (choose scroll direction)
- JSR $E8EA — SCROL (perform scroll)
- JSR $E87C — NXLN (advance to next line)
- JMP $E9F0 — SETPNT (recalculate/ensure pointer correctness)

## Source Code
```asm
.,E6B6 20 B3 E8 JSR $E8B3              JSR CHKDWN      ;MAYBE WE SHOULD WE INCREMENT TBLX
.,E6B9 E6 D3    INC $D3                INC PNTR        ;BUMP CHARCTER POINTER
.,E6BB A5 D5    LDA $D5                LDA LNMX        ;
.,E6BD C5 D3    CMP $D3                CMP PNTR        ;IF LNMX IS LESS THAN PNTR
.,E6BF B0 3F    BCS $E700              BCS WLGRTS      ;BRANCH IF LNMX>=PNTR
.,E6C1 C9 4F    CMP #$4F               CMP #MAXCHR-1   ;PAST MAX CHARACTERS
.,E6C3 F0 32    BEQ $E6F7              BEQ WLOG10      ;BRANCH IF SO
.,E6C5 AD 92 02 LDA $0292              LDA AUTODN      ;SHOULD WE AUTO SCROLL DOWN?
.,E6C8 F0 03    BEQ $E6CD              BEQ WLOG20      ;BRANCH IF NOT
.,E6CA 4C 67 E9 JMP $E967       JMP    BMT1            ;ELSE DECIDE WHICH WAY TO SCROLL
                                WLOG20
.,E6CD A6 D6    LDX $D6                LDX TBLX        ;SEE IF WE SHOULD SCROLL DOWN
.,E6CF E0 19    CPX #$19               CPX #NLINES
.,E6D1 90 07    BCC $E6DA              BCC WLOG30      ;BRANCH IF NOT
.,E6D3 20 EA E8 JSR $E8EA              JSR SCROL       ;ELSE DO THE SCROL UP
.,E6D6 C6 D6    DEC $D6                DEC TBLX        ;AND ADJUST CURENT LINE#
.,E6D8 A6 D6    LDX $D6                LDX TBLX
.,E6DA 16 D9    ASL $D9,X       WLOG30 ASL LDTB1,X     ;WRAP THE LINE
.,E6DC 56 D9    LSR $D9,X              LSR LDTB1,X
.,E6DE E8       INX                    INX             ;INDEX TO NEXT LLINE
.,E6DF B5 D9    LDA $D9,X              LDA LDTB1,X     ;GET HIGH ORDER BYTE OF ADDRESS
.,E6E1 09 80    ORA #$80               ORA #$80        ;MAKE IT A NON-CONTINUATION LINE
.,E6E3 95 D9    STA $D9,X              STA LDTB1,X     ;AND PUT IT BACK
.,E6E5 CA       DEX                    DEX             ;GET BACK TO CURRENT LINE
.,E6E6 A5 D5    LDA $D5                LDA LNMX        ;CONTINUE THE BYTES TAKEN OUT
.,E6E8 18       CLC                    CLC
.,E6E9 69 28    ADC #$28               ADC #LLEN
.,E6EB 85 D5    STA $D5                STA LNMX
                                FINDST
.,E6ED B5 D9    LDA $D9,X              LDA LDTB1,X     ;IS THIS THE FIRST LINE?
.,E6EF 30 03    BMI $E6F4              BMI FINX        ;BRANCH IF SO
.,E6F1 CA       DEX                    DEX             ;ELSE BACKUP 1
.,E6F2 D0 F9    BNE $E6ED              BNE FINDST
                                FINX
.,E6F4 4C F0 E9 JMP $E9F0              JMP SETPNT      ;MAKE SURE PNT IS RIGHT
.,E6F7 C6 D6    DEC $D6         WLOG10 DEC TBLX
.,E6F9 20 7C E8 JSR $E87C              JSR NXLN
.,E6FC A9 00    LDA #$00               LDA #0
.,E6FE 85 D3    STA $D3                STA PNTR        ;POINT TO FIRST BYTE
.,E700 60       RTS             WLGRTS RTS
.,E701 A6 D6    LDX $D6         BKLN   LDX TBLX
```

## References
- "editor_input_and_quote_handling" — expands on routines called after inserting characters (post-insert wrap handling)
- "scrol_and_scrlin" — expands on screen scroll routines (SCROL/CLRLN) used here

## Labels
- PNTR
- LNMX
- TBLX
- LDTB1
- AUTODN
- LLEN
- NLINES
- MAXCHR
