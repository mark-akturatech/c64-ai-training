# RD20 / RD200 Load Sequence Logic — KERNAL ROM Disassembly (FA8D–FAD3)

**Summary:** Disassembly of the RD20 / RD200 branch logic in the Commodore 64 KERNAL ROM handling load-block sequencing: checks block sync (DIFF $B5), first-byte error flag (PRP $B6), inspects header count char (OCHAR $BD) and SHCNL ($A7) to decide first/second block, sets RDFLG ($AA) into data/ignore modes, calls RD300 ($FB8E) to initialize SAL/SAH address pointers, and handles short-block/end-of-block behavior.

## Description

This code implements the branching between "waiting-for-sync" and "loading" modes and decides whether to begin reading block data, ignore the remainder of a block, or handle errors / block-end conditions.

Entry & mode selection
- Entry label: .FA8D. First test is the V flag (BVS .FAC0 / RD60) which indicates we are already loading (RD60 path).
- If not in that loading state, BNE .FAA9 (RD200) means the routine is in a sync-waiting state and proceeds with the sync handling path.

Sync checks and first-byte tests
- Check DIFF ($B5): if DIFF is non-zero, block synchronization is present — exit to RD10 (no load). (LDA $B5 / BNE RD10)
- Check PRP ($B6): if the first byte had an error, exit to RD10 (skip). (LDA $B6 / BNE RD10)

Determine which block (first/second) and set RDFLG
- Load SHCNL ($A7) into A and LSR A — the LSR moves the lowest bit of SHCNL into the carry (used to indicate FSBLK state).
- Load OCHAR ($BD) — the header count character. Its sign bit (negative/positive) selects first- vs second-block logic:
  - If OCHAR negative (BMI RD22): treat as first-block data (branch RD22).
  - Otherwise, examine carry from the LSR of SHCNL (BCC RD40): if carry clear, expect first-block data and go set ignore-bytes mode (RD40).
  - There's an odd sequence that clears the carry (CLC) then uses BCS RD40 for the RD22 path; preserve original control flow as in ROM (this sequence sets up the correct branching semantics depending on prior LSR and OCHAR).
- If proceeding to accept data, mask OCHAR with #$0F (AND #$0F) and store the result into RDFLG ($AA). This stores the low nibble of the header count into RDFLG as a mode/count value.

Waiting for "real" data
- In the syncing path (RD200), RDFLG is decremented (DEC $AA) repeatedly (BNE back to RD10) until the count reaches zero, which indicates the end of header/skip countdown.
- When RDFLG counts down to zero, RDFLG is explicitly set to #$40 (data mode) and execution continues to RD300 to initialize address pointers.

