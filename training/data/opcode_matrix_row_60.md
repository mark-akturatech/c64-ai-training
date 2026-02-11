# NMOS 6510 — Opcode matrix row $60–$7F

**Summary:** Opcode row $60–$7F for the NMOS 6510 showing RTS, ROR variants (accumulator, zp, abs, zp,X, abs,X), NOP, and undocumented combined opcodes RRA and ARR with addressing modes (zp,X), zp, #imm, abs, (zp),Y, zp,X, abs,Y, abs,X.

**Description**
This chunk lists the 16 opcodes in the 6502/6510 opcode matrix row for opcodes $60 through $7F. It enumerates which entries are the RTS instruction, which are ROR variants (several addressing modes), a single NOP entry, and several undocumented/combined opcodes (RRA and ARR) with their associated addressing modes as provided by the source.

**[Note: Source contained an error — 0x60 is RTS on the 6502; the source incorrectly listed it as JAM.]**

## Source Code
```text
Opcode map for $60..$7F (corrected)

$60  RTS
$61  ADC (zp,X)
$62  JAM
$63  RRA (zp,X)
$64  NOP zp
$65  ADC zp
$66  ROR zp
$67  RRA zp
$68  PLA
$69  ADC #imm
$6A  ROR A
$6B  ARR #imm
$6C  JMP (abs)
$6D  ADC abs
$6E  ROR abs
$6F  RRA abs
$70  BVS rel
$71  ADC (zp),Y
$72  JAM
$73  RRA (zp),Y
$74  NOP zp,X
$75  ADC zp,X
$76  ROR zp,X
$77  RRA zp,X
$78  SEI
$79  ADC abs,Y
$7A  NOP
$7B  RRA abs,Y
$7C  JMP (abs,X)
$7D  ADC abs,X
$7E  ROR abs,X
$7F  RRA abs,X
```

## References
- "opcode_matrix_row_40" — expands previous opcode row ($40..$5F) with LSR/SRE/ALR
- "opcode_matrix_row_80" — expands next opcode row ($80..$9F) with NOP/STX/TXA/SAX variants
- "opcode_matrix_notes_and_labels" — expands block labels and concluding notes about variant grouping

## Mnemonics
- RTS
- ADC
- JAM
- RRA
- NOP
- ROR
- PLA
- ARR
- JMP
- BVS
- SEI
