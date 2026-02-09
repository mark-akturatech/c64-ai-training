# CHRGOT: ASCII Numeric Test Using SEC/SBC Trick

**Summary:** This routine tests whether a character is an ASCII digit ($30–$39), a colon ($3A), or a space ($20). It employs a unique SEC/SBC sequence to preserve the accumulator while setting the carry flag if the character is non-numeric and the zero flag if the character is null.

**Description**

The `CHRGOT` routine processes a character to determine its type and takes appropriate actions based on the result. Key steps include:

- **Load Character:** The character is loaded from the address pointed to by `TXTPTR` ($7A).

- **Compare with Colon:** If the character is a colon ($3A), the routine exits with the zero flag set.

- **Compare with Space:** If the character is a space ($20), the routine jumps to `CHRGET` to fetch the next character.

- **Numeric Test Using SEC/SBC Trick:** A sequence of `SEC` and `SBC` instructions is used to test if the character is numeric:

  - The accumulator remains unchanged.

  - The carry flag is set if the original character is less than $30 (non-numeric).

  - The zero flag is set if the original character is $00.

- **Exit:** The routine returns to the caller.

This method provides a compact, branchless test for numeric characters while preserving the accumulator and setting the processor flags accordingly.

## Source Code

```assembly
; CHRGOT: Load character, test for colon/space/numeric using SEC/SBC trick
CHRGOT  LDA ($7A),Y       ; Load character from address pointed to by TXTPTR
        CMP #$3A          ; Compare with ':' (0x3A)
        BEQ EXIT          ; If equal, exit (Z set)

        CMP #$20          ; Compare with space (0x20)
        BEQ CHRGET        ; If space, fetch next character

        ; SEC/SBC sequence: A unchanged afterwards
        SEC
        SBC #$30
        SEC
        SBC #$D0

        ; After above:
        ; - A is unchanged
        ; - C = 1 if original A < $30 (non-numeric)
        ; - Z = 1 if original A == #$00
EXIT    RTS
```

## Key Registers

- **TXTPTR ($7A):** Pointer to the current position in the BASIC program text.

## References

- "Commodore 64 Programmer's Reference Guide"
- "Compute!'s Machine Language Routines for the Commodore 64"