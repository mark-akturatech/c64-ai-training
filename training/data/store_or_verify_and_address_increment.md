# RD59 / RD90: Store/Verify, INCSAL and C64 6526 adjustments (KERNAL $FB3A–$FB70)

**Summary:** KERNAL routine at $FB3A–$FB70 implements store-or-verify for OCHAR into (SAL), calls INCSAL to advance address pointers, and performs C64-specific cleanup: SEI, clear Timer‑1 enable/interrupt via $DC0D (6526), decrement FSBLK/SHCNL for multi-pass transfers, call TNIF/ RD300 to finish and restore SAL/SAH, and clear SHCNH used by BCC parity calculation.

## Routine behavior and flow
- Entry: routine decides between STORE or VERIFY based on VERCK ($93).
  - LDA $93 ; VERCK — BNE skips the store path (verify mode).
- STORE path:
  - TAY clears Y (sets Y=0) for the indirect indexed store.
  - LDA OCHAR ($BD), STA (SAL),Y — store character into memory addressed by SAL/SAH pointer (zero page).
- Common post-store/verify:
  - JSR INCSAL ($FCDB) — increment the low/high address pointers and perform any pointer bookkeeping (INCSAL return sets flags used by subsequent branches).
  - After INCSAL the code continues with transfer-finalization regardless of store/verify.
  - Sets RDFLG ($AA) := #%10000000 (A9 #$80 / STA $AA) to mark 'skip next data' mode.
- C64 6526 (CIA) specific modifications:
  - SEI (protect clearing of T1 info from interrupts).
  - STX #$01 -> $DC0D (write $DC0D) clears Timer‑1 enable (labelled D1ICR in source).
  - LDX $DC0D -> read back D1ICR to clear the interrupt flag.
- Multi-pass / transfer bookkeeping:
  - LDX FSBLK ($BE); DEX; BMI RD167 — if FSBLK was 0 (DEX => negative), branch to RD167 (done).
  - Otherwise STX FSBLK := new FSBLK (decremented).
  - DEC SHCNL ($A7) ; BEQ RD175 — decrement pass counter (SHCNL). If zero, branch to finish.
  - LDA PTR1 ($9E) ; BNE RD180 — if PTR1 != 0 (first-pass errors present), continue to error handling (RD180).
  - If PTR1 == 0, STA FSBLK ($BE) — clear FSBLK, then BEQ RD180 (branch uses Z from LDA PTR1).
- Finalization:
  - JSR TNIF ($FC93) — "read it all" / final read operation before exit.
  - JSR RD300 ($FB8E) — restore SAL & SAH (address pointers).
  - LDY #0 ; STY SHCNH ($AB) — clear SHCNH (used in BCC parity calculation).
- Notes:
  - Labels referenced by comments: RD59 (entry $FB3A), RD90 (continuation), RD160/RD161 etc. The code contains branching to higher-level KERNAL exits (RD167, RD175, RD180).
  - (Parenthetical: SAL is the zero-page pointer at $AC/$AD used for STA (SAL),Y addressing.)

## Source Code
```asm
.,FB3A A5 93    LDA $93         ; RD59   LDA VERCK       ;LOAD OR VERIFY?
.,FB3C D0 05    BNE $FB43       ; BNE    RD90            ;...VERIFY, DON'T STORE
.,FB3E A8       TAY             ; TAY                    ;MAKE Y ZERO
.,FB3F A5 BD    LDA $BD         ; LDA    OCHAR
.,FB41 91 AC    STA ($AC),Y     ; STA    (SAL)Y          ;STORE CHARACTER
.,FB43 20 DB FC JSR $FCDB       ; RD90   JSR INCSAL      ;INCREMENT ADDR.
.,FB46 D0 43    BNE $FB8B       ; BNE    RD180           ;BRANCH ALWAYS
.,FB48 A9 80    LDA #$80        ; RD160  LDA #$80        ;SET MODE SKIP NEXT DATA
.,FB4A 85 AA    STA $AA         ; RD161  STA RDFLG
                                ;
                                ; MODIFY FOR C64 6526'S
                                ;
.,FB4C 78       SEI             ; SEI                    ;PROTECT CLEARING OF T1 INFORMATION
.,FB4D A2 01    LDX #$01        ; LDX    #$01
.,FB4F 8E 0D DC STX $DC0D       ; STX    D1ICR           ;CLEAR T1 ENABLE...
.,FB52 AE 0D DC LDX $DC0D       ; LDX    D1ICR           ;CLEAR THE INTERRUPT
.,FB55 A6 BE    LDX $BE         ; LDX    FSBLK           ;DEC FSBLK FOR NEXT PASS...
.,FB57 CA       DEX             ; DEX
.,FB58 30 02    BMI $FB5C       ; BMI    RD167           ;WE ARE DONE...FSBLK=0
.,FB5A 86 BE    STX $BE         ; STX    FSBLK           ;...ELSE FSBLK=NEXT
.,FB5C C6 A7    DEC $A7         ; RD167  DEC SHCNL       ;DEC PASS CALC...
.,FB5E F0 08    BEQ $FB68       ; BEQ    RD175           ;...ALL DONE
.,FB60 A5 9E    LDA $9E         ; LDA    PTR1            ;CHECK FOR FIRST PASS ERRORS...
.,FB62 D0 27    BNE $FB8B       ; BNE    RD180           ;...YES SO CONTINUE
.,FB64 85 BE    STA $BE         ; STA    FSBLK           ;CLEAR FSBLK IF NO ERRORS...
.,FB66 F0 23    BEQ $FB8B       ; BEQ    RD180           ;JMP TO EXIT
.,FB68 20 93 FC JSR $FC93       ; RD175  JSR TNIF        ;READ IT ALL...EXIT
.,FB6B 20 8E FB JSR $FB8E       ; JSR    RD300           ;RESTORE SAL & SAH
.,FB6E A0 00    LDY #$00        ; LDY    #0              ;SET SHCNH TO ZERO...
.,FB70 84 AB    STY $AB         ; STY    SHCNH           ;...USED TO CALC PARITY BYTE
```

## Key Registers
- $DC0D - CIA 1 - D1ICR (Timer‑1 enable / interrupt control register) — written and read to disable/clear T1
- $AC-$AD - Zero page - SAL/SAH (address pointer used by STA (SAL),Y)
- $AA - Zero page - RDFLG (flag set to #$80 in this routine)
- $AB - Zero page - SHCNH (upper byte used in BCC parity calculation; cleared to 0)
- $A7 - Zero page - SHCNL (pass counter / channel low used for pass calculation)
- $BE - Zero page - FSBLK (file/sector block counter decremented between passes)
- $9E - Zero page - PTR1 (first-pass error flag/pointer)
- $BD - Zero page - OCHAR (output character to store)
- $93 - Zero page - VERCK (verify/load selector)

## References
- "second_pass_bad_table_handling" — expands on second-pass logic and error handling invoked by this routine
- "compute_block_parity_and_checksum" — expands on BCC/parity calculations performed after storing/advancing addresses

## Labels
- SAL
- RDFLG
- SHCNH
- SHCNL
- FSBLK
- PTR1
- OCHAR
- VERCK
