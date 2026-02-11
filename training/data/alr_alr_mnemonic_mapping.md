# NMOS 6510 — ALR (undocumented mnemonic)

**Summary:** Undocumented NMOS 6510 opcode mnemonic ALR (also named ASR in some assemblers); opcode byte example $4B is present in the source table rows. This chunk preserves the original table rows and notes assembler naming differences (ALR, ASR).

## Description
The source provides table rows for the undocumented 6510 mnemonic ALR (sometimes shown as ASR). Each row corresponds to an entry in an opcode/addressing-mode table — the original data lists mnemonic text and opcode byte values per row. The source explicitly shows assembler naming variations: some rows list "ALR", some "ASR", some both ("ALR, ASR"). The byte value $4B appears in the table.

No functional behavior or addressing-mode mapping is asserted by this chunk beyond the literal rows extracted from the source.

## Source Code
```text
ALR

$4B

ALR

ALR, ASR

ALR

ASR

ALR, ASR
```

## References
- "anc_anc_mnemonic_mapping" — expands on previous mnemonic (ANC)
- "arr_arr_mnemonic_mapping" — expands on next group (ARR)

## Mnemonics
- ALR
- ASR
