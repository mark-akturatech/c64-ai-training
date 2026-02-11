# KERNAL: RD70 end-of-block / pass management (FAD6–FB05)

**Summary:** Checks which pass is active (SHCNL $00A7), decides between LOAD and VERIFY (VERCK $0093), compares incoming byte OCHAR ($00BD) with memory via pointer SAL/SAH ($00AC/$00AD) during VERIFY, sets PRP ($00B6) on mismatch and logs bad addresses into BAD table ($0100+) using PTR1 ($009E) as index; code at $FAD6–$FB05.

**Description**
This KERNAL fragment performs end-of-block / pass-management tasks during disk transfers:

- Determines whether this is the first or second pass by testing SHCNL ($00A7). If zero (after DEX/BEQ), control jumps to the second-pass handler (RD58).
- Reads VERCK ($0093) to choose between LOAD (writing data into memory) and VERIFY (compare-only). If VERCK is clear, it loads; otherwise it verifies.
- In VERIFY mode it loads the incoming character OCHAR ($00BD) and compares it with the memory byte addressed by the pointer (SAL,SAH) using CMP (indirect),Y — CMP ($AC),Y.
  - On equality it continues (no error).
  - On mismatch it sets PRP ($00B6) to flag a read/verify problem.
- When PRP indicates an error the code prepares to store the bad location for a second-pass retry:
  - It checks PTR1 ($009E) against a maximum of #$3D (61). If PTR1 >= #$3D, the routine branches to handle "second pass error" (RD55).
  - Otherwise it stores the bad location low/high bytes into BAD table slots via STA $0100,X and STA $0101,X, advancing X and updating PTR1.
- After logging the bad address it jumps to the routine that continues storing/processing the character (RD59).

This block is the logging/flagging portion used when verify fails, ensuring bad sectors/bytes are recorded for later re-reads in a second pass.

## Source Code
```asm
.,FAD6 A6 A7    LDX $A7         LDX    SHCNL           ;CHECK WHICH PASS...
.,FAD8 CA       DEX             DEX
.,FAD9 F0 2D    BEQ $FB08       BEQ    RD58            ;...SECOND PASS
.,FADB A5 93    LDA $93         LDA    VERCK           ;CHECK IF LOAD OR VERIFY...
.,FADD F0 0C    BEQ $FAEB       BEQ    RD80            ;...LOADING
.,FADF A0 00    LDY #$00        LDY    #0              ;...JUST VERIFYING
.,FAE1 A5 BD    LDA $BD         LDA    OCHAR
.,FAE3 D1 AC    CMP ($AC),Y     CMP    (SAL)Y          ;COMPARE WITH DATA IN PET
.,FAE5 F0 04    BEQ $FAEB       BEQ    RD80            ;...GOOD SO CONTINUE
.,FAE7 A9 01    LDA #$01        LDA    #1              ;...BAD SO FLAG...
.,FAE9 85 B6    STA $B6         STA    PRP             ;...AS AN ERROR
                                ; STORE BAD LOCATIONS FOR SECOND PASS RE-TRY
.,FAEB A5 B6    LDA $B6         RD80   LDA PRP         ;CHK FOR ERRORS...
.,FAED F0 4B    BEQ $FB3A       BEQ    RD59            ;...NO ERRORS
.,FAEF A2 3D    LDX #$3D        LDX    #61             ;MAX ALLOWED IS 30
.,FAF1 E4 9E    CPX $9E         CPX    PTR1            ;ARE WE AT MAX?...
.,FAF3 90 3E    BCC $FB33       BCC    RD55            ;...YES, FLAG AS SECOND PASS ERROR
.,FAF5 A6 9E    LDX $9E         LDX    PTR1            ;GET INDEX INTO BAD...
.,FAF7 A5 AD    LDA $AD         LDA    SAH             ;...AND STORE THE BAD LOCATION
.,FAF9 9D 01 01 STA $0101,X     STA    BAD+1,X         ;...IN BAD TABLE
.,FAFC A5 AC    LDA $AC         LDA    SAL
.,FAFE 9D 00 01 STA $0100,X     STA    BAD,X
.,FB01 E8       INX             INX                    ;ADVANCE POINTER TO NEXT
.,FB02 E8       INX             INX
.,FB03 86 9E    STX $9E         STX    PTR1
.,FB05 4C 3A FB JMP $FB3A       JMP    RD59            ;GO STORE CHARACTER
```

## Key Registers
- $00A7 - SHCNL - channel/pass counter used to detect second pass
- $0093 - VERCK - verify/check mode flag (load vs verify)
- $00BD - OCHAR - incoming character from disk
- $00AC - SAL - low byte of memory pointer used for compare (indirect),Y
- $00AD - SAH - high byte of memory pointer used for compare (indirect),Y
- $00B6 - PRP - verify/failure flag set on compare mismatch
- $009E - PTR1 - pointer/index into BAD table (counts bad entries)
- $0100-$01FF - BAD table area (addresses stored via STA $0100,X and STA $0101,X)

## References
- "load_sync_and_block_start_handling" — expands on Address setup from RD300 used by these store/verify checks
- "second_pass_bad_table_handling" — expands on logging into BAD table for second-pass retries

## Labels
- SHCNL
- VERCK
- OCHAR
- SAL
- SAH
- PRP
- PTR1
- BAD
