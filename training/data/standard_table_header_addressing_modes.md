# Kick Assembler Quick-Reference Header (6502 Addressing-Mode Column Labels)

**Summary:** This section provides the header layout for a Kick Assembler quick-reference table, detailing the column labels for 6502 mnemonics and their corresponding addressing modes. It includes the mnemonic `CLV` with its opcode `$B8` as an example under the no-argument column. Additionally, it lists opcode bytes (`$D5`, `$C1`, `$D1`, `$CD`, `$DD`, `$D9`) aligned with their respective addressing-mode columns. This header serves as a template for subsequent instruction blocks that populate the rows beneath these columns.

**Header Layout**

The table header defines the following columns:

- **cmd**: Mnemonic of the instruction.
- **noarg**: Instructions with no arguments (implied addressing mode).
- **imm**: Immediate addressing mode.
- **zp**: Zero Page addressing mode.
- **zpx**: Zero Page,X addressing mode.
- **zpy**: Zero Page,Y addressing mode.
- **izx**: Indexed Indirect addressing mode.
- **izy**: Indirect Indexed addressing mode.
- **abs**: Absolute addressing mode.
- **abx**: Absolute,X addressing mode.
- **aby**: Absolute,Y addressing mode.

The mnemonic `CLV` (Clear Overflow Flag) is provided as an example under the `noarg` column, with its opcode `$B8`. The opcodes `$D5`, `$C1`, `$D1`, `$CD`, `$DD`, and `$D9` are aligned under their respective addressing-mode columns, corresponding to the `CMP` (Compare Accumulator) instruction in various addressing modes.

## Source Code

```text
Quick Reference

cmd    noarg  imm  zp   zpx  zpy  izx  izy  abs  abx  aby
---------------------------------------------------------
clv    $b8
cmp          $c9  $c5  $d5       $c1  $d1  $cd  $dd  $d9
```

## References

- "branch_and_basic_flag_instructions" — expands on previous rows of the same quick-reference table (branches & flags).
- "compare_instructions_cmp_cpx_cpy" — expands on the next block: compare-family instruction entries in the table.

## Mnemonics
- CLV
- CMP
