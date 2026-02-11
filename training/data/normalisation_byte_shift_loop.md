# Normalize FAC1 mantissa (ROM $B8D7-$B8FD)

**Summary:** The ROM routine at $B8D7-$B8FD normalizes FAC1 by shifting its 4-byte mantissa one byte left per iteration, injecting the rounding/guard byte into the low mantissa, clearing the rounding byte, and incrementing an exponent offset by #$08 per shift until the offset reaches #$20. If normalization collapses the exponent to zero, the exponent and sign are cleared, and the routine returns (RTS).

**Description**

This routine normalizes the floating-point accumulator (FAC1) by left-shifting its mantissa until the exponent offset accumulates to #$20 or the exponent becomes zero. Each iteration:

- Moves the higher mantissa bytes down one slot (left-shift by 8 bits): a higher byte is moved into the next lower-addressed mantissa byte.
- Moves the rounding/guard byte into the low mantissa byte and clears the rounding byte.
- Adds #$08 to an exponent offset (A + #$08) and compares it to #$20; if less than #$20, it branches to the loop head to repeat.
- If the exponent is reduced to zero as part of normalization, the code clears the FAC1 exponent and clears the FAC1 sign (bit 7), then returns (RTS).

**Behavioral notes:**

- The routine operates on zero-page FAC1 workspace bytes (see Key Registers).
- The code assumes A contains the running exponent offset before `ADC #$08`, and that Y contains the value used to clear the rounding byte (likely zero). These setup values are established prior to entering the shown snippet.

**Note:** The inline comment "save FAC1 sign" is inconsistent with `LDA #$00` followed by `STA $66` (which clears the sign).

## Source Code

```asm
.,B8D7 A0 00    LDY #$00        ; Initialize Y to 0
.,B8D9 98       TYA             ; Transfer Y to A (A = 0)
.,B8DA 18       CLC             ; Clear carry flag
.,B8DB A6 62    LDX $62         ; Get FAC1 mantissa byte 1
.,B8DD D0 4A    BNE $B929       ; Branch if not zero
.,B8DF A6 63    LDX $63         ; Get FAC1 mantissa byte 2
.,B8E1 86 62    STX $62         ; Save to mantissa byte 1
.,B8E3 A6 64    LDX $64         ; Get FAC1 mantissa byte 3
.,B8E5 86 63    STX $63         ; Save to mantissa byte 2
.,B8E7 A6 65    LDX $65         ; Get FAC1 mantissa byte 4
.,B8E9 86 64    STX $64         ; Save to mantissa byte 3
.,B8EB A6 70    LDX $70         ; Get FAC1 rounding byte
.,B8ED 86 65    STX $65         ; Save to mantissa byte 4
.,B8EF 84 70    STY $70         ; Clear FAC1 rounding byte
.,B8F1 69 08    ADC #$08        ; Add 8 to exponent offset
.,B8F3 C9 20    CMP #$20        ; Compare with 32 (max offset)
.,B8F5 D0 E4    BNE $B8DB       ; Loop if not max

                                ; Clear FAC1 exponent and sign
.,B8F7 A9 00    LDA #$00        ; Clear A
.,B8F9 85 61    STA $61         ; Set FAC1 exponent

                                ; Clear FAC1 sign
.,B8FB 85 66    STA $66         ; Clear FAC1 sign (bit 7)
.,B8FD 60       RTS
```

## Key Registers

- **$61**: FAC1 exponent (cleared when normalization collapses exponent).
- **$62-$65**: FAC1 4-byte mantissa workspace (bytes shifted left by one byte each iteration).
- **$66**: FAC1 sign (bit 7; stored/cleared here) — overlaps with mantissa range per ROM layout.
- **$70**: FAC1 rounding/guard byte (moved into low mantissa then cleared).

## References

- "abs_and_normalise_fac1" — initial setup for this normalization loop.
- "mantissa_add_path" — addition path that may branch into this normalization/testing code.