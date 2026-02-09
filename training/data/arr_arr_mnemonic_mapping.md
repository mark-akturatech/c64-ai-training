# NMOS 6510 — undocumented mnemonic ARR (assembler mapping, opcode $6B)

**Summary:** Mapping of assembler naming and opcode byte(s) for the undocumented 6510/6502 mnemonic ARR (noted in source as $6B and other forms). Shows the raw table rows as represented by various assemblers and cross-references related undocumented mnemonics (ALR, SBX/AXS).

## Description
This chunk contains cleaned table rows from source material that list occurrences of the undocumented mnemonic "ARR" and its opcode byte(s). The source shows $6B explicitly and repeated assembler-name instances of ARR. No behavioral description (effects on A/flags) is included in the source; this chunk preserves only the assembler-to-opcode naming rows and the provided cross-references.

Use this node when searching for assembler naming variants and opcode byte listings for the undocumented ARR mnemonic (search terms: ARR, $6B, undocumented opcode, assembler mapping).

## Source Code
```text
# Raw table rows (assembler name / opcode bytes / mnemonic)
ARR    $6B    ARR
ARR           ARR
ARR           ARR
ARR           ARR
ARR           ARR
ARR           ARR
```

(Original source lists multiple identical rows naming the mnemonic "ARR" and includes opcode byte $6B in at least one row.)

## References
- "alr_alr_mnemonic_mapping" — expands on previous mnemonic (ALR)
- "sbx_axs_mnemonics" — expands on next related group (SBX / AXS)