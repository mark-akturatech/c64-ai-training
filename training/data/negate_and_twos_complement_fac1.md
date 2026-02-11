# Negate FAC1 (two's complement mantissa + rounding)

**Summary:** Negates FAC1 by flipping the sign bit ($0066) and performing a two's-complement on the FAC1 mantissa bytes ($0062-$0065) and the rounding byte ($0070). Uses EOR #$FF (one's complement) then INC to produce two's complement; carries propagate from rounding into mantissa. Returns with RTS.

## Description
This ROM routine takes the FAC1 floating-point accumulator, inverts its sign, and forms the two's-complement of the mantissa and rounding byte so FAC1 becomes the absolute value (negated) and is ready for normalization. Behavior and byte ordering are inferred from the instruction flow:

- Sign:
  - $0066 stores FAC1 sign in bit 7. The routine performs a bitwise complement of that byte (EOR #$FF), effectively flipping the sign bit (and also inverting unused bits).
- Two's-complement of mantissa + rounding byte:
  - The routine takes a one's-complement of mantissa bytes at $0062..$0065 and the rounding byte $0070 with EOR #$FF, then performs INC on the rounding byte to add the +1 required for two's-complement arithmetic.
  - If incrementing the rounding byte does not overflow (BNE), the operation is complete. If the rounding byte overflows (wraps to 0), the INC carries into the mantissa: it increments mantissa byte $0065 (mantissa 4, LSB), then, on its rollover, increments $0064, then $0063, then $0062 (most significant mantissa byte). Each INC is followed by BNE to stop propagation when no further carry is needed.
- Mantissa byte order:
  - The carry propagation order (INC $65, INC $64, INC $63, INC $62) shows $0065 is the least-significant mantissa byte (mantissa 4) and $0062 is the most-significant (mantissa 1).
- Outcome:
  - After these steps FAC1 is negated and the mantissa/rounding are two's-complemented (so numeric sign is flipped). The routine returns via RTS.
- Usage:
  - This routine is called from subtraction/normalize paths that require absolute value handling — see cross-references for related routines.

Notes:
- The code uses EOR #$FF (one's complement) then INC to implement two's complement.
- Unused bits in the sign byte are also inverted by EOR; the routine assumes only bit 7 is meaningful for sign.
- No normalization (shifting) is performed here — this only negates and adjusts mantissa/rounding; normalization happens elsewhere.

## Source Code
```asm
.,B947 A5 66    LDA $66         ; get FAC1 sign (b7)
.,B949 49 FF    EOR #$FF        ; complement it
.,B94B 85 66    STA $66         ; save FAC1 sign (b7)

.,B94D A5 62    LDA $62         ; get FAC1 mantissa 1
.,B94F 49 FF    EOR #$FF        ; complement it
.,B951 85 62    STA $62         ; save FAC1 mantissa 1
.,B953 A5 63    LDA $63         ; get FAC1 mantissa 2
.,B955 49 FF    EOR #$FF        ; complement it
.,B957 85 63    STA $63         ; save FAC1 mantissa 2
.,B959 A5 64    LDA $64         ; get FAC1 mantissa 3
.,B95B 49 FF    EOR #$FF        ; complement it
.,B95D 85 64    STA $64         ; save FAC1 mantissa 3
.,B95F A5 65    LDA $65         ; get FAC1 mantissa 4
.,B961 49 FF    EOR #$FF        ; complement it
.,B963 85 65    STA $65         ; save FAC1 mantissa 4

.,B965 A5 70    LDA $70         ; get FAC1 rounding byte
.,B967 49 FF    EOR #$FF        ; complement it
.,B969 85 70    STA $70         ; save FAC1 rounding byte
.,B96B E6 70    INC $70         ; increment FAC1 rounding byte
.,B96D D0 0E    BNE $B97D       ; exit if no overflow

.,B96F E6 65    INC $65         ; increment FAC1 mantissa 4 (LSB)
.,B971 D0 0A    BNE $B97D       ; finished if no rollover
.,B973 E6 64    INC $64         ; increment FAC1 mantissa 3
.,B975 D0 06    BNE $B97D       ; finished if no rollover
.,B977 E6 63    INC $63         ; increment FAC1 mantissa 2
.,B979 D0 02    BNE $B97D       ; finished if no rollover
.,B97B E6 62    INC $62         ; increment FAC1 mantissa 1 (MSB)
.,B97D 60       RTS              ; return
```

## Key Registers
- $0062-$0065 - RAM - FAC1 mantissa bytes (mantissa 1 = $0062 MSB ... mantissa 4 = $0065 LSB)
- $0066 - RAM - FAC1 sign (bit 7 holds sign)
- $0070 - RAM - FAC1 rounding byte

## References
- "add_fac2_to_fac1_alignment_and_mantissa_operations" — invoked from subtract/normalise path when a negation (absolute) is required
- "overflow_error_and_warm_start" — covers overflow handling from subsequent adjustments and the overflow error path