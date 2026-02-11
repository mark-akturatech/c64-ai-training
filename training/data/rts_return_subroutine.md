# RTS (Return from Subroutine)

**Summary:** 6502/6510 RTS (Return from Subroutine) — opcode $60 (96 decimal), implied addressing, 1 byte, 6 cycles. Pulls the return address (PCL then PCH) from the stack, sets PC to that address + 1, and does not affect processor status flags.

## Description
- Assembly form: RTS
- Addressing mode: Implied
- Operation (exact): Pull PC from stack, then PC + 1 -> PC
  - Implementation detail: the CPU pulls the low byte (PCL) then the high byte (PCH) from the stack, forms the return address, then adds 1 to that address and loads it into PC.
- Affected flags: none (N Z C I D V unchanged)
- Size: 1 byte
- Cycles: 6
- Typical pairing: used to return from a subroutine invoked with JSR (see referenced JSR chunk)

## Source Code
```text
  RTS                    RTS Return from subroutine                     RTS
                                                        N Z C I D V
  Operation:  PC fromS, PC + 1 -> PC                    _ _ _ _ _ _
                                 (Ref: 8.2)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Implied       |   RTS                 |    60   |    1    |    6     |
  +----------------+-----------------------+---------+---------+----------+
```

## References
- "jsr_jump_save_return" — JSR (call) instruction that pairs with RTS
- "jmp_jump" — JMP (unconditional jump) instruction (control-flow relation)

## Mnemonics
- RTS
