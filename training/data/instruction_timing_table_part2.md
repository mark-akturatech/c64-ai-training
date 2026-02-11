# 6502 Instruction Timing / Opcode Table — Part 2 (LDA … TYA)

**Summary:** Opcode hex values and cycle counts for instructions LDA, LDX, LDY, LSR, NOP, ORA, PHA, PHP, PLA, PLP, ROL, ROR, RTI, RTS, SBC, SEC, SED, SEI, STA, STX, STY, TAX, TAY, TSX, TXA, TXS, TYA across addressing modes (Imm, Abs, ZP, Acc, Imp, (IX), (I)Y, ZP,X, Abs,X, Abs,Y, Rel, Ind, ZP,Y). Includes base-cycle counts per addressing mode and notation for page-cross and branch behavior (see referenced notes).

## Table structure and notes
- This chunk is the second part of the 6502 timing/opcode table and covers the instructions named above. Complementary header definitions and symbol explanations are in the referenced chunks (see References).
- Column base cycle counts (as shown on the table header):
  - Immediate (Imm): 2
  - Absolute (Abs): 3
  - Zero Page (ZP): 2
  - Accumulator (Acc): 1
  - Implied (Imp): 1
  - (IX) (Indexed Indirect): 2
  - (I)Y (Indirect Indexed): 2
  - ZP,X: 2
  - Abs,X: 3
  - Abs,Y: 3
  - Relative (Rel): 2
  - Indirect (Ind): 3
  - ZP,Y: 2
- Cell content: the table shows opcode hex values and cycle counts where they differ from the base; ".." indicates the addressing mode is not applicable for that instruction. The original source uses inline symbols and annotation characters (for page-cross penalties, branch behavior, status flag effects, etc.); those symbol meanings are documented in "instruction_table_notes_and_figure".
- The source retains original mnemonic annotations (for example, "LDA!A9" or "SBC!E9"); do not assume meanings for punctuation — see referenced notes for explanations.
- Branch/page-cross behavior and status-flag effects are indicated by trailing symbols in each row; consult the notes chunk for full decoding.

## Source Code
```text
    Imm :Abs :ZP  :Acc :Imp :(IX):(I)Y:ZP,X:AbsX:AbsY:Rel :Ind :ZP,Y:
    2   :3   :2   :1   :1   :2   :2   :2   :3   :3   :2   :3   :2   :
    OP N:OP N:OP N:OP N:OP N:OP N:OP N:OP N:OP N:OP N:OP N:OP N:OP N:N ZCIDV
--------+----+----+----+----+----+----+----+----+----+----+----+----+-------
LDA!A9 2:AD 4:A5 3:.. .:.. .:A1 6:B1 5:B5 4:BD 4:B9 4:.. .:.. .:.. .:x x----
LDX!A2 2:AE 4:A6 3:.. .:.. .:.. .:.. .:.. .:.. .:BE 4:.. .:.. .:B6 4:x x----
LDY!A0 2:AC 4:A4 3:.. .:.. .:.. .:.. .:B4 4:BC 4:.. .:.. .:.. .:.. .:x x----
LSR .. .:4E 6:46 5:4A 2:.. .:.. .:.. .:56 6:5E 7:.. .:.. .:.. .:.. .:0 xx---
NOP .. .:.. .:.. .:.. .:EA 2:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:- -----
ORA 09 2:0D 4:05 3:.. .:.. .:01 6:11 5:15 4:1D 4:19 4:.. .:.. .:.. .:x x----
PHA .. .:.. .:.. .:.. .:48 3:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:- -----
PHP .. .:.. .:.. .:.. .:08 3:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:- -----
PLA .. .:.. .:.. .:.. .:68 4:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:x x----
PLP .. .:.. .:.. .:.. .:28 4:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:Restored
ROL .. .:2E 6:26 5:2A 2:.. .:.. .:.. .:36 6:3E 7:.. .:.. .:.. .:.. .:x xx---
ROR .. .:6E 6:66 5:6A 2:.. .:.. .:.. .:76 6:7E 7:.. .:.. .:.. .:.. .:x xx---
RTI .. .:.. .:.. .:.. .:40 6:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:Restored
RTS .. .:.. .:.. .:.. .:60 6:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:- -----
SBC!E9 2:ED 4:E5 3:.. .:.. .:E1 6:F1 5:F5 4:FD 4:F9 4:.. .:.. .:.. .:x x#--x
SEC .. .:.. .:.. .:.. .:38 2:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:- -1---
SED .. .:.. .:.. .:.. .:F8 2:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:- ---1-
SEI .. .:.. .:.. .:.. .:78 2:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:- --1--
STA .. .:8D 4:85 3:.. .:.. .:81 6:91 6:95 4:9D 5:99 5:.. .:.. .:.. .:- -----
STX .. .:8E 4:86 3:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:96 4:- -----
STY .. .:8C 4:84 3:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:- -----
TAX .. .:.. .:.. .:.. .:AA 2:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:x x----
TAY .. .:.. .:.. .:.. .:A8 2:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:x x----
TSX .. .:.. .:.. .:.. .:BA 2:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:x x----
TXA .. .:.. .:.. .:.. .:8A 2:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:x x----
TXS .. .:.. .:.. .:.. .:9A 2:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:- -----
TYA .. .:.. .:.. .:.. .:98 2:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:x x----
```

## References
- "instruction_timing_table_part1" — expands on the first part of the timing/opcode table (complementary rows)
- "instruction_table_header" — expands on addressing-mode and cycle-count column definitions
- "instruction_table_notes_and_figure" — explains table symbols, page-cross/branch notation, and status-flag annotations

## Mnemonics
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
