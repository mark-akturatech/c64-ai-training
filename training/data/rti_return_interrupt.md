# RTI — Return from Interrupt

**Summary:** RTI (Implied) pulls processor status P and the program counter PC from the stack to return from an interrupt. Opcode $40, 1 byte, 6 cycles, affects processor flags by restoring the saved status from the stack.

## Operation
RTI restores the processor state saved on the stack by an interrupt: it pulls the processor status byte (P) from the stack, then pulls the low and high bytes of the return address (PC) from the stack and loads them into the PC. The instruction is implied addressing and does not take operands.

Behavior summary:
- Assembly: RTI
- Addressing mode: Implied
- Operation: P ← pull from stack; PC ← pull low byte, pull high byte
- Opcode: $40
- Size: 1 byte
- Cycles: 6
- Flags: All processor flags are restored from the pulled status byte (including I, D, V, N, Z, C as they were when pushed)

**[Note: Source may contain an error — opcode listed as 4D in the provided table; documented RTI opcode is $40.]**

(See reference 9.6 for the stack/interrupt sequence.)

## Source Code
```text
  RTI                    RTI Return from interrupt                      RTI
                                                        N Z C I D V
  Operation:  P fromS PC fromS                           From Stack
                                 (Ref: 9.6)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Implied       |   RTI                 |    4D   |    1    |    6     |
  +----------------+-----------------------+---------+---------+----------+

---
Additional information can be found by searching:
- "plp_pull_processor_status" which expands on PLP — also pulls status from stack
- "sei_set_interrupt_disable" which expands on SEI — sets I flag affecting interrupts
- "rts_return_subroutine" which expands on RTS — return from subroutine (control-flow return)
```

## References
- "plp_pull_processor_status" — expands on PLP (pull processor status from stack)
- "sei_set_interrupt_disable" — expands on SEI (set interrupt disable flag)
- "rts_return_subroutine" — expands on RTS (return from subroutine)

## Mnemonics
- RTI
