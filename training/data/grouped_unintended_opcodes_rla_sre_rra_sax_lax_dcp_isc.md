# NMOS 6510 — Undocumented multi-byte opcode index (RLA/SRE/RRA/SAX/LAX/DCP/ISC)

**Summary:** Index of NMOS 6510 multi-byte undocumented opcode bytes grouped by mnemonic names RLA, SRE, RRA, SAX, LAX, DCP, and ISC; lists exact opcode bytes ($xx) and preserves blank/separator lines for reference and cross-checking against behavior/flag effects.

## Description
This chunk is an index mapping opcode bytes to the commonly used mnemonics for several multi-byte undocumented NMOS 6510 (6502-family) instructions: RLA, SRE, RRA, SAX, LAX, DCP, and ISC. It does not describe their semantics or flag effects — it only records which opcode bytes in the opcode table correspond to each grouped mnemonic. Blank/separator lines from the original table are preserved.

Use this as a lookup to find the opcode byte(s) associated with each undocumented mnemonic; consult the referenced chunks for functional behavior and status-flag effects.

## Source Code
```text
RLA

$27 $37

$23 $33

$2F $3F $3B

SRE

$47 $57

$43 $53

$4F $5F $5B

RRA

$67 $77

$63 $73

$6F $7F $7B

SAX

$87

$97 $83

$8F

LAX

$A7

$B7 $A3 $B3

$AF

DCP

$C7 $D7

$C3 $D3

$CF $DF $DB

ISC

$E7 $F7

$E3 $F3

$EF $FF $FB
```

## References
- "functions_and_flag_effects_for_grouped_opcodes" — describes the high-level function each opcode performs and which status flags are affected.
- "single_byte_immediate_anc_alr_arr_sbx_sbc" — covers the single-byte immediate variants (ANC/ALR/ARR/SBX/SBC) listed elsewhere in the opcode table.

## Mnemonics
- RLA
- SRE
- RRA
- SAX
- LAX
- DCP
- ISC
