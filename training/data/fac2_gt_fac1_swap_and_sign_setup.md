# FAC2 > FAC1 case — ROM floating-point subtraction (addresses $B881-$B891)

**Summary:** Handles the case FAC2 > FAC1 in the C64 ROM floating-point subtraction path: saves FAC1 exponent and sign, fetches FAC2 sign, forms two's complement of A (preparing sign/magnitude handling), clears FAC2 rounding byte, and sets the index to FAC1 exponent ($61) so the larger-magnitude operand becomes the minuend. Search terms: $B881, FAC1, FAC2, two's complement, rounding byte, exponent swap.

## Description
This sequence executes when the exponent/magnitude comparison determines FAC2 is larger than FAC1. It:

- Saves FAC1's exponent into $61 (FAC1 exponent slot).
- Loads the sign bit (bit 7) of FAC2 from $6E and stores it into $66 (FAC1 sign slot), effectively replacing FAC1's sign with FAC2's sign so the operand with larger magnitude becomes the minuend.
- Complements the accumulator (EOR #$FF) then ADC #$00 to form a two's-complement negation of A (ones' complement + 1, carry set).
- Clears Y and stores it into $56 to zero FAC2's rounding byte.
- Loads X with #$61 to point further processing at FAC1's exponent address (so the formerly larger operand is treated as FAC1).
- Uses BNE $B897 which will branch (LDX #$61 sets Z=0, so BNE is taken).

This path prepares operands and internal flags so the subtraction implementation will subtract the smaller mantissa from the larger one, with correct sign handling and rounding byte cleared.

## Source Code
```asm
.,B881 84 61    STY $61         save FAC1 exponent
.,B883 A4 6E    LDY $6E         get FAC2 sign (b7)
.,B885 84 66    STY $66         save FAC1 sign (b7)
.,B887 49 FF    EOR #$FF        complement A
.,B889 69 00    ADC #$00        +1, twos complement, carry is set
.,B88B A0 00    LDY #$00        clear Y
.,B88D 84 56    STY $56         clear FAC2 rounding byte
.,B88F A2 61    LDX #$61        set index to FAC1 exponent address
.,B891 D0 04    BNE $B897       branch always
```

## References
- "save_rounding_and_load_exponents" — expands on branching condition that leads here
- "exponent_diff_and_shift_smaller_mantissa" — expands on next step: compute exponent difference and shift smaller mantissa
- "mantissa_subtract_sequence" — expands on subtraction path uses the larger-magnitude operand chosen here
