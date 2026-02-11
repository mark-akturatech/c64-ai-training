# FAC1 final normalisation after overflow test ($B936)

**Summary:** 6502 assembly (Commodore 64 ROM) handling overflow after the final exponent test at $B936; tests carry (BCC), increments FAC1 exponent ($61), branches to overflow/warmstart on wrap (BEQ $B97E), then RORs FAC1 mantissa bytes ($62-$65) and rounding byte ($70) to finalise normalisation, then RTS.

## Description
This routine finalises normalization for FAC1 when the final exponent test reports an overflow via the carry flag.

Flow:
- BCC $B946: if Carry = 0 (no overflow), skip normalization and return (RTS).
- INC $61: increment FAC1 exponent byte at $61. If the increment wraps to zero (zero flag set), BEQ $B97E branches to the overflow error / warm-start handler.
- On successful increment, perform a sequence of ROR instructions on FAC1 mantissa bytes and the rounding byte to shift the mantissa right one bit and include the rounding byte into the result. (ROR shifts right one bit; bit0 → Carry, old Carry → bit7.)
- RTS at $B946 returns to the caller.

This sequence is the final step after an addition normalization routine — if the exponent increment overflows, control transfers to the ROM's overflow/warmstart handler; otherwise the mantissa and rounding byte are rotated right to restore a normalised mantissa and return.

## Source Code
```asm
.,B936 90 0E    BCC $B946       exit if no overflow
                                normalise FAC1 for C=1
.,B938 E6 61    INC $61         increment FAC1 exponent
.,B93A F0 42    BEQ $B97E       if zero do overflow error then warm start
.,B93C 66 62    ROR $62         shift FAC1 mantissa 1
.,B93E 66 63    ROR $63         shift FAC1 mantissa 2
.,B940 66 64    ROR $64         shift FAC1 mantissa 3
.,B942 66 65    ROR $65         shift FAC1 mantissa 4
.,B944 66 70    ROR $70         shift FAC1 rounding byte
.,B946 60       RTS             
```

## References
- "post_add_normalisation_shift_loop" — expands on overflow case arising from addition normalization
- "underflow_and_exponent_adjustment" — complements the underflow/exponent adjustment logic

## Labels
- FAC1
