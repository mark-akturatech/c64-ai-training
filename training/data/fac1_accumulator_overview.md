# Floating Point Accumulator #1 (FAC1) — $61-$66

**Summary:** FAC1 is a six-byte zero-page floating-point accumulator at $0061-$0066 used by the BASIC interpreter for numeric evaluations and conversions (integer↔float, string↔float). Internally it stores a normalized mantissa and a power-of-two exponent (value = mantissa × 2^exponent).

## Overview
FAC1 is the central accumulator for almost all BASIC numeric operations. It holds the results of evaluations and is the working register for conversion routines that transform integers and text strings into the internal floating-point representation and back again.

Internal format (high-level):
- A normalized mantissa representing a value between 1.0 and just under 2.0 (1.00000... to 1.99999...).
- An exponent that encodes a power of two. The numeric value equals mantissa × 2^exponent.

The BASIC ROM provides multiple routines to manipulate and convert values in FAC1; these routines can be invoked by other ROM routines (and are referenced elsewhere in the ROM). See the entries cited below (locations 3 and 5 and the related FAC1/FAC2 field breakdowns) for detailed field layouts, conversion algorithms, and calling conventions.

## Key Registers
- $0061-$0066 - Zero Page - Floating Point Accumulator 1 (FAC1); six-byte accumulator holding normalized mantissa + exponent used by BASIC for evaluation and conversions

## References
- "Location 3" — referenced BASIC floating-point conversion/manipulation routines
- "Location 5" — referenced related ROM routines / accumulator interactions
- "fac1_fields_exponent_mantissa_sign" — detailed breakdown of FAC1 fields (exponent, mantissa, sign)
- "fac2_accumulator_overview" — overview of the second accumulator (FAC2) used alongside FAC1 for multi-value operations

## Labels
- FAC1
