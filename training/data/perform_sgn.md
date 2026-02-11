# SGN() — wrapper at $BC39 (JSR $BC2B)

**Summary:** Thin ROM wrapper that performs SGN() for FAC1 by calling the sign routine at $BC2B (JSR $BC2B). Returns result in A: $FF = negative, $01 = positive, $00 = zero.

## Description
This entry is a simple wrapper for the SGN operation on FAC1 (floating accumulator 1). At $BC39 it performs a JSR to the sign-detection routine at $BC2B; the sign routine sets A to the sign byte ($FF, $01, or $00) and returns to the caller. No other registers are modified by this wrapper beyond the normal JSR/RTS call behavior.

## Source Code
```asm
.; $BC39
.,BC39 20 2B BC    JSR $BC2B    ; get FAC1 sign, return A = $FF -ve, A = $01 +ve, A = $00 zero
```

## References
- "get_fac1_sign" — implements the SGN logic and returns the sign byte (A = $FF/$01/$00).
- "save_a_as_integer_byte_and_prepare_fac1_for_abs" — subsequent code paths that use the sign result stored in A.