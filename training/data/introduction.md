# MOS 6567/6569 (VIC-II) — Purpose and Scope

**Summary:** Overview and reference of the MOS 6567/6569 Video Interface Controller (VIC-II) for C64 programmers and emulator authors; documents specified and experimentally determined (unspecified) behavior including internal registers, video matrix counter models, and measurement/test methodology.

**Introduction**

This document summarizes examinations of the MOS 6567/6569 Video Interface Controller (VIC-II) used in the Commodore 64 and provides a reference for both specified and experimentally determined properties. It is intended primarily for experienced C64 programmers and authors of C64 emulators, and secondarily for hardware designers and hackers who require detailed behavioral specifics.

The material covers:

- Specified VIC-II behavior in the context of the C64 memory map (some memory-map material included for completeness).
- Unspecified properties discovered by empirical testing (timing, internal register behavior, edge cases).
- Proposed internal models (e.g., VIC video matrix counter implemented with two simple counters rather than more elaborate adder designs) chosen to minimally explain observed phenomena.
- Internal register descriptions and operational details inferred from tests.

Basis of the investigations:

- Tests and measurements performed by Marko Mäkelä, Andreas Boose, Pasi Ojala, Wolfgang Lorenz, Christian Bauer, and the document author, together with contributions from many other testers.
- A mix of oscilloscope measurements directly on the VIC chip and extensive C64 test programs compared against single-cycle emulators (for example, Frodo SC).

Notes:

- No official VIC schematics were available; internal models are therefore speculative but selected to explain observed behavior with minimal circuitry.
- The document emphasizes reproducible tests and comparisons with cycle-accurate emulation.

## References

- "c64_overview" — expands on C64 hardware units (6510, VIC-II, SID, CIAs, RAM/ROM).
- "vic_chip_and_signals" — expands on VIC-II overview and signals.