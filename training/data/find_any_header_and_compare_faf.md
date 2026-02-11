# FAF ($F7EA-$F80C) — Find Any Header then Compare Filename (KERNAL)

**Summary:** KERNAL routine FAF ($F7EA) calls FAH to find the next tape header and, on success, compares the tape header filename bytes (starting at header offset $05) to the supplied filename at FNADR for FNLEN bytes using zero-page temporaries T1/T2. Returns with carry clear on full match, carry set if FAH fails or a mismatch causes FAH to be retried.

## Operation
FAF performs these steps:

- JSR FAH ($F72C) to locate the next tape header.
  - If FAH fails it returns with Carry set; FAF branches on BCS to its failure RTS and returns with Carry set.
- On successful FAH, FAF sets up offsets:
  - T2 ($9F) := 5 — starting offset in the tape header (header byte index $05).
  - T1 ($9E) := 0 — starting offset into the supplied filename (FNADR).
- The routine compares FNLEN ($B7) characters:
  - It loads A from (FNADR),Y with Y = T1 (LDA ($BB),Y).
  - It loads Y = T2 and compares A with (TAPE1),Y (CMP ($B2),Y).
  - On mismatch (BNE), FAF branches back to FAH to search for the next header (carry remains set from FAH failure semantics).
  - On match, increments T1 and T2 and repeats until T1 equals FNLEN.
- When all requested characters match, FAF clears the carry (CLC) and returns (RTS). Carry clear indicates success.

Notes on addressing and side-effects:
- Uses indirect, Y-indexed addressing: LDA (FNADR),Y and CMP (TAPE1),Y.
- Zero-page temporaries modified: $9E (T1) and $9F (T2). Y and A are modified by the routine.
- The routine relies on FAH's behavior to locate the next header; mismatches cause a loop that re-invokes FAH.
- Success condition is equality for all FNLEN bytes; on success CLC is executed before RTS. On FAH failure FAF returns with carry set.

## Source Code
```asm
.,F7EA 20 2C F7 JSR $F72C       ; FAF    JSR FAH         ;FIND ANY HEADER
.,F7ED B0 1D    BCS $F80C       ;       BCS FAF40       ;FAILED

; SUCCESS...SEE IF RIGHT NAME

.,F7EF A0 05    LDY #$05        ;       LDY #5          ;OFFSET INTO TAPE HEADER
.,F7F1 84 9F    STY $9F         ;       STY T2
.,F7F3 A0 00    LDY #$00        ;       LDY #0          ;OFFSET INTO FILE NAME
.,F7F5 84 9E    STY $9E         ;       STY T1
.,F7F7 C4 B7    CPY $B7         ; FAF20  CPY FNLEN      ;COMPARE THIS MANY
.,F7F9 F0 10    BEQ $F80B       ;       BEQ FAF30       ;DONE

.,F7FB B1 BB    LDA ($BB),Y     ;       LDA (FNADR),Y
.,F7FD A4 9F    LDY $9F         ;       LDY T2
.,F7FF D1 B2    CMP ($B2),Y     ;       CMP (TAPE1),Y
.,F801 D0 E7    BNE $F7EA       ;       BNE FAF           ;MISMATCH--TRY NEXT HEADER
.,F803 E6 9E    INC $9E         ;       INC T1
.,F805 E6 9F    INC $9F         ;       INC T2
.,F807 A4 9E    LDY $9E         ;       LDY T1
.,F809 D0 EC    BNE $F7F7       ;       BNE FAF20         ;BRANCH ALWAYS

.,F80B 18       CLC             ; FAF30  CLC            ;SUCCESS FLAG
.,F80C 60       RTS             ; FAF40  RTS
                                .END
```

## References
- "find_any_header_fah" — expands on FAH which FAF calls to locate tape headers
- "tape_header_write_tapeh" — explains TAPEH construction of headers that FAF/FAH search for

## Labels
- FAF
- T1
- T2