Initialization and debug/setups
- JSR RD300 ($FB8E) initializes address pointers (SAL/SAH) for the upcoming data read.
- There is a short debug sequence that clears SHCNH ($AB) to zero (LDA #$00 / STA $AB) before branching back to RD10 to continue processing.

Ignore rest-of-block mode (RD40)
- RD40 sets RDFLG to #$80 (ignore-bytes mode) so the remainder of the block will be skipped (LDA #$80 / STA $AA) and returns to the sync/processing loop.

Loading continuation & end-of-block checks (RD60 / RD70)
- RD60 rechecks DIFF ($B5) for end-of-block. If DIFF = 0, branch to RD70 (CMPSTE) to check storage area end.
- If DIFF non-zero when RD60 detects an unexpected short block remainder, a short-block error is signaled:
  - LDA #$04 (SBERR) / JSR UDST ($FE1C) — call the UDST error routine.
  - LDA #$00 forces RDFLG to 0 (end condition), then JMP RD161 ($FB4A) to handle block termination.
- If RD70 (CMPSTE $FCD1) returns BCC (not past end-of-storage), execution jumps to RD160 ($FB48).

Notes on flags and variables (as used by this code)
- DIFF ($B5) acts as a block-sync presence indicator (zero/non-zero).
- PRP ($B6) is a "first-byte error" flag: non-zero prevents starting data processing.
- SHCNL ($A7) low bit (moved to carry by LSR) indicates FSBLK state / first-block selection when combined with the sign of OCHAR.
- OCHAR ($BD) header count char: sign bit and low nibble determine block selection and RDFLG initial count.
- RDFLG ($AA) is used as a countdown / mode flag:
  - Loaded with low nibble of OCHAR (AND #$0F) to count header bytes to skip.
  - Decremented until zero, then set to #$40 (data) to begin reading real block bytes.
  - Alternatively set to #$80 to enter ignore-bytes mode for remainder of block.
- RD300 ($FB8E) sets up SAL/SAH address pointers for storage/verify routines.

External routine cross-references (called addresses)
- RD300 — $FB8E (initialize address pointers SAL/SAH)
- UDST  — $FE1C (report/store short-block error)
- RD161 — $FB4A (handle forced RDFLG end / continuation)
- CMPSTE — $FCD1 (check for end of storage area)
- RD160 — $FB48 (handle continuation when storage not finished)

## Source Code
```asm
.,FA8D 70 31    BVS $FAC0       RD20   BVS RD60        ;WE ARE LOADING
.,FA8F D0 18    BNE $FAA9       BNE    RD200           ;WE ARE SYNCING
                                ;
.,FA91 A5 B5    LDA $B5         LDA    DIFF            ;DO WE HAVE BLOCK SYNC...
.,FA93 D0 F5    BNE $FA8A       BNE    RD10            ;...YES, EXIT
.,FA95 A5 B6    LDA $B6         LDA    PRP             ;IF FIRST BYTE HAS ERROR...
.,FA97 D0 F1    BNE $FA8A       BNE    RD10            ;...THEN SKIP (EXIT)
.,FA99 A5 A7    LDA $A7         LDA    SHCNL           ;MOVE FSBLK TO CARRY...
.,FA9B 4A       LSR             LSR    A
.,FA9C A5 BD    LDA $BD         LDA    OCHAR           ; SHOULD BE A HEADER COUNT CHAR
.,FA9E 30 03    BMI $FAA3       BMI    RD22            ;IF NEG THEN FIRSTBLOCK DATA
.,FAA0 90 18    BCC $FABA       BCC    RD40            ;...EXPECTING FIRSTBLOCK DATA...YES
.,FAA2 18       CLC             CLC
.,FAA3 B0 15    BCS $FABA       RD22   BCS RD40        ;EXPECTING SECOND BLOCK?...YES
.,FAA5 29 0F    AND #$0F        AND    #$F             ;MASK OFF HIGH STORE HEADER COUNT...
.,FAA7 85 AA    STA $AA         STA    RDFLG           ;...IN MODE FLAG (HAVE CORRECT BLOCK)
.,FAA9 C6 AA    DEC $AA         RD200  DEC RDFLG       ;WAIT UNTILL WE GET REAL DATA...
.,FAAB D0 DD    BNE $FA8A       BNE    RD10            ;...9876543210 REAL
.,FAAD A9 40    LDA #$40        LDA    #$40            ;NEXT UP IS REAL DATA...
.,FAAF 85 AA    STA $AA         STA    RDFLG           ;...SET DATA MODE
.,FAB1 20 8E FB JSR $FB8E       JSR    RD300           ;GO SETUP ADDRESS POINTERS
.,FAB4 A9 00    LDA #$00        LDA    #0              ;DEBUG CODE##################################################
.,FAB6 85 AB    STA $AB         STA    SHCNH
.,FAB8 F0 D0    BEQ $FA8A       BEQ    RD10            ;JMP TO CONTINUE
.,FABA A9 80    LDA #$80        RD40   LDA #$80        ;WE WANT TO...
.,FABC 85 AA    STA $AA         STA    RDFLG           ;IGNORE BYTES MODE
.,FABE D0 CA    BNE $FA8A       BNE    RD10            ;JMP
.,FAC0 A5 B5    LDA $B5         RD60   LDA DIFF        ;CHECK FOR END OF BLOCK...
.,FAC2 F0 0A    BEQ $FACE       BEQ    RD70            ;...OKAY
                                ;
.,FAC4 A9 04    LDA #$04        LDA    #SBERR          ;SHORT BLOCK ERROR
.,FAC6 20 1C FE JSR $FE1C       JSR    UDST
.,FAC9 A9 00    LDA #$00        LDA    #0              ;FORCE RDFLG FOR AN END
.,FACB 4C 4A FB JMP $FB4A       JMP    RD161
.,FACE 20 D1 FC JSR $FCD1       RD70   JSR CMPSTE      ;CHECK FOR END OF STORAGE AREA
.,FAD1 90 03    BCC $FAD6       BCC    *+5             ;NOT DONE YET
.,FAD3 4C 48 FB JMP $FB48       JMP    RD160
```

## Key Registers
- $A7 - Zero Page - SHCNL (shift channel / FSBLK low-bit used via LSR)
- $AA - Zero Page - RDFLG (read-data/ignore mode and header-count counter)
- $AB - Zero Page - SHCNH (high part of shift/channel, set to 0 in debug path)
- $B5 - Zero Page - DIFF (block-sync presence indicator)
- $B6 - Zero Page - PRP (first-byte error flag)
- $BD - Zero Page - OCHAR (header count character used to determine first/second block)

## References
- "byte_handler_intro_and_mode_flags" — expands on this code path when RDFLG indicates entering data-load or sync processing
- "pass_checks_and_verify_store_prep" — expands on what happens after RD300 initializes addresses and control reaches end-of-block checks and storage/verify logic

## Labels
- SHCNL
- RDFLG
- SHCNH
- DIFF
- PRP
- OCHAR
