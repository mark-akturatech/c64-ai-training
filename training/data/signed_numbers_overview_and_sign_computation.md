# Signed multiply/divide on the 6502

**Summary:** Signed arithmetic on the 6502 requires handling two's-complement signs explicitly because bit-shifting instructions (LSR, ROR) are not sign-preserving; the usual strategy is: determine result sign (EOR high bytes -> N flag), convert operands to positive (make absolute), run an unsigned multiply/divide routine, then restore sign (negate result if needed). Mnemonics: LSR, ROR, EOR; flags: N (negative).

## Handling signed numbers

- Problem: Most 6502 multiplication/division routines are written for unsigned values. Instructions that perform logical shifts (LSR, ROR) do not preserve sign and therefore produce incorrect results for two's-complement negative operands.
- Alternate approach (possible but less common): replace LSR/ROR with subroutines that perform arithmetic, sign-preserving shifts. This works but adds overhead and complexity.
- Standard method (recommended):
  1. Compute the sign of the result: if the two operands have the same sign, the result is positive; if different signs, the result is negative.
  2. For two's-complement numbers, the sign of the result can be obtained by EORing the high bytes of the operands. The EOR leaves the sign bit of the result in the high bit of A and in the processor N flag.
  3. Make both operands positive (take absolute values). (See referenced "negation_methods" for details on negation/absolute.)
  4. Run an unsigned multiply/divide routine (existing unsigned routines will be correct for the positive operands).
  5. Apply the sign to the computed result: if the sign determined in step 2 is negative, negate the final product/quotient (see "negation_methods" for negation technique).
- Note: Some simple multiply-by-constant routines happen to work with negative numbers, but any routine that relies on LSR or ROR generally will not.

## References
- "negation_methods" — how to make numbers positive and negate results
- "signed_multiply_wrapper" — example wrapper around an unsigned multiply to handle signed operands

## Mnemonics
- LSR
- ROR
- EOR
