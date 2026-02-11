# NMOS 6510 — opcode matrix (Blocks A & B)

**Summary:** Arrangement of the NMOS 6510 / 6502 opcode matrix to expose symmetries between control instructions and register-specific load/store forms; labels the two major matrix blocks: A (Control instructions + Load/Store Y) and B (ALU operations + Load/Store A). See columns +00..+1C for the A/B grouping and +02..+1F for the complementary columns.

**Description**

Reordering the usual presentation of the 6502/6510 opcode matrix (grouping by column patterns rather than by numeric sequence) reveals regular structure: many instruction classes and addressing-form variations fall into repeating matrix blocks. Two useful labeled blocks are:

- **Block A — "Control Instructions + Load/Store Y"**: This block groups branch/control opcodes alongside the LDY/STY family (Y register load/store addressing modes). When the opcode matrix is visualized by the low-nibble (column) patterns, control instructions and Y-register memory operations align into the same block.

- **Block B — "ALU Operations + Load/Store A"**: This block groups the ALU/accumulator operations (ADC, SBC, AND, ORA, EOR, ASL/LSR/ROR/ROL when accumulator-based) together with the LDA/STA family (A register load/store addressing modes). These opcode encodings exhibit complementary symmetry to block A when the matrix is arranged by column.

A notable hardware/decoder consequence: certain opcode bits drive ROM/address decode signals such that some opcode values will simultaneously activate ROM regions intended for completely different instructions (partial overlap in the ROM/address decoding). Reordering the matrix makes these overlaps and the resulting symmetry obvious.

This chunk is an index-level note: it labels the major A/B regions and points to fuller decode tables that show the +00..+1C columns (blocks A and B) and the +02..+1F columns (blocks C and D plus concluding notes).

## Source Code

```text
Opcode Matrix Diagram:

  | 0x0 | 0x1 | 0x2 | 0x3 | 0x4 | 0x5 | 0x6 | 0x7 | 0x8 | 0x9 | 0xA | 0xB | 0xC | 0xD | 0xE | 0xF |
--+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
0x| BRK | ORA |     |     | TSB | ORA | ASL |     | PHP | ORA | ASL |     | TSB | ORA | ASL |     |
1x| BPL | ORA |     |     | TRB | ORA | ASL |     | CLC | ORA | INC |     | TRB | ORA | ASL |     |
2x| JSR | AND |     |     | BIT | AND | ROL |     | PLP | AND | ROL |     | BIT | AND | ROL |     |
3x| BMI | AND |     |     | BIT | AND | ROL |     | SEC | AND | DEC |     | BIT | AND | ROL |     |
4x| RTI | EOR |     |     |     | EOR | LSR |     | PHA | EOR | LSR |     | JMP | EOR | LSR |     |
5x| BVC | EOR |     |     |     | EOR | LSR |     | CLI | EOR | PHY |     |     | EOR | LSR |     |
6x| RTS | ADC |     |     | STZ | ADC | ROR |     | PLA | ADC | ROR |     | JMP | ADC | ROR |     |
7x| BVS | ADC |     |     | STZ | ADC | ROR |     | SEI | ADC | PLY |     | JMP | ADC | ROR |     |
8x| BRA | STA |     |     | STY | STA | STX |     | DEY | BIT | TXA |     | STY | STA | STX |     |
9x| BCC | STA |     |     | STY | STA | STX |     | TYA | STA | TXS |     | STZ | STA | STZ |     |
Ax| LDY | LDA | LDX |     | LDY | LDA | LDX |     | TAY | LDA | TAX |     | LDY | LDA | LDX |     |
Bx| BCS | LDA |     |     | LDY | LDA | LDX |     | CLV | LDA | TSX |     | LDY | LDA | LDX |     |
Cx| CPY | CMP |     |     | CPY | CMP | DEC |     | INY | CMP | DEX |     | CPY | CMP | DEC |     |
Dx| BNE | CMP |     |     |     | CMP | DEC |     | CLD | CMP | PHX |     |     | CMP | DEC |     |
Ex| CPX | SBC |     |     | CPX | SBC | INC |     | INX | SBC | NOP |     | CPX | SBC | INC |     |
Fx| BEQ | SBC |     |     |     | SBC | INC |     | SED | SBC | PLX |     |     | SBC | INC |     |
```

*Note: This diagram illustrates the opcode matrix layout, highlighting the A/B symmetry and ROM overlap examples.*

Concrete examples of opcode values demonstrating the ROM/address-decode overlap:

- **Opcode $A9 (LDA #imm)**: This opcode loads an immediate value into the accumulator. Its binary representation is `10101001`. The high nibble `1010` corresponds to the LDA instruction, and the low nibble `1001` specifies the immediate addressing mode.

- **Opcode $A5 (LDA zp)**: This opcode loads a value from zero page memory into the accumulator. Its binary representation is `10100101`. The high nibble `1010` corresponds to the LDA instruction, and the low nibble `0101` specifies the zero page addressing mode.

- **Opcode $B1 (LDA (zp),Y)**: This opcode loads a value from zero page indexed indirect memory into the accumulator. Its binary representation is `10110001`. The high nibble `1011` corresponds to the LDA instruction, and the low nibble `0001` specifies the indexed indirect addressing mode.

These examples demonstrate how specific opcode values can activate overlapping ROM regions due to their binary patterns, leading to unintended instruction executions.

## Mnemonics
- ADC
- AND
- ASL
- BEQ
- BIC
- BIT
- BRK
- BCC
- BCS
- BMI
- BPL
- BVC
- BVS
- CLC
- CLD
- CLI
- CMP
- CPX
- CPY
- DEC
- DEX
- DEY
- EOR
- INC
- INX
- INY
- JSR
- JMP
- LDA
- LDX
- LDY
- LSR
- NOP
- ORA
- PHA
- PLA
- PHP
- PLP
- ROL
- ROR
- RTS
- RTI
- SBC
- STA
- STX
- STY
- TAX
- TAY
- TXA
- TYA
- TSX
- TXS
- SEC
- SEI
- SED
