# FRE (routine at $B37D) — free-memory function

**Summary:** Describes the BASIC FRE implementation at $B37D, which calls the garbage collector at $B526 to reclaim unused string text, computes free memory between the bottom of string space and the top of array storage, and falls through to the 16-bit signed-to-floating-point conversion routine at $B391 (GIVAYF). Notes C64/PET platform differences and the corrective expression for values > 32767.

**Operation**
FRE (entry $B37D, decimal 45949) performs these steps:
- Calls the garbage-collection routine at $B526 (decimal 46374) to remove unused string text.
- Computes free memory as the difference between the bottom of string text and the top of array storage (array/ISARY bounds used as top).
- Falls through into the routine that converts a 16-bit signed integer into floating-point format at $B391 (GIVAYF).

Behavioral detail and platform caveat:
- The conversion routine treats the computed free-memory value as a signed 16-bit integer. On systems where free memory never exceeded 32767 (e.g., PET), this posed no problem.
- On the C64, free memory can exceed 32767; when treated as a signed 16-bit value, such values appear negative (the high bit is interpreted as a sign bit). To correct this, add 65536 when the signed result is negative.

Corrective expression:
- Original source shows: FRE(0)-6556*(FRE(0)<0) — this appears to be an error (missing digit).
- Correct expression to obtain the true free-memory amount: FRE(0) - 65536*(FRE(0) < 0)
  - (equivalently: FRE(0) + 65536 if FRE(0) is negative when interpreted as signed 16-bit)

**[Note: Source may contain an error — the original text printed "6556"; the correct constant to adjust a wrapped 16-bit signed value is 65536.]**

## References
- "GIVAYF" — expands on the routine that converts a 16-bit signed integer to floating point (the routine FRE falls through to).
- "array_lookup_and_creation_isary" — expands on array storage boundaries and how free memory is computed relative to ISARY top-of-storage.

## Labels
- FRE
- GIVAYF
