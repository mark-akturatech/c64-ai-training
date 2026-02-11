# BITS ($0068)

**Summary:** Zero-page address $0068 (decimal 104), label BITS, is the overflow byte for Floating Point Accumulator #1 (FAC1); it is used as intermediate storage during integer or text-string to floating-point conversions to hold overflowed least-significant digits.

## Floating Point Overflow Byte
This location contains the overflow byte used by the BASIC floating-point routines. During conversion of an integer or a text string into the FAC1 floating-point format, low-order digits that overflow the main mantissa are stored temporarily in BITS ($0068) as part of the intermediate processing and rounding steps.

## Key Registers
- $0068 - Zero Page - FAC1 overflow byte (BITS): holds overflowed least-significant digits during integer/text-to-floating-point conversion.

## References
- "fac1_fields_exponent_mantissa_sign" — expands on role of BITS in FAC1 conversion processes
- "facov_rounding_overflow_byte" — expands on additional low-order mantissa storage for rounding/accuracy

## Labels
- BITS
