# NMOS 6510 — Revision V0.99 (2024-12-24)

**Summary:** Revision notes for NMOS 6510 documentation mentioning opcode matrix correction ($73 → RRA), fixes to undocumented/illegal instruction notes (ANE#imm, LAX#imm), updates to ISC examples, and addition of a "set rightmost set bit to 0" example. Searchable terms: $73, RRA, SRE, ANE#imm, LAX#imm, ISC, illegal opcodes.

## Revision Notes
- Removed an incorrect note about N and Z flags for ANE#imm and LAX#imm (credited to Geir Straume).
- Fixed opcode $73 in the opcode matrix — it should be RRA, not SRE (credited to Kakka).
- Updated ISC loop-counter example (credited to Quiss).
- Added an example: "set rightmost set bit to 0" (credited to Quiss).

## References
- "history_2023_v0_98" — next chronological revision details (2023)
- "history_overview" — full revision history (meta)