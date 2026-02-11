# NMOS 6510 — Changelog (V0.94, 2019-12-24)

**Summary:** Changelog for the NMOS 6510 opcode and behavior documentation: fixes and clarifications to ARR carry flag, SHA/SHX/SHY/TAS unstable behaviour, ANE/LAX details, decimal-mode (BCD) fixup and flags, added tests and example coverage, and added a bugs/quirks chapter including "Blackmail FLI". Mentions alternative mnemonics found in AEG's patched Turbo Assembler.

## Changes
- Version/date: December 24th, 2019 (V0.94).
- Added more detailed descriptions of processor flags behavior for several opcodes (specific opcodes not enumerated here).
- Updated ANE and LAX opcode details.
- Fixed description of the carry flag behavior for ARR.
- Clarified unstable behavior of SHA/SHX/SHY/TAS and added references to new tests for SHA/SHX/SHY/TAS.
- Updated TAS example code.
- Added more detailed coverage of decimal-mode BCD fixup and the resulting flags behavior (cross-references to the decimal mode chapter were added for opcodes dependent on the decimal flag).
- Added a new chapter about bugs and quirks.
- Described "Blackmail FLI" in combined examples.
- Expanded opcode example coverage so each opcode has at least one example snippet.
- Added references to test programs (new or previously missing test references).
- Added alternative mnemonics discovered in AEG's patched Turbo Assembler.
- Sorted greetings alphabetically (cosmetic / metadata change).

## References
- "history_2020_v0_95" — expands on the next chronological revision (2020)
- "history_2018_v0_93" — expands on the previous chronological revision (2018)