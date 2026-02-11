# NMOS 6510 — IGNORED: December 24th, 2022 (V0.97) entry

**Summary:** Changelog for NMOS 6510 documentation (v0.97) listing additions and fixes: new examples for unofficial/undocumented opcodes (DOP/TOP/LAX/DCP/SBX), corrected cycle-table errors for Zeropage X (Indexed Indirect) and RTS access, fixed RRA bit-name (LSB), and added examples for simulating addressing modes for ISC/DCP/RRA/RLA/SRE/SLO. Searchable terms: NMOS 6510, DOP, TOP, LAX, DCP, SBX, Zeropage X Indexed Indirect, RTS access cycle, RRA, ISC, RLA, SRE, SLO.

## Change Details
- Added additional examples for undocumented/illegal opcodes:
  - DOP (double NOP), TOP, LAX, DCP — examples provided by Bitbreaker.
  - SBX example added (inspired by Bitbreaker).
- Fixed errors in cycle tables:
  - Corrected mistakes in Zeropage X Indexed Indirect access cycle table (reported by OldWoman37).
  - Corrected RTS access cycle table.
- Corrected naming error:
  - Fixed LSB misnamed as "bit 1" in RRA (now properly named LSB).
- Added simulation examples:
  - Examples for simulating addressing modes for ISC, DCP, RRA, RLA, SRE, SLO (inspired by Bitbreaker).
- Versioning note:
  - Entry labeled December 24th, 2022 — v0.97; marked "IGNORED" in this dataset.

## References
- "history_2023_v0_98" — expands on this chronological revision (2023)
- "history_2021_v0_96" — expands on the prior chronological revision (2021)
