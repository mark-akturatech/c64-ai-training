# ANC (NMOS 6510 unofficial opcode family)

**Summary:** ANC is an unofficial (illegal) NMOS 6510 / 6502 mnemonic family used by assemblers to represent combined AND + carry/flag behavior; known opcode bytes recorded in the source are $8F, $0B and $2B and an alternate name/variant appears as ANC2. Presentation and supported addressing modes vary between assemblers.

## Description
ANC is not part of the official 6502 instruction set — it is an undocumented/illegal opcode mnemonic used by some assemblers to denote a single-byte opcode (or opcode family) that implements an AND-like operation with additional effect(s) on the processor status (the exact effect and flag behavior depends on the particular opcode/CPU variant and assembler notation). The original source lists multiple occurrences of the mnemonic and three opcode bytes explicitly associated with ANC: $8F, $0B and $2B. Some assemblers or opcode maps also expose an alternative label ANC2 for one of the variants.

Important points from the source:
- ANC appears multiple times in assembler/opcode tables (the chunk lists repeated entries).
- The recorded opcode bytes associated with ANC in the source are: $8F, $0B, $2B.
- A variant named ANC2 is mentioned separately, indicating assemblers may distinguish two different behavior/encodings.
- The exact addressing modes and assembler spellings differ between assemblers; some assemblers map the same mnemonic to different opcode bytes, or use different names (ANC vs ANC2).

This chunk serves as a compact mapping note: assemblers and opcode reference tables should be consulted when choosing mnemonic spelling or opcode byte for a target assembler/CPU. See the referenced adjacent mnemonic mappings (ISC and ALR) for context of nearby undocumented-opcode groups.

## Source Code
```text
ANC mapping (source rows):
- ANC
- ANC
- ANC
- ANC
- $8F
- ANC
- $0B
- ANC
- ANC
- $2B
- ANC2

Notes:
- Op-codes explicitly listed: $8F, $0B, $2B
- Separate variant name: ANC2

Cross-reference suggestions:
- Search "isc_isc_mnemonic_mapping" (previous mnemonic group)
- Search "alr_alr_mnemonic_mapping" (next mnemonic group)
```

## Key Registers
(omitted — this chunk documents CPU/opcode mnemonics, not memory-mapped registers)

## References
- "isc_isc_mnemonic_mapping" — expands on previous mnemonic (ISC)
- "alr_alr_mnemonic_mapping" — expands on next group (ALR)