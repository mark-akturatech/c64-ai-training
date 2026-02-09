# ARISGN ($6F)

**Summary:** ARISGN at $006F is the result byte of a signed comparison between the two floating-point accumulators (FAC1 and FAC2); 0 = like signs, $FF (255) = unlike signs.

## Description
ARISGN stores the sign-comparison result of Accumulator 1 (FAC1) versus Accumulator 2 (FAC2) used by the floating-point routines. Its value is set during signed comparisons:

- 0  — FAC1 and FAC2 have like signs.
- $FF (255) — FAC1 and FAC2 have unlike signs.

This byte is consulted by routines that need to know whether the two floating-point accumulators share the same sign (positive/negative) when performing signed comparison operations.

## Key Registers
- $006F - Floating-point status (FAC1/FAC2 sign comparison result) - 0 = like signs, $FF = unlike signs

## References
- "fac1_fields_exponent_mantissa_sign" — FAC1 sign semantics and field layout  
- "fac2_fields_exponent_mantissa_sign" — FAC2 sign semantics and field layout