# KERNAL: Bad-location table check and second-pass retry logic ($FB08-$FB38)

**Summary:** Disassembly of KERNAL routine at $FB08 handling BAD table re-try during second pass: compares PTR2 ($009F) vs PTR1 ($009E), matches current transfer address SAL/SAH ($00AC/$00AD) against BAD table at $0100,X, advances PTR2 by two bytes on match, and performs verify-vs-load checks using VERCK ($0093), OCHAR ($00BD) and PRP flag ($00B6). Also calls UDST ($FE1C) on second-pass errors and sets SPERR (#$10).

## Operation / Flow

- Purpose: During a second-pass re-read/re-verify, the KERNAL keeps a BAD table (pairs of bytes SAL/SAH) beginning at $0100. This snippet checks whether the current load/verify address (SAL/SAH in zero page $AC/$AD) matches the next BAD entry pointed to by PTR2 ($009F). If so, PTR2 is advanced so retries skip past already-recorded bad locations; for verify operations the code also checks whether the data at the current buffer matches the expected OCHAR and flags errors accordingly.

Step-by-step:
1. LDX PTR2 ($009F) / CPX PTR1 ($009E)
   - If PTR2 == PTR1, we have processed all BAD entries; branch out (no match).
2. Compare current low address byte SAL ($00AC) to BAD table low byte at $0100,X:
   - CMP $0100,X ; if not equal branch out (no match).
3. Compare current high address byte SAH ($00AD) to BAD table high byte at $0101,X:
   - CMP $0101,X ; if not equal branch out.
4. If both bytes match, the current location is the next BAD entry:
   - INC PTR2 twice: PTR2 is incremented two times (advances past the low and high bytes of this BAD entry). Effectively PTR2 += 2.
5. Check VERCK ($0093) to distinguish loading vs verifying:
   - If VERCK == 0 (loading), branch to RD52 (load path) — no data compare needed here.
   - If VERCK != 0 (verify), perform a data compare:
     - LDY #$00 ; set Y=0
     - CMP (SAL),Y ; compare memory pointed by (SAL,SAH)+Y with OCHAR ($00BD)
     - If equal, branch out (no error).
     - If not equal, INY (so Y=1) and STY PRP ($00B6): set PRP := 1 to flag an error condition.
6. After setting PRP, code checks PRP:
   - LDA PRP; if zero branch (no second-pass error).
   - If non-zero, set A := #$10 (SPERR), JSR $FE1C (UDST — update status routine), then BNE to branch out.
   - This sequence signals/records a second-pass read/verify error and invokes status/update routine.

Notes on increments:
- PTR2 is a byte pointer into the BAD table; incrementing twice moves past the 2-byte entry (low, high). That is how the routine advances to the next BAD location for subsequent checks.

Behavioral caveats preserved from source:
- BAD table is accessed at $0100,X and $0101,X (two-byte per entry).
- PRP is used as a flag (stored as Y after INY so value = 1 when flagged).
- SPERR value #$10 is loaded into A before calling UDST; UDST may update KERNAL status/error reporting.

## Source Code
```asm
.,FB08 A6 9F    LDX $9F         ; RD58   LDX PTR2        ;HAVE WE DONE ALL IN THE TABLE?...
.,FB0A E4 9E    CPX $9E         ; CPX    PTR1
.,FB0C F0 35    BEQ $FB43       ; BEQ    RD90            ;...YES
.,FB0E A5 AC    LDA $AC         ; LDA    SAL             ;SEE IF THIS IS NEXT IN THE TABLE...
.,FB10 DD 00 01 CMP $0100,X     ; CMP    BAD,X
.,FB13 D0 2E    BNE $FB43       ; BNE    RD90            ;...NO
.,FB15 A5 AD    LDA $AD         ; LDA    SAH
.,FB17 DD 01 01 CMP $0101,X     ; CMP    BAD+1,X
.,FB1A D0 27    BNE $FB43       ; BNE    RD90            ;...NO
.,FB1C E6 9F    INC $9F         ; INC    PTR2            ;WE FOUND NEXT ONE, SO ADVANCE POINTER
.,FB1E E6 9F    INC $9F         ; INC    PTR2
.,FB20 A5 93    LDA $93         ; LDA    VERCK           ;DOING A LOAD OR VERIFY?...
.,FB22 F0 0B    BEQ $FB2F       ; BEQ    RD52            ;...LOADING
.,FB24 A5 BD    LDA $BD         ; LDA    OCHAR           ;...VERIFYING, SO CHECK
.,FB26 A0 00    LDY #$00        ; LDY    #0
.,FB28 D1 AC    CMP ($AC),Y     ; CMP    (SAL)Y
.,FB2A F0 17    BEQ $FB43       ; BEQ    RD90            ;...OKAY
.,FB2C C8       INY             ; INY                    ;MAKE .Y= 1
.,FB2D 84 B6    STY $B6         ; STY    PRP             ;FLAG IT AS AN ERROR
.,FB2F A5 B6    LDA $B6         ; RD52   LDA PRP         ;A SECOND PASS ERROR?...
.,FB31 F0 07    BEQ $FB3A       ; BEQ    RD59            ;...NO
                                ;SECOND PASS ERR
.,FB33 A9 10    LDA #$10        ; RD55   LDA #SPERR
.,FB35 20 1C FE JSR $FE1C       ; JSR    UDST
.,FB38 D0 09    BNE $FB43       ; BNE    RD90            ;JMP
```

## Key Registers
- $009F - PTR2 - pointer/index into BAD table (byte index; advanced by 2 per matched entry)
- $009E - PTR1 - pointer/index end marker for BAD table
- $00AC - SAL  - low byte of current transfer address (zero page pointer)
- $00AD - SAH  - high byte of current transfer address (zero page pointer)
- $0093 - VERCK - flag: non-zero = verify mode, zero = load mode
- $00BD - OCHAR - expected data byte used during verify comparisons
- $00B6 - PRP  - verify/PRP flag (set to Y after mismatch, used to detect second-pass errors)
- $0100-$01FF - BAD table (pairs of bytes: low,high per bad location; accessed as $0100,X and $0101,X)

## References
- "pass_checks_and_verify_store_prep" — expands on Bad locations being populated here after verify failures or other PRP indications
- "store_or_verify_and_address_increment" — expands on when verifying/loading during second pass, matching BAD entries will trigger re-store/verification flow

## Labels
- PTR2
- PTR1
- SAL
- SAH
- VERCK
- OCHAR
- PRP
- BAD
