# KERNAL: PRINT "SEARCHING" (JSR $F12F) at $F5AF

**Summary:** KERNAL routine that conditionally prints the I/O message "SEARCHING" (via JSR $F12F) depending on MSGFLG ($009D) and, if FNLEN ($00B7) > 0, prints "FOR" then falls through to the filename print routine. Uses LDY and KERNAL message-output vector ($F12F).

## Behavior / Notes
This code performs the following steps:
- Tests the KERNAL I/O message flag MSGFLG ($009D). If the flag indicates "program mode" the routine exits without printing the message.
- If printing is allowed (direct mode), it sets Y to the message index and JSRs $F12F to print "SEARCHING" from the KERNAL I/O message table.
- It then checks FNLEN ($00B7), the current filename length. If zero, the routine exits. If non-zero, it sets Y to the message index for "FOR" and JSRs $F12F to print "FOR" before dropping through to the filename-print routine (see referenced "print_filename").
- Key instructions: LDA $009D / BPL skip-print; LDY #$0C / JSR $F12F to print "SEARCHING"; LDA $00B7 / BEQ skip; LDY #$17 / JSR $F12F to print "FOR".

## Source Code
```asm
.,F5AF A5 9D    LDA $9D         ; MSGFLG, direct or program mode?
.,F5B1 10 1E    BPL $F5D1       ; program mode, don't print, exit
.,F5B3 A0 0C    LDY #$0C
.,F5B5 20 2F F1 JSR $F12F       ; print "SEARCHING"
.,F5B8 A5 B7    LDA $B7         ; FNLEN, length of current filename
.,F5BA F0 15    BEQ $F5D1       ; no name, exit
.,F5BC A0 17    LDY #$17
.,F5BE 20 2F F1 JSR $F12F       ; print "FOR"
```

## Key Registers
- $009D - Zero Page - MSGFLG (I/O message mode: direct vs program)
- $00B7 - Zero Page - FNLEN (length of the current filename)

## References
- "print_filename" — prints the filename after 'SEARCHING'/'FOR'

## Labels
- MSGFLG
- FNLEN
