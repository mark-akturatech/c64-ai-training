# PHA — Push Accumulator (PHA, opcode $48)

**Summary:** PHA pushes the accumulator (A) onto the processor stack (stack page $0100). 6502 instruction: implied addressing, opcode $48, size 1 byte, 3 cycles; no processor flags are affected.

## Operation
PHA stores the current accumulator value to the stack and adjusts the stack pointer. On a 6502 this stores A at address $0100 + SP then decrements SP (SP wraps in the zero page stack page). No condition flags (N Z C I D V) are changed by this instruction. Reference: (Ref: 8.5).

Counterpart and related instructions:
- PLA — pull accumulator (pop A from stack)
- PHP — push processor status
- PLP — pull processor status

## Source Code
```text
  PHA                   PHA Push accumulator on stack                   PHA

  Operation:  A toS                                     N Z C I D V
                                                        _ _ _ _ _ _
                                 (Ref: 8.5)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Implied       |   PHA                 |    48   |    1    |    3     |
  +----------------+-----------------------+---------+---------+----------+
```

## References
- "pla_pull_accumulator" — PLA (pull accumulator) instruction (counterpart)
- "php_push_processor_status" — PHP (push processor status) instruction
- "plp_pull_processor_status" — PLP (pull processor status) instruction

## Mnemonics
- PHA
