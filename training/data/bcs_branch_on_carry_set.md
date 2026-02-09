# BCS — Branch on Carry Set

**Summary:** BCS ($B0) is the 6502 relative branch instruction that transfers control when the Carry flag (C) = 1; Relative addressing, opcode $B0, 2 bytes, 2 cycles (+1 or +2 timing adjustments for page boundaries).

## Operation
BCS tests the processor Carry flag and branches when C = 1. It does not modify processor status flags.

Flags:
- N Z C I D V — no flags are changed by this instruction.

Reference: (Ref: 4.1.1.4)

Timing notes:
- Base: 2 cycles when branch not taken.
- When branch is taken: add 1 cycle if the branch target is within the same 256-byte page, add 2 cycles if the branch target is on a different page (page-crossing).

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

## Key Registers
- (none) — instruction-level operation; no direct chip register addresses.

## References
- "bcc_branch_on_carry_clear" — paired carry branch (BCC)
- "beq_branch_on_result_zero" — branch on zero result (BEQ)