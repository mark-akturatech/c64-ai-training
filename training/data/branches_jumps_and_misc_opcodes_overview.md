# MACHINE — Branch, Jump opcodes and low-nibble opcode patterns

**Summary:** Lists 6502 branch opcodes (BPL/BMI/BVC/BVS/BCC/BCS/BNE/BEQ), jump/JSR opcodes (JMP, JSR), and a misc. opcode map for BIT, STY, LDY, CPY, CPX showing addressing-mode opcode bytes and the low-nibble patterns (-0, -4, -C) used for IMM / ZP / ABS forms.

## Overview
- Branch opcodes shown with their hex byte values: BPL 10, BMI 30, BVC 50, BVS 70, BCC 90, BCS B0, BNE D0, BEQ F0 (all branch opcodes end with low nibble 0).
- JSR and JMP opcodes: JSR = $20, JMP absolute = $4C, JMP indirect = $6C.
- The miscellaneous table groups BIT/STY/LDY/CPY/CPX and demonstrates the addressing-mode opcode pattern: immediate forms end with nibble 0, zero page forms end with nibble 4, absolute forms end with nibble C (summarized as "Misc. -0, -4, -C").
- Examples from the table:
  - BIT: ZP = $24, ABS = $2C
  - STY: ZP = $84, ZP,X = $94, ABS = $8C
  - LDY: IMM = $A0, ZP = $A4, ZP,X = $B4, ABS = $AC, ABS,X = $BC
  - CPY: IMM = $C0, ZP = $C4, ABS = $CC
  - CPX: IMM = $E0, ZP = $E4, ABS = $EC

This chunk documents opcode-byte mappings and the consistent low-nibble addressing-mode pattern for these instruction groups (useful for opcode decoding and for table-driven assemblers/disassemblers).

## Source Code
```text
 *--------+--------*  *------------------*  *------------------------------*
 | BPL 10 | BMI 30 |  |       ABS  (IND) |  |       IMM  ZP ZP,X ABS ABS,X |
 | BVC 50 | BVS 70 |  |     +------------+  |        2    2   2   3    3   | 
 | BCC 90 | BCS B0 |  | JSR | 20         |  |     +------------------------+
 | BNE D0 | BEQ F0 |  | JMP | 4C    6C   |  | BIT |      24      2C        |
 *--------+--------*  *-----+------------*  | STY |      84  94  8C        |
     Branches -0             Jumps          | LDY | A0   A4  B4  AC   BC   |
                                            | CPY | C0   C4      CC        |
                                            | CPX | E0   E4      EC        |
                                            *-----+------------------------*
                                                    Misc. -0, -4, -C
```

## References
- "single_byte_opcode_nibble_map" — expands on single-byte opcode patterns and control instruction grouping
- "instruction_table_header" — expands on Addresses/mode column definitions and cycle counts used by these opcodes
- "instruction_timing_table_part1" — expands on full timing/opcode rows for branches and jump-related instructions

## Mnemonics
- BPL
- BMI
- BVC
- BVS
- BCC
- BCS
- BNE
- BEQ
- JSR
- JMP
- BIT
- STY
- LDY
- CPY
- CPX
