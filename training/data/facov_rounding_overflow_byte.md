# FACOV ($70)

**Summary:** FACOV at $70 (decimal 112) is the low-order mantissa byte for Floating Point Accumulator 1 (FAC1) used by the BASIC floating-point routines to hold extra least-significant mantissa figures for intermediate precision and final rounding.

## Description
FACOV holds the extra least-significant byte(s) of FAC1's mantissa when a floating-point number contains more significant figures than fit in the standard four-byte mantissa. These extra LSB figures are retained to:

- extend the accuracy of intermediate mathematical operations, and
- provide data used when rounding the result to the final four-byte mantissa representation.

The location is referenced by the BASIC/floating-point arithmetic code whenever intermediate precision or final rounding requires information beyond the four-byte mantissa normally stored for FAC1.

## Key Registers
- $0070 - BASIC floating-point workspace - FACOV: low-order mantissa byte for FAC1 (extra LSBs for intermediate accuracy and final rounding)

## References
- "fac1_fields_exponent_mantissa_sign" — expands on how extra mantissa precision is applied when operating on FAC1

## Labels
- FACOV
