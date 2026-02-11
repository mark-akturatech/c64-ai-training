# INT() implementation for FAC1 (ROM disassembly $BCCC-$BCE6)

**Summary:** Implements INT() for FAC1 in the C64 ROM: checks FAC1 exponent against max-integer ($A0), returns if already integer or too large, otherwise converts FAC1 from floating to fixed, saves rounding and sign bytes, toggles sign for two's-complement handling, rotates sign into carry, sets exponent to $A0, saves mantissa byte for power-function use, then jumps to ABS+normalise ($B8D2).

## Implementation
This routine truncates the fractional part of FAC1 (floating point accumulator 1) to produce an integer representation when appropriate.

Flow:
- Load FAC1 exponent ($61) and compare with max-integer exponent #$A0.
  - If exponent >= $A0 the value is already an integer or too large to have a fractional part; branch out (BCS) and exit.
- If exponent < $A0:
  - JSR to convert FAC1 floating to fixed (subroutine at $BC9B). This obtains an integer representation suitable for truncation.
  - Save FAC1 rounding byte in $70 (STY $70).
  - Load FAC1 sign byte ($66), save it (STY $66), then EOR #$80 to toggle the sign bit and ROL to shift that toggled sign into the carry. This sequence preserves sign information and prepares two's-complement carry handling.
  - Set FAC1 exponent to #$A0 (LDA #$A0; STA $61) to mark it as an integer result.
  - Save FAC1 mantissa byte 4 ($65) into $07 for later use by the power function.
  - JMP to $B8D2 to perform ABS and normalise FAC1 (finish INT()).

Registers/memory used (names from ROM context):
- $61 — FAC1 exponent
- $65 — FAC1 mantissa byte 4
- $66 — FAC1 sign (bit 7)
- $70 — saved FAC1 rounding byte
- $07 — temporary save of FAC1 mantissa4 for power function

## Source Code
```asm
.,BCCC A5 61    LDA $61         get FAC1 exponent
.,BCCE C9 A0    CMP #$A0        compare with max int
.,BCD0 B0 20    BCS $BCF2       exit if >= (allready int, too big for fractional part!)
.,BCD2 20 9B BC JSR $BC9B       convert FAC1 floating to fixed
.,BCD5 84 70    STY $70         save FAC1 rounding byte
.,BCD7 A5 66    LDA $66         get FAC1 sign (b7)
.,BCD9 84 66    STY $66         save FAC1 sign (b7)
.,BCDB 49 80    EOR #$80        toggle FAC1 sign
.,BCDD 2A       ROL             shift into carry
.,BCDE A9 A0    LDA #$A0        set new exponent
.,BCE0 85 61    STA $61         save FAC1 exponent
.,BCE2 A5 65    LDA $65         get FAC1 mantissa 4
.,BCE4 85 07    STA $07         save FAC1 mantissa 4 for power function
.,BCE6 4C D2 B8 JMP $B8D2       do ABS and normalise FAC1
```

## References
- "convert_fac1_floating_to_fixed" — expands on the routine used to obtain integer representation when truncating fractional part
- "abs_fac1" — expands on INT() finishing by doing ABS and normalising FAC1