# SGNFLG ($67) - Number of Terms in Series Evaluation

**Summary:** SGNFLG is a one-byte zero-page variable at $0067 (decimal 103) that stores the count of separate terms (evaluations) required when resolving complex mathematical expressions; referenced by the formula/series evaluation routines and related to temporary table pointer fbufpt and FAC1 fields.

## Description
SGNFLG (address $0067 / 103) holds the number of separate sub‑evaluations the formula evaluator must perform to reduce a complex expression to a single term. The evaluator uses this count to iterate over intermediate terms, allocate or index into a temporary evaluation table (see fbufpt), and coordinate operations with FAC1 (the floating accumulator — exponent/mantissa/sign fields) when combining results from multiple terms.

- Storage: single byte at zero page $0067.
- Purpose: loop/control count for multi-term expression resolution in the math/formula routines.
- Interactions: referenced alongside the temporary buffer pointer (fbufpt) and FAC1 fields during multi-term evaluations.

## Key Registers
- $0067 - Zero Page - Number of terms in a series/formula evaluation (used by formula evaluation routines)

## References
- "fbufpt_series_evaluation_pointer" — expands on the pointer to the temporary table used during series/formula evaluation
- "fac1_fields_exponent_mantissa_sign" — expands on relation to FAC1 during multi-term evaluations

## Labels
- SGNFLG
