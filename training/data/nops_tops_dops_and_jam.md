# NMOS 6510 — NOP / Illegal NOP-like Opcodes and JAM Bytes

**Summary:** This document details the NMOS 6510 opcode byte values commonly used as single- or multi-byte NOP variants, their addressing modes, cycle counts, and assembler mnemonics (e.g., NOP, TOP, DOP). It also includes the JAM (CPU lockup) opcodes.

**Overview**

This document compiles opcode byte values that assemblers and programmers commonly treat as NOP-like operations (both single- and multi-byte) or label specially (NOP, TOP, DOP), as well as the bytes that cause CPU lockup (JAM). The source lists many illegal opcodes used as timing/space fillers (with varying assembler naming conventions) and a set of opcodes that halt the CPU ("JAM" — CPU lockup).

The following table provides detailed information on each opcode, including its byte value, addressing mode, cycle count, and assembler mnemonics.

**Opcode Details**

| Opcode | Addressing Mode | Cycles | Mnemonic | Description |
|--------|-----------------|--------|----------|-------------|
| $0C    | Absolute        | 4      | NOP      | No operation |
| $1C    | Absolute,X      | 4*     | NOP      | No operation |
| $80    | Immediate       | 2      | NOP      | No operation |
| $04    | Zero Page       | 3      | NOP      | No operation |
| $14    | Zero Page,X     | 4      | NOP      | No operation |
| $1A    | Implied         | 2      | NOP      | No operation |
| $3A    | Implied         | 2      | NOP      | No operation |
| $82    | Immediate       | 2      | NOP      | No operation |
| $44    | Zero Page       | 3      | NOP      | No operation |
| $34    | Zero Page,X     | 4      | NOP      | No operation |
| $3C    | Absolute,X      | 4*     | NOP      | No operation |
| $5A    | Implied         | 2      | NOP      | No operation |
| $C2    | Immediate       | 2      | NOP      | No operation |
| $64    | Zero Page       | 3      | NOP      | No operation |
| $54    | Zero Page,X     | 4      | NOP      | No operation |
| $5C    | Absolute,X      | 4*     | NOP      | No operation |
| $7A    | Implied         | 2      | NOP      | No operation |
| $E2    | Immediate       | 2      | NOP      | No operation |
| $74    | Zero Page,X     | 4      | NOP      | No operation |
| $7C    | Absolute,X      | 4*     | NOP      | No operation |
| $DA    | Implied         | 2      | NOP      | No operation |
| $89    | Immediate       | 2      | NOP      | No operation |
| $D4    | Zero Page,X     | 4      | NOP      | No operation |
| $DC    | Absolute,X      | 4*     | NOP      | No operation |
| $FA    | Implied         | 2      | NOP      | No operation |
| $F4    | Zero Page,X     | 4      | NOP      | No operation |
| $FC    | Absolute,X      | 4*     | NOP      | No operation |
| $02    | Implied         | 1      | JAM      | CPU lockup |
| $12    | Implied         | 1      | JAM      | CPU lockup |
| $22    | Implied         | 1      | JAM      | CPU lockup |
| $32    | Implied         | 1      | JAM      | CPU lockup |
| $42    | Implied         | 1      | JAM      | CPU lockup |
| $52    | Implied         | 1      | JAM      | CPU lockup |
| $62    | Implied         | 1      | JAM      | CPU lockup |
| $72    | Implied         | 1      | JAM      | CPU lockup |
| $92    | Implied         | 1      | JAM      | CPU lockup |
| $B2    | Implied         | 1      | JAM      | CPU lockup |
| $D2    | Implied         | 1      | JAM      | CPU lockup |
| $F2    | Implied         | 1      | JAM      | CPU lockup |

*Note: Opcodes marked with an asterisk (*) add 1 cycle if a page boundary is crossed.*

The above information is compiled from various sources, including the C64-Wiki and masswerk.at.

**Assembler Mnemonics**

Different assemblers may use varying mnemonics for the same opcode. For example, the opcode $02 is commonly referred to as JAM, but some assemblers may use KIL or HLT. Similarly, NOP-like opcodes may be labeled as NOP, DOP, or TOP, depending on the assembler. It's essential to refer to the specific assembler's documentation for accurate mnemonic usage.

## References

- "ane_xaa_mnemonics" — expands on ANE/XAA illegal opcode mnemonics
- "opcode_naming_table_header" — expands on table format and addressing-mode columns

## Mnemonics
- NOP
- JAM
