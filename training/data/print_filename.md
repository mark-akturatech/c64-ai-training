# PRINT FILENAME (KERNAL)

**Summary:** Prints the filename pointed to by FNADR ($BB) with length FNLEN ($B7) using the KERNAL CHROUT routine at $FFD2; loops with indirect,Y addressing (LDA ($BB),Y) and calls JSR $FFD2 for each character.

## Description
This KERNAL routine outputs the current filename byte-by-byte. FNLEN ($B7) holds the filename length; FNADR ($BB) is a zero-page pointer to the filename buffer (filename bytes are PETSCII). The routine:

- Loads FNLEN to test for zero length and returns immediately if zero.
- Uses LDA ($BB),Y with Y starting at 0 to fetch each filename character.
- Calls CHROUT ($FFD2) to print the character.
- Increments Y and compares it to FNLEN; repeats until Y == FNLEN.
- Returns with RTS.

Notes on behavior:
- The initial LDY $B7 is used only for the BEQ zero-length test; LDY is then set to #$00 for indexing. The zero-page FNLEN remains unchanged.
- Registers modified: A and Y are used/modified by the routine (Y ends equal to FNLEN on exit). No explicit preservation of other registers is performed.
- CHROUT ($FFD2) expects the character in A (PETSCII) and performs the actual output.

## Source Code
```asm
.; PRINT FILENAME
.; Filename is pointed to by FNADR, and length in FNLEN. The
.; KERNAL routine CHROUT is used to print filename.
.,F5C1 A4 B7    LDY $B7         ; FNLEN, length of current filename
.,F5C3 F0 0C    BEQ $F5D1       ; exit if length == 0
.,F5C5 A0 00    LDY #$00
.,F5C7 B1 BB    LDA ($BB),Y     ; get character in filename
.,F5C9 20 D2 FF JSR $FFD2       ; output (CHROUT)
.,F5CC C8       INY             ; next character
.,F5CD C4 B7    CPY $B7         ; compare with FNLEN
.,F5CF D0 F6    BNE $F5C7       ; loop until Y == FNLEN
.,F5D1 60       RTS             ; return
```

## Key Registers
- $00B7 - Zero Page - FNLEN (length of current filename)
- $00BB - Zero Page - FNADR (pointer to filename buffer, used with indirect,Y)
- $FFD2 - KERNAL ROM - CHROUT (print character in A)

## References
- "print_searching" — expands on called-from PRINT 'SEARCHING' when filename is present

## Labels
- CHROUT
- FNLEN
- FNADR
