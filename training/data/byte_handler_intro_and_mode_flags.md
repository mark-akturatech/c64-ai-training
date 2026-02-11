# KERNAL: Cassette Read — Byte Handler (RD15 entry / RDFLG modes)

**Summary:** Cassette byte handler entry (RD15) inspects RDFLG ($AA), REZ/RER/DIFF flags ($B5 etc.), and FSBLK ($BE) to decide whether to ignore bytes, enter sync/load mode, or report block errors (SPERR/CKERR/SBERR/LBERR). Uses BIT/$AA tests, symbolic error codes, JSR to UDST ($FE1C) and JMP PREND ($FEBC).

## Description
This code is the KERNAL cassette "byte handler" invoked after a byte has been assembled by the tape input routine. It uses RDFLG (control/mode byte at $AA) and status flags to decide one of three high-level behaviors:

- Ignore incoming bytes until REZ is set (waiting-for-zeros mode).
- Transition into a sync/wait-for-sync mode (RDFLG becomes a countdown after sync).
- Enter the load/compare path (bit 6 of RDFLG indicates "load the byte"; when set, code branches to load handling).

Key control/status variables and semantics used here:
- RDFLG ($AA): mode/control for cassette byte handling.
  - Bit 7: "ignore bytes until REZ is set" (waiting-for-zeros mode when set).
  - Bit 6: "load this byte" (when set, a load/compare path is taken).
  - Otherwise: RDFLG holds a countdown after sync (number of bytes until some event).
- REZ: set by the interrupt program when it is reading zeros (implicit in logic; referenced by RDFLG semantics).
- RER: set when the assembled byte is in error (handled by other code).
- DIFF ($B5): used here to test whether zeros have been seen/yet (named DIFF in listing).
- FSBLK ($BE): pass/block counter used to decide long-block errors and first-good behavior.
- Symbolic error codes used by higher-level error reporting: SPERR, CKERR, SBERR, LBERR (values given in the listing).
- UDST (JSR $FE1C): subroutine called on long-block error.
- PREND (JMP $FEBC): common exit point / return to caller.

Flow summary (as implemented by the instructions):
1. RD15 entry: A is loaded with #$0F (used by BIT).
2. Test RDFLG: BIT $AA with A = #$0F sets flags from RDFLG; the N flag reflects RDFLG bit 7.
3. If RDFLG bit 7 is clear (BPL), the handler is not in "waiting for zeros" mode and branches to the load/sync entry RD20 (not shown here).
4. If RDFLG bit 7 is set (waiting-for-zeros):
   - Load DIFF ($B5). If DIFF != 0 branch to RD12 (FA86) which clears RDFLG (LDA #$00 ; STA $AA) — "new mode is wait for sync".
   - If DIFF == 0 then load FSBLK ($BE) and decrement X (DEX). The code treats FSBLK specially:
     - If the decremented value is non-zero (BNE to PREND), the code exits with no error (first-good case).
     - If the decremented value is zero (fall-through), set LBERR (#$08) and JSR UDST ($FE1C) to report a long-block error, then exit.
5. All paths ultimately JMP PREND ($FEBC) to finish.

This block therefore decides, before entering the main data-load flow, whether:
- Bytes should be ignored until the zero-run ends;
- RDFLG should be reset to start a sync/countdown;
- A long-block error (LBERR) should be reported (via UDST) depending on FSBLK and DIFF.

Symbolic error codes found in the source:
- SPERR = 16
- CKERR = 32
- SBERR = 4
- LBERR = 8

Cross-references (other KERNAL blocks that continue the flow):
- RD20 / RD200 — load/sync and block start handling (branches here when not waiting for zeros).
- finish_byte_and_newchar_call — expands on RADJ stored FSBLK and how control arrives here to handle an assembled byte.

## Source Code
```asm
                                ;*************************************************
                                ;* BYTE HANDLER OF CASSETTE READ                 *
                                ;*                                               *
                                ;* THIS PORTION OF IN LINE CODE IS PASSED THE    *
                                ;* BYTE ASSEMBLED FROM READING TAPE IN OCHAR.    *
                                ;* RER IS SET IF THE BYTE READ IS IN ERROR.      *
                                ;* REZ IS SET IF THE INTERRUPT PROGRAM IS READING*
                                ;* ZEROS.  RDFLG TELLS US WHAT WE ARE DOING.     *
                                ;* BIT 7 SAYS TO IGNORE BYTES UNTIL REZ IS SET   *
                                ;* BIT 6 SAYS TO LOAD THE BYTE. OTHERWISE RDFLG  *
                                ;* IS A COUNTDOWN AFTER SYNC.  IF VERCK IS SET   *
                                ;* WE DO A COMPARE INSTEAD OF A STORE AND SET    *
                                ;* STATUS.  FSBLK COUNTS THE TWO BLOCKS. PTR1 IS *
                                ;* INDEX TO ERROR TABLE FOR PASS1.  PTR2 IS INDEX*
                                ;* TO CORRECTION TABLE FOR PASS2.                *
                                ;*************************************************
                                ;
                                SPERR=16
                                CKERR=32
                                SBERR=4
                                LBERR=8
                                ;
.,FA70 A9 0F    LDA #$0F        RD15   LDA #$F
                                ;
.,FA72 24 AA    BIT $AA         BIT    RDFLG           ;TEST FUNCTION MODE
.,FA74 10 17    BPL $FA8D       BPL    RD20            ;NOT WAITING FOR ZEROS
                                ;
.,FA76 A5 B5    LDA $B5         LDA    DIFF            ;ZEROS YET?
.,FA78 D0 0C    BNE $FA86       BNE    RD12            ;YES...WAIT FOR SYNC
.,FA7A A6 BE    LDX $BE         LDX    FSBLK           ;IS PASS OVER?
.,FA7C CA       DEX             DEX                    ;...IF FSBLK ZERO THEN NO ERROR (FIRST GOOD)
.,FA7D D0 0B    BNE $FA8A       BNE    RD10            ;NO...
                                ;
.,FA7F A9 08    LDA #$08        LDA    #LBERR
.,FA81 20 1C FE JSR $FE1C       JSR    UDST            ;YES...LONG BLOCK ERROR
.,FA84 D0 04    BNE $FA8A       BNE    RD10            ;BRANCH ALWAYS
                                ;
.,FA86 A9 00    LDA #$00        RD12   LDA #0
.,FA88 85 AA    STA $AA         STA    RDFLG           ;NEW MODE IS WAIT FOR SYNC
.,FA8A 4C BC FE JMP $FEBC       RD10   JMP PREND       ;EXIT...DONE
```

## References
- "finish_byte_and_newchar_call" — expands on RADJ stored FSBLK and then control flows here to handle the assembled byte per RDFLG
- "load_sync_and_block_start_handling" — expands on If in load mode, flow branches to RD20/RD200 to configure address pointers and data mode

## Labels
- RDFLG
- DIFF
- FSBLK
- SPERR
- CKERR
- SBERR
- LBERR
