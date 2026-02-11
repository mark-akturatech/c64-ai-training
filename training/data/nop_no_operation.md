# NOP (EA)

**Summary:** NOP — No Operation instruction; opcode $EA, implied addressing, size 1 byte, 2 cycles; does not affect processor status flags (N Z C I D V).

## Description
Performs no operation for the stated cycle count. Instruction encoding: opcode $EA, one byte long, consumes 2 CPU cycles. Processor status flags are unchanged by NOP (N Z C I D V remain as they were).

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
- "rti_return_interrupt" — expands on RTI (interrupt return), control flow/interrupt related
- "jsr_jump_save_return" — expands on JSR (subroutine call), control-flow instruction

## Mnemonics
- NOP
