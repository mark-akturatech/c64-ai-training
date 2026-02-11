# CHRGET relocated to $0073 (KERNAL copy for zeropage)

**Summary:** KERNAL CHRGET routine copied into RAM at $0073 on reset; reads characters via CHRGOT ($EA60), increments TXTPTR low/high ($007A/$007B), treats ':' as terminator and skips spaces, and performs numeric-character conversion using SEC/SBC sequences before returning (RTS).

## Description
This is the CHRGET routine the INITAT sequence copies into RAM starting at $0073 on power-up/reset. Behavior:

- Increments the low byte of TXTPTR ($007A). If it wraps (zero after increment), increments the high byte ($007B).
- Calls the CHRGOT entry at $EA60 to fetch the character pointed to by TXTPTR.
- Compares the fetched character to ':' (CMP #$3A). If the comparison branches, the routine returns (terminator).
- Compares the fetched character to space (CMP #$20); if it is a space, the routine repeats to get the next character.
- For numeric characters, the code performs two SEC/SBC steps: SBC #$30 (subtract ASCII '0') then SBC #$D0 (adjusted value), using SEC before each SBC. The result is left in A when RTS is reached.

**[Note: Source may contain an ambiguity — CMP #$3A followed by BCS tests carry (A >= #$3A), not only equality; comments treating ':' as sole terminator assume input range where that distinction doesn't matter.]**

## Source Code
```asm
.,E3A2 E6 7A    INC $7A         increment <TXTPTR
.,E3A4 D0 02    BNE $E3A8       skip high byte
.,E3A6 E6 7B    INC $7B         increment >TXTPTR
.,E3A8 AD 60 EA LDA $EA60       CHRGOT entry, read TXTPTR
.,E3AB C9 3A    CMP #$3A        colon (terminator), sets (Z).
.,E3AD B0 0A    BCS $E3B9
.,E3AF C9 20    CMP #$20        space, get next character
.,E3B1 F0 EF    BEQ $E3A2
.,E3B3 38       SEC
.,E3B4 E9 30    SBC #$30        zero
.,E3B6 38       SEC
.,E3B7 E9 D0    SBC #$D0
.,E3B9 60       RTS
```

## Key Registers
- $0073 - RAM - Destination start address where CHRGET is copied on reset
- $007A - Zero Page - TXTPTR low (incremented by INC $7A)
- $007B - Zero Page - TXTPTR high (incremented when low wraps)
- $EA60 - KERNAL - CHRGOT entry (reads character at TXTPTR)

## References
- "rndsed_random_seed" — expands on RNDSED data copied into zeropage alongside CHRGET
- "initcz_initialize_basic_ram" — routine that copies CHRGET into RAM at $0073

## Labels
- CHRGET
- CHRGOT
- TXTPTR
