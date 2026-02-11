# MACHINE - Shift/Rotate and Register/Memory Modify Opcodes (ASL/ROL/LSR/ROR/STX/LDX/DEC/INC)

**Summary:** Opcode encoding grid for ASL, ROL, LSR, ROR, STX, LDX, DEC, INC showing hex opcodes by addressing mode (IMM, ZP, ZP,X, ZP,Y, ABS, ABS,X, ABS,Y) and noting opcode low-nibble patterns (-2, -6, -E). Column header numbers indicate instruction length in bytes (2 or 3).

## Opcode encoding overview
This chunk is a concise opcode matrix for the 6502-style shift/rotate and register/memory modify instructions listed: ASL, ROL, LSR, ROR, STX, LDX, DEC, INC. Columns are addressing modes: IMM (immediate), ZP (zero page), ZP,X (zero page,X), ZP,Y (zero page,Y), ABS (absolute), ABS,X (absolute,X), ABS,Y (absolute,Y). The small numbers beneath each addressing mode in the header indicate instruction length in bytes (2 or 3). Blank cells indicate that the instruction does not support that addressing mode.

A notable pattern called out in the source: many of these opcodes end with the low nibble 2, 6, or E (displayed as "-2, -6, or -E" in the original table).

## Source Code
```text
            *----------------------------------------------------*
            |       IMM   ZP   ZP,X   ZP,Y   ABS   ABS,X   ABS,Y |
            |        2     2     2      2     3      3       3   |
            |     +----------------------------------------------+
            | ASL |       06    16           0E     1E           |
            | ROL |       26    36           2E     3E           |
            | LSR |       46    56           4E     5E           |
            | ROR |       66    76           6E     7E           |
            | STX |       86           96    8E                  |
            | LDX | A2    A6           B6    AE             BE   |
            | DEC |       C6    D6           CE     DE           |
            | INC |       E6    F6           EE     FE           |
            *-----+----------------------------------------------*
                        Op Code ends in -2, -6, or -E
```

## References
- "logical_ops_opcode_endings" — expands on Logical ops opcode-ending patterns for comparison
- "single_byte_opcode_nibble_map" — expands on Single-byte opcode layout (control and register ops)
- "instruction_timing_table_part1" — detailed timing/opcode rows for many of these instructions

## Mnemonics
- ASL
- ROL
- LSR
- ROR
- STX
- LDX
- DEC
- INC
