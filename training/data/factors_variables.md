# MACHINE — FACTORS program: variable addresses and purposes

**Summary:** Zero-page and low-RAM variable map for the MACHINE / FACTORS program with addresses $0349–$0379; documents purpose of single-byte flags ($0349–$034C) and multi-byte work areas ($0350–$0379) used for factorization/division routines.

**Variables**
- $0349 — number of times a factor divides evenly (single byte counter).
- $034A — formatting character: holds either "equals" or "asterisk" (single byte).
- $034B — zero-suppression flag (single byte).
- $034C — 30-counter (single byte).
- $0350–$0357 — value under analysis (8 bytes; program treats this as the multi-byte value being factored/divided).
- $0358–$035F — value work area (8 bytes; temporary scratch space related to the value under analysis).
- $0360–$0367 — "base" value for 30-counter (8 bytes; base used by routines that decrement/compare against the 30-counter).
- $036C–$0379 — division work area (14 bytes total); used during multi-byte division steps:
  - $036C–$036F — remainder (4 bytes).
  - $0370–$0377 — quotient (8 bytes).
  - $0378–$0379 — present in the declared work area but not described in the source (2 bytes, purpose unspecified).

Notes:
- Multi-byte fields ($0350–$0357, $0358–$035F, $0360–$0367, $036C–$0377) are presented as contiguous byte arrays by the source; the source does not state numeric format (endian or BCD/binary). Treat them as byte-wise multi-byte values used by the program's arithmetic/routines.
- The division area maps remainder and quotient into distinct subranges; remaining bytes inside the overall area are not documented.

## Key Registers
- $0349 - Program RAM - number of times a factor divides evenly (1 byte)
- $034A - Program RAM - formatting character ("=" or "*") (1 byte)
- $034B - Program RAM - zero suppression flag (1 byte)
- $034C - Program RAM - 30-counter (1 byte)
- $0350-$0357 - Program RAM - value under analysis (8 bytes)
- $0358-$035F - Program RAM - value work area (8 bytes)
- $0360-$0367 - Program RAM - base value for 30-counter (8 bytes)
- $036C-$0379 - Program RAM - division work area (remainder $036C-$036F, quotient $0370-$0377)

## References
- "factors_program_map" — expands on program routines that operate on these variables (division/factorization routines)