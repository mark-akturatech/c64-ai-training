# NMOS 6510 — Mnemonic Variants and Processor Flag Notation

**Summary:** This document establishes a canonical naming policy for NMOS 6510/6502 opcode mnemonics and standard processor status-flag notation (N, V, B, D, I, Z, C). It includes a comprehensive table mapping each opcode to its chosen canonical mnemonic, a list of historical mnemonic variants, assembler-specific mnemonic mappings, and example assembler listings demonstrating variant usage versus canonical names.

**Mnemonic Variants Policy**

To ensure consistency across documentation and embedded content, a single canonical mnemonic is selected for each 6510/6502 opcode. Historical variants are documented for reference. Assembler-specific differences are addressed in the appendix.

**Opcode to Canonical Mnemonic Mapping**

The following table maps each opcode to its canonical mnemonic:

| Opcode | Canonical Mnemonic | Addressing Mode |
|--------|--------------------|-----------------|
| $00    | BRK                | Implied         |
| $01    | ORA                | (Indirect,X)    |
| $05    | ORA                | Zero Page       |
| $06    | ASL                | Zero Page       |
| $08    | PHP                | Implied         |
| $09    | ORA                | Immediate       |
| $0A    | ASL                | Accumulator     |
| $0D    | ORA                | Absolute        |
| $0E    | ASL                | Absolute        |
| $10    | BPL                | Relative        |
| $11    | ORA                | (Indirect),Y    |
| $15    | ORA                | Zero Page,X     |
| $16    | ASL                | Zero Page,X     |
| $18    | CLC                | Implied         |
| $19    | ORA                | Absolute,Y      |
| $1D    | ORA                | Absolute,X      |
| $1E    | ASL                | Absolute,X      |
| $20    | JSR                | Absolute        |
| $21    | AND                | (Indirect,X)    |
| $24    | BIT                | Zero Page       |
| $25    | AND                | Zero Page       |
| $26    | ROL                | Zero Page       |
| $28    | PLP                | Implied         |
| $29    | AND                | Immediate       |
| $2A    | ROL                | Accumulator     |
| $2C    | BIT                | Absolute        |
| $2D    | AND                | Absolute        |
| $2E    | ROL                | Absolute        |
| $30    | BMI                | Relative        |
| $31    | AND                | (Indirect),Y    |
| $35    | AND                | Zero Page,X     |
| $36    | ROL                | Zero Page,X     |
| $38    | SEC                | Implied         |
| $39    | AND                | Absolute,Y      |
| $3D    | AND                | Absolute,X      |
| $3E    | ROL                | Absolute,X      |
| $40    | RTI                | Implied         |
| $41    | EOR                | (Indirect,X)    |
| $45    | EOR                | Zero Page       |
| $46    | LSR                | Zero Page       |
| $48    | PHA                | Implied         |
| $49    | EOR                | Immediate       |
| $4A    | LSR                | Accumulator     |
| $4C    | JMP                | Absolute        |
| $4D    | EOR                | Absolute        |
| $4E    | LSR                | Absolute        |
| $50    | BVC                | Relative        |
| $51    | EOR                | (Indirect),Y    |
| $55    | EOR                | Zero Page,X     |
| $56    | LSR                | Zero Page,X     |
| $58    | CLI                | Implied         |
| $59    | EOR                | Absolute,Y      |
| $5D    | EOR                | Absolute,X      |
| $5E    | LSR                | Absolute,X      |
| $60    | RTS                | Implied         |
| $61    | ADC                | (Indirect,X)    |
| $65    | ADC                | Zero Page       |
| $66    | ROR                | Zero Page       |
| $68    | PLA                | Implied         |
| $69    | ADC                | Immediate       |
| $6A    | ROR                | Accumulator     |
| $6C    | JMP                | Indirect        |
| $6D    | ADC                | Absolute        |
| $6E    | ROR                | Absolute        |
| $70    | BVS                | Relative        |
| $71    | ADC                | (Indirect),Y    |
| $75    | ADC                | Zero Page,X     |
| $76    | ROR                | Zero Page,X     |
| $78    | SEI                | Implied         |
| $79    | ADC                | Absolute,Y      |
| $7D    | ADC                | Absolute,X      |
| $7E    | ROR                | Absolute,X      |
| $81    | STA                | (Indirect,X)    |
| $84    | STY                | Zero Page       |
| $85    | STA                | Zero Page       |
| $86    | STX                | Zero Page       |
| $88    | DEY                | Implied         |
| $8A    | TXA                | Implied         |
| $8C    | STY                | Absolute        |
| $8D    | STA                | Absolute        |
| $8E    | STX                | Absolute        |
| $90    | BCC                | Relative        |
| $91    | STA                | (Indirect),Y    |
| $94    | STY                | Zero Page,X     |
| $95    | STA                | Zero Page,X     |
| $96    | STX                | Zero Page,Y     |
| $98    | TYA                | Implied         |
| $99    | STA                | Absolute,Y      |
| $9A    | TXS                | Implied         |
| $9D    | STA                | Absolute,X      |
| $A0    | LDY                | Immediate       |
| $A1    | LDA                | (Indirect,X)    |
| $A2    | LDX                | Immediate       |
| $A4    | LDY                | Zero Page       |
| $A5    | LDA                | Zero Page       |
| $A6    | LDX                | Zero Page       |
| $A8    | TAY                | Implied         |
| $A9    | LDA                | Immediate       |
| $AA    | TAX                | Implied         |
| $AC    | LDY                | Absolute        |
| $AD    | LDA                | Absolute        |
| $AE    | LDX                | Absolute        |
| $B0    | BCS                | Relative        |
| $B1    | LDA                | (Indirect),Y    |
| $B4    | LDY                | Zero Page,X     |
| $B5    | LDA                | Zero Page,X     |
| $B6    | LDX                | Zero Page,Y     |
| $B8    | CLV                | Implied         |
| $B9    | LDA                | Absolute,Y      |
| $BA    | TSX                | Implied         |
| $BC    | LDY                | Absolute,X      |
| $BD    | LDA                | Absolute,X      |
| $BE    | LDX                | Absolute,Y      |
| $C0    | CPY                | Immediate       |
| $C1    | CMP                | (Indirect,X)    |
| $C4    | CPY                | Zero Page       |
| $C5    | CMP                | Zero Page       |
| $C6    | DEC                | Zero Page       |
| $C8    | INY                | Implied         |
| $C9    | CMP                | Immediate       |
| $CA    | DEX                | Implied         |
| $CC    | CPY                | Absolute        |
| $CD    | CMP                | Absolute        |
| $CE    | DEC                | Absolute        |
| $D0    | BNE                | Relative        |
| $D1    | CMP                | (Indirect),Y    |
| $D5    | CMP                | Zero Page,X     |
| $D6    | DEC                | Zero Page,X     |
| $D8    | CLD                | Implied         |
| $D9    | CMP                | Absolute,Y      |
| $DD    | CMP                | Absolute,X      |
| $DE    | DEC                | Absolute,X      |
| $E0    | CPX                | Immediate       |
| $E1    | SBC                | (Indirect,X)    |
| $E4    | CPX                | Zero Page       |
| $E5    | SBC                | Zero Page       |
| $E6    | INC                | Zero Page       |
| $E8    | INX                | Implied         |
| $E9    | SBC                | Immediate       |
| $EA    | NOP                | Implied         |
| $EC    | CPX                | Absolute        |
| $ED    | SBC                | Absolute        |
| $EE    | INC                | Absolute        |
| $F0    | BEQ                | Relative        |
| $F1    | SBC                | (Indirect),Y    |
| $F5    | SBC                | Zero Page,X     |
| $F6    | INC                | Zero Page,X     |
| $F8    | SED                | Implied         |
| $F9    | SBC                | Absolute,Y      |
| $FD    | SBC                | Absolute,X      |
| $FE    | INC                | Absolute,X      |

**Historical Mnemonic Variants**

Several opcodes have been known by different mnemonics in various assemblers and documentation. Below is a list of such variants:

- **ALR**: Also known as ASR
- **ANC**: No known variants
- **ANE**: Also known as XAA
- **ARR**: No known variants
- **DCP**: Also known as DCM
- **ISC**: Also known as ISB, INS
- **LAS**: Also known as LAR
- **LAX**: No known variants
- **LXA**: Also known as LAX immediate

## Mnemonics
- ADC
- AND
- ASL
- BCC
- BCS
- BEQ
- BIT
- BMI
- BNE
- BPL
- BRK
- BVC
- BVS
- CLC
- CLD
- CLI
- CLV
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
- JMP
- JSR
- LDA
- LDX
- LDY
- LSR
- NOP
- ORA
- PHA
- PHP
- PLA
- PLP
- ROL
- ROR
- RTI
- RTS
- SBC
- SEC
- SED
- SEI
- STA
- STX
- STY
- TAX
- TAY
- TSX
- TXA
- TXS
- TYA
- ALR
- ASR
- ANC
- ANE
- XAA
- ARR
- DCP
- DCM
- ISC
- ISB
- INS
- LAS
- LAR
- LAX
- LXA
