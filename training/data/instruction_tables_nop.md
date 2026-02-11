# 6502 NOP (No Operation) — opcode $EA

**Summary:** NOP (opcode $EA) — implied addressing, 1 byte, 2 cycles; performs no operation and does not change processor status flags (N, Z, C, I, D, V).

## Description
NOP is the no-operation instruction for the 6502. It uses implied addressing, occupies one byte, and consumes two CPU cycles. It performs no state changes: registers (A, X, Y, SP, PC aside from PC increment) and all status flags remain unchanged.

Status flags after NOP:
- N Z C I D V = _ _ _ _ _ _ (unchanged)

## Source Code
```text
  NOP                         NOP No operation                          NOP
                                                        N Z C I D V
  Operation:  No Operation (2 cycles)                   _ _ _ _ _ _

  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Implied       |   NOP                 |    EA   |    1    |    2     |
  +----------------+-----------------------+---------+---------+----------+
```

## References
- "instruction_operation_nop" — expands on NOP pseudocode

## Mnemonics
- NOP
