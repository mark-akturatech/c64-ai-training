# SETNAM (KERNAL) — save filename data ($FDF9-$FDFF)

**Summary:** KERNAL helper routine vectored from $FFBD (SETNAM) that stores filename length and pointer into zero page FNLEN/FNADR ($B7, $BB/$BC). On entry A=filename length, X/Y=address of filename; routine performs STA/STX/STY then RTS.

## Description
This routine (at $FDF9) is the implementation used by the KERNAL SETNAM vector ($FFBD). It saves the filename metadata provided by the caller:

- Input on entry:
  - A = filename length (number of characters)
  - X/Y = 16-bit pointer to filename in memory (low byte in X, high byte in Y)
- Side effects:
  - Stores A -> FNLEN ($B7)
  - Stores X -> FNADR low ($BB)
  - Stores Y -> FNADR high ($BC)
- Returns with RTS.

Behavior is minimal and atomic: three zero-page stores followed by an RTS. No flags or additional state are modified beyond the zero-page locations listed above.

## Source Code
```asm
                                *** SETNAM: SAVE FILENAME DATA
                                The KERNAL routine SETNAM ($ffbd) jumps to this routine.
                                On entry, A-reg holds the length of the filename, and X/Y
                                the address in mem to the filename.
.,FDF9 85 B7    STA $B7         store length of filename in FNLEN
.,FDFB 86 BB    STX $BB         store pointer to filename in FNADDR
.,FDFD 84 BC    STY $BC
.,FDFF 60       RTS
```

## Key Registers
- $00B7 - Zero Page - FNLEN: filename length stored by SETNAM
- $00BB-$00BC - Zero Page - FNADR: filename pointer low/high stored by SETNAM

## References
- "print_filename" — expands on uses of FNADR/FNLEN when printing filenames

## Labels
- SETNAM
- FNLEN
- FNADR
