# KERNAL ROM — LODING subroutine ($F5D2-$F5DA)

**Summary:** KERNAL routine at $F5D2 checks the verify flag (VERCK at $0093), loads a message index into Y (#$49 or #$59) to select "LOADING" or "VERIFYING" (message table offsets), and jumps to SPMSG ($F12B) to print the chosen message.

## LODING subroutine (behavior)
This short KERNAL entry selects which of two status messages to print before a tape/IEEE transfer:

- LDY #$49 — default selects the "LOADING" message (comment: MS10-MS1).
- LDA $93 — loads VERCK (verify check flag) from $0093 (VERCK = verify flag).
- BEQ skip — if zero, keep the "LOADING" index.
- LDY #$59 — if VERCK ≠ 0, select the "VERIFYING" message (comment: MS21-MS1).
- JMP SPMSG ($F12B) — transfers control to SPMSG to print the message (SPMSG performs the printing and then returns to the original caller).

Execution range: $F5D2–$F5DA. The routine does not RTS itself; it relies on SPMSG to perform the print and return to the caller.

**[Note: Source may contain an error — original comment spells "VERIFING" (single I).]**

## Source Code
```asm
.,F5D2 A0 49    LDY #$49        LODING LDY #MS10-MS1   ;ASSUME 'LOADING'
.,F5D4 A5 93    LDA $93         LDA    VERCK           ;CHECK FLAG
.,F5D6 F0 02    BEQ $F5DA       BEQ    LD410           ;ARE DOING LOAD
.,F5D8 A0 59    LDY #$59        LDY    #MS21-MS1       ;ARE 'VERIFYING'
.,F5DA 4C 2B F1 JMP $F12B       LD410  JMP SPMSG
                                .END
```

## References
- "ieee_load_open_and_address_fetch" — Called before starting IEEE byte transfer to inform the user
- "tape_addressing_and_block_load" — Called before TRD tape block load to announce the load
- "ieee_receive_and_store_loop" — Used to indicate the beginning of the receive/store loop

## Labels
- LODING
- VERCK
