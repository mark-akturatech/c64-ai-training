# FIN / FINLOG / NO999 — ASCII string → floating point (used by VAL)

**Summary:** Describes FIN ($BCF3) — the routine called by VAL to convert an ASCII numeric string into the internal 5‑byte floating point accumulator FAC1; FINLOG ($BD7E) — helper to add a signed integer digit into FAC1 during parsing; and NO999 ($BDB3) — table of three floating‑point constants (99,999,999.5; 999,999,999.5; 1,000,000,000) used for range/overflow handling. Mentions related helpers MOVFM/MOVFA and MUL10/DIV10 used during assembly and rounding.

**Description**

**FIN ($BCF3):**
- Entry point used by VAL to parse and convert an ASCII numeric string into the internal 5‑byte floating point accumulator FAC1 (Commodore/Microsoft BASIC 5‑byte FP format). Called after lexical scanning locates a numeric token.
- Handles conversion logic required to turn digit characters and optional sign/decimal/exponent notation into the normalized floating point in FAC1.

**FINLOG ($BD7E):**
- A focused helper used during parsing to incorporate a single ASCII digit (converted to a signed integer) into FAC1.
- Used when assembling integer portions or when applying digit-by-digit accumulation (typically in concert with multiplication/division helpers).

**NO999 ($BDB3):**
- A data table of three floating point constants used during string-to-FP conversion for range detection and clamping:
  - 99,999,999.5
  - 999,999,999.5
  - 1,000,000,000
- These constants are consulted to determine overflow or to adjust parsing behavior when numeric magnitude approaches limits supported by the 5‑byte FP representation.

**Related helpers (referenced):**
- MOVFM / MOVFA — movement and rounding helpers used by FIN to move values into FAC1 and perform rounding adjustments during conversion.
- MUL10 / DIV10 — multiplication/division helpers used to multiply FAC1 by 10 or divide by 10 when assembling digits from ASCII (used for shifting integer/fractional digits into place).

**Behavioral notes preserved from source:**
- FIN is the primary converter invoked by VAL.
- FINLOG performs the incremental signed-integer digit addition to FAC1.
- NO999 supplies the specific magnitude constants used to handle extreme values during conversion.

## Key Registers

- **FIN ($BCF3):** Converts ASCII string to floating point (FAC1).
- **FINLOG ($BD7E):** Adds signed integer digit to FAC1 during parsing.
- **NO999 ($BDB3):** Table of three floating point constants for range handling.

## References

- "movement_and_rounding_routines" — expands on MOVFM/MOVFA helpers used during conversion.
- "mul_div_helpers_and_division" — expands on MUL10/DIV10 helpers used when assembling numeric digits into floating point form.

## Labels
- FIN
- FINLOG
- NO999
