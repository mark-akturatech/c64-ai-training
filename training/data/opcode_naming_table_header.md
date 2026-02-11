# Opcode naming in different Assemblers (Appendix header)

**Summary:** Appendix header and column labels for an opcode-naming matrix showing addressing-mode columns (imp, imm, zp, zpx, zpy, izx, izy, abs, abx, aby, ind, rel) and assembler rows (KickAss, Acme, ca65, dasm, 64tass). Describes table layout used by subsequent mnemonic rows (e.g. SLO, RLA).

## Table layout explanation
This chunk is the header row and row labels for a matrix that compares assembler mnemonic names per addressing mode. Layout rules:

- Columns
  - First column: "Opc" — the canonical mnemonic being compared.
  - Addressing-mode columns (abbreviations used exactly in the table):
    - imp — implied
    - imm — immediate
    - zp  — zero page
    - zpx — zero page,X
    - zpy — zero page,Y
    - izx — (indirect,X) — also written (ind,X)
    - izy — (indirect),Y — also written (ind),Y
    - abs — absolute
    - abx — absolute,X
    - aby — absolute,Y
    - ind — indirect (absolute indirect)
    - rel — relative
- Rows
  - One row per assembler showing the mnemonic that assembler uses for the listed addressing mode; blank cells indicate no mnemonic/unsupported addressing mode.
  - Assemblers listed (row labels): KickAss, Acme, ca65, dasm, 64tass.
- Purpose
  - The header defines how to read the following mnemonic rows: each row gives assembler-specific names for the same opcode across addressing modes (e.g., how SLO or RLA are named/encoded per assembler and addressing mode).

## Source Code
```text
Appendix
Opcode naming in different Assemblers
Opc imp imm zp zpx zpy izx izy abs abx aby ind rel

KickAss

Acme

ca65

dasm

64tass
```

## References
- "slo_mnemonic_mapping" — expands on SLO mnemonic and opcode bytes (first mnemonic in the table)
- "rla_mnemonic_mapping" — expands on RLA mnemonic (next row)