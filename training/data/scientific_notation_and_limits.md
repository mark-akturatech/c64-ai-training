# BASIC floating-point scientific notation (C64)

**Summary:** Describes Commodore 64 BASIC scientific/exponential notation: mantissa, letter E, exponent semantics, exponent range (-39..+38), print formatting (rounded to 9 digits; scientific display for <.01 or >999999999.), representable max/min (+1.70141183E+38 / +2.93873588E-39), overflow/underflow behavior, and conversion examples.

## Structure and meaning
A BASIC floating-point constant in exponential (scientific) notation consists of three parts: the mantissa (a floating-point number), the letter E (meaning ×10), and the exponent (a signed integer). Both mantissa and exponent may be signed.

- E indicates multiplication by a power of ten (for example, 3E3 = 3 × 10^3 = 3000).
- The exponent range in C64 BASIC is -39 to +38. The exponent value tells how many places the decimal point in the mantissa would move: negative moves the decimal left, positive moves it right.
- When results are printed, numbers are rounded to nine significant digits.
- BASIC switches to scientific notation automatically for numbers smaller than 0.01 or larger than 999999999. (i.e., < .01 or > 999,999,999.)

## Limits and error behavior
- Maximum representable positive value: +1.70141183E+38. Calculations producing a larger magnitude cause a runtime ?OVERFLOW ERROR.
- Smallest positive nonzero value: +2.93873588E-39. Calculations producing magnitudes below this value underflow to zero silently (no error message).

## Examples and conversions
(See the Source Code section for a plain listing of the examples below.)
- 235.988E-3  → .235988  (decimal point moved 3 places left)
- 2359E6     → 2359000000.  (decimal point moved 6 places right)
- -7.09E-12  → -.00000000000709
- -3.14159E+5 → -314159.

## References
- "floating_point_constants_and_storage" — expands on floating-point storage formats and representation limits
