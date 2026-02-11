# 6502 BPL (Branch on Result Plus) — opcode $10

**Summary:** BPL (opcode $10) is a Relative-mode branch that transfers control when the N flag = 0. Uses a signed 8-bit offset (relative addressing); timing: 2 bytes, 2 cycles base with page-crossing penalties.

**Description**
BPL (Branch on Result Plus) tests the Negative (N) flag and branches when N = 0. Addressing mode is Relative (signed 8-bit offset added to the program counter). The instruction does not modify processor flags.

- Condition: Branch if N = 0.
- Addressing: Relative (8-bit signed offset).
- Flags tested/affected: Tests N; does not change N, Z, C, I, D, V.

Timing note: Base 2 cycles; additional cycles apply when the branch is taken — 1 extra cycle if the destination is on the same page, 2 extra cycles if the destination crosses a page boundary.

## Source Code
```text
  BPL                     BPL Branch on result plus                     BPL

  Operation:  Branch on N = 0                           N Z C I D V
                                                        _ _ _ _ _ _
                               (Ref: 4.1.1.2)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Relative      |   BPL Oper            |    10   |    2    |    2*    |
  +----------------+-----------------------+---------+---------+----------+
  * Add 1 if branch occurs to same page.
  * Add 2 if branch occurs to different page.
```

## References
- "instruction_operation_bpl" — expands on BPL pseudocode

## Mnemonics
- BPL
