# NMOS 6510 — Opcode matrix row $80–$9F

**Summary:** Opcode mapping for NMOS 6510 opcodes $80–$9F. Covers immediate-mode NOPs, STX (zp/abs/zp,y), TXA/TXS, undocumented store/transfer variants SHX/SHY/SAX/SHA/TAS and ANE, addressing modes including (zp,x), zp, #imm, abs, (zp),y, zp,y, abs,y, and JAM (illegal) entries.

**Opcode row description**
This chunk enumerates the opcodes assigned in the NMOS 6510 opcode matrix beginning at $80. The list provided here corresponds to the opcodes ($80–$9F) of that row. It contains a mixture of documented instructions (STX, TXA, TXS) and many unofficial/undocumented opcodes common to NMOS-family 6502 implementations (SAX, SHX, SHA, TAS, ANE). JAM denotes an illegal opcode that locks up the CPU (bricked state).

Notes:
- Addressing modes shown are as given in the source: #imm (immediate), zp (zero page), abs (absolute), (zp,x), (zp),y, zp,y, abs,y.
- Undocumented mnemonics (SAX, SHA, SHX, TAS, ANE) are implementations of illegal opcodes observed on NMOS 6502/6510 silicon; behavior may differ across revisions and between NMOS and CMOS variants.
- JAM indicates a CPU "halt" / lockup (illegal opcode with no defined behavior).

## Source Code
```asm
.; Opcode matrix entries for $80..$9F (NMOS 6510) — each line: .,$XX  MNEMONIC   addressing
.,$80  NOP    #imm
.,$81  STA    (zp,x)
.,$82  NOP    #imm
.,$83  SAX    (zp,x)
.,$84  STY    zp
.,$85  STA    zp
.,$86  STX    zp
.,$87  SAX    zp
.,$88  DEY    (implied)
.,$89  NOP    #imm
.,$8A  TXA    (implied)
.,$8B  ANE    #imm
.,$8C  STY    abs
.,$8D  STA    abs
.,$8E  STX    abs
.,$8F  SAX    abs
.,$90  BCC    rel
.,$91  STA    (zp),y
.,$92  JAM    (illegal)
.,$93  SHA    (zp),y
.,$94  STY    zp,x
.,$95  STA    zp,x
.,$96  STX    zp,y
.,$97  SAX    zp,y
.,$98  TYA    (implied)
.,$99  STA    abs,y
.,$9A  TXS    (implied)
.,$9B  TAS    abs,y
.,$9C  SHY    abs,x
.,$9D  STA    abs,x
.,$9E  SHX    abs,y
.,$9F  SHA    abs,y
```

## References
- "opcode_matrix_row_60" — expands on previous opcode row (60..7F) with ROR/RRA
- "opcode_matrix_row_a0" — expands on next opcode row (A0..BF) with LDX/TAX/LAX/LAS
- "opcode_matrix_notes_and_labels" — expands on block labels and concluding note about variant grouping

## Mnemonics
- NOP
- STA
- SAX
- STY
- STX
- DEY
- TXA
- ANE
- BCC
- JAM
- SHA
- TYA
- TXS
- TAS
- SHY
- SHX
