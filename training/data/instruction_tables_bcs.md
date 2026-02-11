# BCS (Branch on Carry Set)

**Summary:** BCS is a 6502 relative-mode branch instruction (opcode $B0) that branches when the carry flag (C) = 1. Encoding: $B0, 2 bytes; base cycles 2 with +1 if branch taken within the same page and +2 if branch taken to a different page.

## Operation
Branch if C = 1. The instruction tests the processor carry flag and, when set, adds a signed 8-bit relative offset to the program counter (PC). Flags N, Z, C, I, D, V are unchanged by this instruction.

- Condition: C = 1
- Addressing mode: Relative (signed 8-bit offset from next instruction)
- Effect on flags: none (N Z C I D V remain unchanged)
- Cycle timing: 2 cycles base; add 1 cycle if the branch is taken and target is on the same memory page; add 2 cycles if the branch is taken and target crosses to a different memory page.

(Ref: 4.1.1.4)

## Source Code
```text
  BCS                      BCS Branch on carry set                      BCS

  Operation:  Branch on C = 1                           N Z C I D V
                                                        _ _ _ _ _ _
                               (Ref: 4.1.1.4)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Relative      |   BCS Oper            |    B0   |    2    |    2*    |
  +----------------+-----------------------+---------+---------+----------+
  * Add 1 if branch occurs to same  page.
  * Add 2 if branch occurs to next  page.
```

## References
- "instruction_operation_bcs" — expands on pseudocode for BCS

## Mnemonics
- BCS
