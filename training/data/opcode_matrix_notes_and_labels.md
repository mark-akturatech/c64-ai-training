# NMOS 6510 — Opcode Matrix Labels: Block C (RMW + Load/Store X) and Block D (Unintended Operations)

**Summary:** This document details the opcode matrix blocks C and D for the NMOS 6510 microprocessor. Block C encompasses Read-Modify-Write (RMW) operations and Load/Store X instructions, while Block D includes unintended or undocumented operations. The opcode matrix is structured such that variants of the same instruction within a block predominantly appear in the same row. This document provides a comprehensive opcode matrix for blocks C and D, detailing explicit opcodes, addressing modes, and behaviors.

**Block Definitions and Notes**

- **Block C: "RMW Operations + Load/Store X"**
  - This block groups together instructions that perform read-modify-write cycles (e.g., ASL, LSR, ROL, ROR, INC, DEC) along with Load X (LDX) and Store X (STX) operations.
  - Addressing modes for these instructions include Zero Page, Zero Page,X, Absolute, and Absolute,X.
  - The opcode matrix reveals that these instructions are organized in specific rows, facilitating identification and usage.

- **Block D: "Unintended Operations"**
  - This block comprises undocumented or unintended opcodes, often referred to as illegal opcodes.
  - These opcodes can perform various operations, sometimes combining functions of standard instructions or exhibiting unpredictable behaviors.
  - The opcode matrix provides a detailed view of these unintended operations, including their mnemonics, addressing modes, and effects.

- **Instruction Variants Alignment**
  - Variants of the same instruction within a block are predominantly aligned in the same row of the opcode matrix.
  - This alignment aids in understanding the relationship between different addressing modes and their corresponding opcodes.

## Source Code

```text
Opcode Matrix for Blocks C and D:

|      | 0x0 | 0x1 | 0x2 | 0x3 | 0x4 | 0x5 | 0x6 | 0x7 | 0x8 | 0x9 | 0xA | 0xB | 0xC | 0xD | 0xE | 0xF |
|------|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 0x00 | BRK | ORA | ??? | ??? | ??? | ORA | ASL | ??? | PHP | ORA | ASL | ??? | ??? | ORA | ASL | ??? |
| 0x10 | BPL | ORA | ??? | ??? | ??? | ORA | ASL | ??? | CLC | ORA | ??? | ??? | ??? | ORA | ASL | ??? |
| 0x20 | JSR | AND | ??? | ??? | BIT | AND | ROL | ??? | PLP | AND | ROL | ??? | BIT | AND | ROL | ??? |
| 0x30 | BMI | AND | ??? | ??? | ??? | AND | ROL | ??? | SEC | AND | ??? | ??? | ??? | AND | ROL | ??? |
| 0x40 | RTI | EOR | ??? | ??? | ??? | EOR | LSR | ??? | PHA | EOR | LSR | ??? | JMP | EOR | LSR | ??? |
| 0x50 | BVC | EOR | ??? | ??? | ??? | EOR | LSR | ??? | CLI | EOR | ??? | ??? | ??? | EOR | LSR | ??? |
| 0x60 | RTS | ADC | ??? | ??? | ??? | ADC | ROR | ??? | PLA | ADC | ROR | ??? | JMP | ADC | ROR | ??? |
| 0x70 | BVS | ADC | ??? | ??? | ??? | ADC | ROR | ??? | SEI | ADC | ??? | ??? | ??? | ADC | ROR | ??? |
| 0x80 | ??? | STA | ??? | ??? | STY | STA | STX | ??? | DEY | ??? | TXA | ??? | STY | STA | STX | ??? |
| 0x90 | BCC | STA | ??? | ??? | STY | STA | STX | ??? | TYA | STA | TXS | ??? | ??? | STA | ??? | ??? |
| 0xA0 | LDY | LDA | LDX | ??? | LDY | LDA | LDX | ??? | TAY | LDA | TAX | ??? | LDY | LDA | LDX | ??? |
| 0xB0 | BCS | LDA | ??? | ??? | LDY | LDA | LDX | ??? | CLV | LDA | TSX | ??? | LDY | LDA | LDX | ??? |
| 0xC0 | CPY | CMP | ??? | ??? | CPY | CMP | DEC | ??? | INY | CMP | DEX | ??? | CPY | CMP | DEC | ??? |
| 0xD0 | BNE | CMP | ??? | ??? | ??? | CMP | DEC | ??? | CLD | CMP | ??? | ??? | ??? | CMP | DEC | ??? |
| 0xE0 | CPX | SBC | ??? | ??? | CPX | SBC | INC | ??? | INX | SBC | NOP | ??? | CPX | SBC | INC | ??? |
| 0xF0 | BEQ | SBC | ??? | ??? | ??? | SBC | INC | ??? | SED | SBC | ??? | ??? | ??? | SBC | INC | ??? |

Legend:
- ??? : Unintended/Undocumented Opcode
- Addressing Modes:
  - (ind,X): Indirect,X
  - (ind),Y: Indirect,Y
  - zp: Zero Page
  - zp,X: Zero Page,X
  - abs: Absolute
  - abs,X: Absolute,X
  - abs,Y: Absolute,Y
  - #imm: Immediate
  - A: Accumulator
  - imp: Implied
  - rel: Relative
```

## References

- "opcode_matrix_row_00" — expands on opcode row 00..1F containing ASL/SLO/ANC entries
- "opcode_matrix_row_20" — expands on opcode row 20..3F containing ROL/RLA/ANC entries
- "opcode_matrix_row_40" — expands on opcode row 40..5F containing LSR/SRE/ALR entries
- "opcode_matrix_row_60" — expands on opcode row 60..7F containing ROR/RRA/ARR entries
- "opcode_matrix_row_80" — expands on opcode row 80..9F containing store/transfer and SAX/SHA variants
- "opcode_matrix_row_a0" — expands on opcode row A0..BF containing LDX/LAX/LAS variants
- "opcode_matrix_row_c0" — expands on opcode row C0..DF containing DEC/DCP/SBX variants
- "opcode_matrix_row_e0" — expands on opcode row E0..FF containing INC/ISC/SBC variants

## Mnemonics
- ASL
- LSR
- ROL
- ROR
- INC
- DEC
- LDX
- STX
