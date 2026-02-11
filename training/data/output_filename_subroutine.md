# KERNAL OUTFN — Output File Name

**Summary:** Checks FNLEN ($00B7) and, if nonzero, outputs the filename bytes addressed by FNADR (pointer at $00BB) using LDA (FNADR),Y and the KERNAL BSOUT vector ($FFD2). Uses LDY/INY/CPY/JSR/RTS loop to print each character.

## Description
OUTFN is a small KERNAL ROM routine that prints a stored filename to the current output device (console). Behavior:

- Test FNLEN ($00B7). If zero, return immediately (no filename).
- If FNLEN > 0 set Y = 0 and enter a loop:
  - LDA (FNADR),Y where FNADR is the two-byte zero-page pointer at $00BB (indirect addressing).
  - JSR $FFD2 (BSOUT) to output the character in A.
  - INY, then compare Y to FNLEN.
  - If Y != FNLEN branch back to load the next character.
- Return with RTS when all filename bytes have been output.

Notes:
- FNADR is stored at zero page $00BB..$00BC (pointer used by LDA (addr),Y).
- BSOUT ($FFD2) is the standard KERNAL character output routine (expects character in A).
- The routine preserves no registers other than those implied by the code (no explicit save/restore).

## Source Code
```asm
                                ;
.,F5C1 A4 B7    LDY $B7         OUTFN  LDY FNLEN       ;IS THERE A NAME?
.,F5C3 F0 0C    BEQ $F5D1       BEQ    LD115           ;NO...DONE
.,F5C5 A0 00    LDY #$00        LDY    #0
.,F5C7 B1 BB    LDA ($BB),Y     LD110  LDA (FNADR)Y
.,F5C9 20 D2 FF JSR $FFD2       JSR    BSOUT
.,F5CC C8       INY             INY
.,F5CD C4 B7    CPY $B7         CPY    FNLEN
.,F5CF D0 F6    BNE $F5C7       BNE    LD110
                                ;
.,F5D1 60       RTS             LD115  RTS
```

## Key Registers
- $00B7 - Zero Page - FNLEN (filename length)
- $00BB - Zero Page - FNADR (pointer to filename, low byte; high byte at $00BC)
- $FFD2 - KERNAL ROM - BSOUT (character output routine)

## References
- "luking_message_subroutine" — expands on use by LUKING to print the filename following "FOR"

## Labels
- OUTFN
- BSOUT
- FNLEN
- FNADR
