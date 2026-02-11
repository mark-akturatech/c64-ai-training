# KERNAL: TSTOP and STOP handling (labels STOP3/STOP4) ($F8D0-$F8E1)

**Summary:** Commodore 64 KERNAL STOP handling at $F8D0 calls the generic STOP routine ($FFE1), tests for STOP-key, turns off cassette motor via TNIF ($FC93), sets the failure flag (SEC), pops two bytes from the stack (PLA), clears/deallocates IRQTMP (STA $02A0), and returns (RTS). Searchable terms: $F8D0, $F8D6, $F8DC, $02A0 (IRQTMP), JSR $FFE1, JSR $FC93, SEC, PLA, RTS.

## Description
This KERNAL fragment provides centralized handling of the STOP key condition and exposes two small labels (STOP3 and STOP4) used by other routines for immediate-stop handling.

Flow:
- JSR $FFE1 (labelled TSTOP in this chunk) calls the generic STOP test/routine.
- CLC is executed with the source comment "ASSUME NO STOP"; a following BNE branches to STOP4 when no STOP has occurred (comment: "WE WERE RIGHT").
- If the branch is not taken (STOP key detected), the code:
  - Calls TNIF ($FC93) to turn off cassette activity.
  - Sets the carry via SEC to indicate a failure flag.
  - Executes two PLA instructions to "back one square" (pops two bytes from the stack, reversing a prior push).
  - Loads #$00 (STOP3 label) and stores it to $02A0 (IRQTMP+1) to deallocate the saved IRQ pointer.
  - Returns (RTS) at the STOP4 label.

The labels STOP3 and STOP4 are provided so other KERNAL code (e.g., tape/block read/write stop paths) can branch into this STOP handling to perform consistent cleanup and return behavior.

## Source Code
```asm
.,F8D0 20 E1 FF JSR $FFE1       TSTOP  JSR STOP        ;STOP KEY DOWN?
.,F8D3 18       CLC             CLC                    ;ASSUME NO STOP
.,F8D4 D0 0B    BNE $F8E1       BNE    STOP4           ;WE WERE RIGHT
                                ;
                                ;STOP KEY DOWN...
                                ;
.,F8D6 20 93 FC JSR $FC93       JSR    TNIF            ;TURN OFF CASSETTES
.,F8D9 38       SEC             SEC                    ;FAILURE FLAG
.,F8DA 68       PLA             PLA                    ;BACK ONE SQUARE...
.,F8DB 68       PLA             PLA
                                ;
                                ; LDA #0 ;STOP KEY FLAG
                                ;
.,F8DC A9 00    LDA #$00        STOP3  LDA #0          ;DEALLOCATE IRQTMP
.,F8DE 8D A0 02 STA $02A0       STA    IRQTMP+1        ;IF C-SET THEN STOP KEY
.,F8E1 60       RTS             STOP4  RTS
```

## Key Registers
- $02A0 - Zero Page - IRQTMP+1 (deallocate saved IRQ pointer)

## References
- "tape_completion_wait_loop" — called repeatedly from the wait loop to check for STOP key
- "block_entry_read_write_setup" — branches to TWRT3 / TRD stop handling which eventually use this STOP handling

## Labels
- STOP3
- STOP4
