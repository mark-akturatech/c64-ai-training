# FAC2 (Floating Point Accumulator #2) — ARGEXP/ARGHO/ARGSGN ($69-$6E)

**Summary:** FAC2 subfields: ARGEXP $69 (exponent), ARGHO $6A-$6D (4-byte mantissa), ARGSGN $6E (sign). Stored in zero page/BASIC floating-point format and uses the same byte layout as FAC1.

## Description
FAC2 is the second floating-point accumulator used by the BASIC floating-point routines. Its subfields occupy consecutive zero-page bytes:

- ARGEXP ($69) — exponent byte for FAC2.
- ARGHO ($6A-$6D) — four mantissa bytes for FAC2 (high-order bytes).
- ARGSGN ($6E) — sign byte for FAC2.

The byte layout and interpretation are identical to FAC1 (see FAC1 for exponent bias, mantissa normalization, and sign conventions). These locations are used by BASIC floating-point operations that reference the second accumulator (FAC2).

## Source Code
```text
105           $69            ARGEXP
Floating Point Accumulator #2: Exponent

106-109       $6A-$6D        ARGHO
Floating Point Accumulator #2: Mantissa

110           $6E            ARGSGN
Floating Point Accumulator #2: Sign

Note: Format is the same as FAC1.
```

## Key Registers
- $0069 - Zero page (BASIC floating-point) - ARGEXP: FAC2 exponent
- $006A-$006D - Zero page (BASIC floating-point) - ARGHO: FAC2 mantissa (4 bytes)
- $006E - Zero page (BASIC floating-point) - ARGSGN: FAC2 sign

## References
- "fac2_accumulator_overview" — expands on summary of FAC2's purpose
- "arisgn_signed_comparison_result" — expands on comparison result between FAC1 and FAC2 signs

## Labels
- ARGEXP
- ARGHO
- ARGSGN
