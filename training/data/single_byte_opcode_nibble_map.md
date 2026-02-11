# Single-byte Op Codes -0, -8, -A

**Summary:** Nibble-style map of 6502 single-byte (implied/accumulator) opcodes showing mnemonics: BRK, RTI, RTS, PHP, CLC, PLP, SEC, PHA, CLI, PLA, SEI, ASL A, ROL A, LSR A, ROR A, and register/flag operations (DEY, TYA, TAY, CLV, INY, CLD, INX, SED, TXA, TXS, TAX, TSX, DEX, NOP). Rows are high-nibble groups (-0 = 0x0?, -8 = 0x8?, -A = 0xA?) and columns are low-nibble groups (0-7, 8-F).

## Overview
This chunk is a compact visual map of single-byte 6502 opcodes that use implied or accumulator addressing (single-byte opcodes). The map arranges opcodes by high nibble (row labels -0, -8, -A corresponding to opcode ranges 0x0_, 0x8_, 0xA_) and by low-nibble column groups (left block 0-7, right block 8-F). Use it as a quick reference for which single-byte mnemonics appear in those opcode nibbles. (Implied/accumulator = no operand bytes.)

## Source Code
```text
        *------------------------------------------------------------*
        |       0-     1-     2-     3-     4-     5-     6-     7-  |
        |    +-------------------------------------------------------+
        | -0 | BRK                         RTI           RTS         |
        | -8 | PHP    CLC    PLP    SEC    PHA    CLI    PLA    SEI  |
        | -A | ASL-A         ROL-A         LSR-A         ROR-A       |
        |    +-------------------------------------------------------+
        |       8-     9-     A-     B-     C-     D-     E-     F-  |
        |    +-------------------------------------------------------+
        | -0 |                                                       |
        | -8 | DEY    TYA    TAY    CLV    INY    CLD    INX    SED  |
        | -A | TXA    TXS    TAX    TSX    DEX           NOP         |
        *----+-------------------------------------------------------*
                       Single-byte Op Codes -0, -8, -A
```

## References
- "branches_jumps_and_misc_opcodes_overview" — branch and jump opcode overview complementing this single-byte map
- "instruction_table_header" — header information for the instruction timing table that follows

## Mnemonics
- BRK
- RTI
- RTS
- PHP
- CLC
- PLP
- SEC
- PHA
- CLI
- PLA
- SEI
- ASL
- ROL
- LSR
- ROR
- DEY
- TYA
- TAY
- CLV
- INY
- CLD
- INX
- SED
- TXA
- TXS
- TAX
- TSX
- DEX
- NOP
