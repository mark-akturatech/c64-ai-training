# Signed Division Conventions and Wrapper (6502)

**Summary:** Signed division for 6502 preserves dividend = divisor * quotient + remainder; two common conventions are floored division and toward-zero division. Implemented as a wrapper around an unsigned division routine (e.g. two_byte_division_routine) by computing sign (EOR of sign bits), taking absolute values, calling unsigned division, then adjusting quotient and remainder (see negation_methods).

## Overview
Signed division must preserve the invariant:
dividend = divisor * quotient + remainder

For unsigned division the quotient is always the floor of the true mathematical quotient (quotient <= mathematical quotient) and remainder is non‑negative. For signed division there are two commonly used conventions which differ in how they handle fractional results and the sign of the remainder.

## Conventions
- Floored division
  - If the true mathematical quotient has a fractional part, the quotient is chosen to be the floor (i.e., less than or equal to the mathematical quotient; more negative if negative).
  - The remainder is always non‑negative.
- Toward‑zero division
  - If the true mathematical quotient has a fractional part, the fractional part is truncated toward zero.
  - The remainder has the sign of the dividend.

(Note: these are the two conventions discussed; the wrapper implementation differs accordingly.)

## Wrapper algorithm (high level)
1. Determine sign of the quotient:
   - Compute sign = (sign of dividend) XOR (sign of divisor) — in 6502 code this is commonly done by EOR of the high bytes' sign bits.
2. Convert both dividend and divisor to positive magnitudes:
   - If a value is negative, negate it (two's complement) to produce absolute values. (See negation_methods.)
3. Call the unsigned division core routine (two_byte_division_routine) using the positive magnitudes.
   - The unsigned routine returns a non‑negative quotient and a non‑negative remainder satisfying the unsigned invariant.
4. Adjust quotient and remainder according to the chosen convention:
   - Floored division:
     - If the quotient sign is negative, negate the unsigned quotient (two's complement) to produce the signed quotient.
     - Leave the remainder unchanged (it stays non‑negative).
   - Toward‑zero division:
     - If the quotient sign is negative:
       - Negate the quotient.
       - Add 1 to that negated quotient. 
       - If the original dividend was negative, negate the remainder (so remainder gets dividend's sign).
     - If quotient sign is positive:
       - Quotient and remainder from unsigned routine are already correct (remainder non‑negative).

## Implementation notes
- The wrapper mirrors the structure of a signed multiplication wrapper: decide sign, take absolute values, call unsigned core, then restore sign(s).
- Low‑level details:
  - Computing sign is often done by XOR/EOR of the high bytes (sign bits) of dividend and divisor.
  - Making numbers positive and later negating quotient/remainder uses standard two's complement negation routines (see negation_methods).
- The core unsigned routine is a drop-in: two_byte_division_routine returns unsigned quotient and remainder used unchanged except for the sign adjustments above.

## References
- "two_byte_division_routine" — expands on the unsigned core division routine used by the wrapper
- "negation_methods" — details methods used to negate two-byte values and adjust quotient/remainder signs