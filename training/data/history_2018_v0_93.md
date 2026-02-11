# NMOS 6510 — changelog v0.93 (2018-12-24)

**Summary:** Changelog for the NMOS 6510 CPU documentation (v0.93) detailing edits to CPU flags naming, flag-usage tables, decimal mode notes, and instruction details including RDY-line dependency for undocumented/extended opcodes ANE and LAX.

## Changes in v0.93
- Date: 2018-12-24, Version: v0.93.
- Added a description for CPU flags naming (explicit naming for N/V/B/D/I/Z/C).
- Expanded tables describing how flags are used by instructions (more detailed flag-usage entries).
- Added notes about Decimal mode behavior (BCD implications and clarifications).
- Reordered sub-instruction descriptions in some opcode entries to improve logical flow.
- Added missing note: ANE and LAX (extended/undocumented opcodes) are dependent on the RDY line (their behavior can change when RDY is asserted/deasserted).
- Ensured all document sections have proper headers.

**[Note: Source may contain an error — the original text says "history_2019_v0_94" expands on a "previous chronological revision (2019)" and "history_2017_v0_92" expands on a "next chronological revision (2017)"; the "previous/next" labels appear reversed given the dates.]**

## References
- "history_2019_v0_94" — expands on previous chronological revision (2019)
- "history_2017_v0_92" — expands on next chronological revision (2017)