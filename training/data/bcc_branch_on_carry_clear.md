# BCC — Branch on Carry Clear

**Summary:** BCC (Branch on Carry Clear) is a 6502 relative-branch instruction that tests the Carry flag (C = 0). Opcode $90, 2 bytes; cycles: 2 if not taken, +1 if branch taken to same page, +2 if branch taken to different page.

## Description
Operation: Branch when Carry flag C = 0 (i.e., branch occurs if C = 0). Affected processor status flags: none changed.

Status flags row (for reference): N Z C I D V

Reference: 4.1.1.3

## Source Code
```text
  BCC                     BCC Branch on Carry Clear                     BCC
                                                        N Z C I D V
  Operation:  Branch on C = 0                           _ _ _ _ _ _
                               (Ref: 4.1.1.3)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Relative      |   BCC Oper            |    90   |    2    |    2*    |
  +----------------+-----------------------+---------+---------+----------+
  * Add 1 if branch occurs to same page.
  * Add 2 if branch occurs to different page.
```

## References
- "asl_arithmetic_shift_left_instruction" — expands on the preceding ASL instruction
- "bcs_branch_on_carry_set" — covers the paired carry-true branch (BCS)

## Mnemonics
- BCC
