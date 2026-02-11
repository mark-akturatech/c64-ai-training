# Save A as integer byte and prepare FAC1 for ABS/normalisation ($BC3C-$BC55)

**Summary:** Saves accumulator (A) as FAC1 mantissa byte ($62), clears FAC1 mantissa bytes and rounding/sign bytes, sets FAC1 exponent ($61) to $88, complements/rotates mantissa1 to move sign into carry, then JMPs to the ABS+normalise routine at $B8D2. Search terms: FAC1, mantissa, exponent $61, mantissa1 $62, rounding byte $70, ABS+normalise $B8D2.

## Description
This routine converts the current A value into FAC1's internal integer representation and prepares FAC1 for the ABS+normalise entry point. Steps:

- Store A into FAC1 mantissa byte 1 ($62) — this preserves the integer/sign indicator.
- Clear FAC1 mantissa byte 2 ($63).
- Load X with #$88 — prepares the exponent value to be used for FAC1 exponent.
- Complement FAC1 mantissa1 (EOR #$FF) then ROL it: the complement+rotate sequence moves the sign bit into the processor carry flag (used by downstream code) while inverting the mantissa byte.
- Clear FAC1 mantissa bytes 3 and 4 ($64, $65).
- Store X (#$88) into FAC1 exponent ($61).
- Clear FAC1 rounding byte ($70).
- Clear FAC1 sign byte ($66) (bit 7 cleared).
- Jump to ABS+normalise at $B8D2 to perform absolute-value handling and normalisation on FAC1.

All addresses used are zero-page FAC1 fields (not hardware registers). The code leaves the sign state reflected via the carry and ensures FAC1 mantissa/exponent/rounding are in a consistent state before normalisation.

## Source Code
```asm
.,BC3C 85 62    STA $62         save FAC1 mantissa 1
.,BC3E A9 00    LDA #$00        clear A
.,BC40 85 63    STA $63         clear FAC1 mantissa 2
.,BC42 A2 88    LDX #$88        set exponent
                                set exponent = X, clear FAC1 3 and 4 and normalise
.,BC44 A5 62    LDA $62         get FAC1 mantissa 1
.,BC46 49 FF    EOR #$FF        complement it
.,BC48 2A       ROL             sign bit into carry
                                set exponent = X, clear mantissa 4 and 3 and normalise FAC1
.,BC49 A9 00    LDA #$00        clear A
.,BC4B 85 65    STA $65         clear FAC1 mantissa 4
.,BC4D 85 64    STA $64         clear FAC1 mantissa 3
                                set exponent = X and normalise FAC1
.,BC4F 86 61    STX $61         set FAC1 exponent
.,BC51 85 70    STA $70         clear FAC1 rounding byte
.,BC53 85 66    STA $66         clear FAC1 sign (b7)
.,BC55 4C D2 B8 JMP $B8D2       do ABS and normalise FAC1
```

## References
- "perform_sgn" — expands on uses of the sign result saved in A to create an integer byte
- "abs_fac1" — clears the sign bit and returns; this code prepares FAC1 then jumps to ABS+normalise
