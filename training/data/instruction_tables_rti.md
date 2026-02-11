# RTI (Return from Interrupt) — 6502 instruction

**Summary:** RTI (opcode $40) returns from an interrupt by pulling the processor status (P) and the program counter (PC) from the stack (stack at $0100-$01FF). The instruction is 1 byte and takes 6 cycles.

**Operation**

RTI is an implied addressing instruction. Upon execution, the processor restores the saved processor status and program counter from the stack and resumes execution at the restored PC.

Behavior (operation sequence):

1. **Pull P from stack**: Load the byte from the stack into the processor status register (P). This byte contains the status flags as they were when the interrupt occurred.
2. **Pull PCL (low byte) from stack**: Load the next byte from the stack into the low 8 bits of the program counter (PC).
3. **Pull PCH (high byte) from stack**: Load the following byte from the stack into the high 8 bits of the program counter (PC).
4. **Set PC**: Combine PCL and PCH to form the full 16-bit program counter and resume execution at this address.

Effects on flags:

- The status register bits (N, V, D, I, Z, C) are restored from the byte pulled from the stack. The Break (B) flag and the unused bit (bit 5) are handled as follows:
  - **Break (B) flag**: This flag is not an actual flag implemented in the processor's status register. It appears only when the status register is pushed onto or pulled from the stack. When pushed, it is set to 1 if the transfer was caused by a BRK or PHP instruction and set to 0 if caused by a hardware interrupt. When pulled into the status register (by PLP or RTI), it is ignored. ([masswerk.at](https://www.masswerk.at/6502/6502_instruction_set.html?utm_source=openai))
  - **Unused bit (bit 5)**: This bit is always set to 1 when the status register is pushed to the stack. When the status register is pulled from the stack, this bit is ignored. ([masswerk.at](https://www.masswerk.at/6502/6502_instruction_set.html?utm_source=openai))

Timing and size:

- Addressing mode: Implied
- Bytes: 1
- Cycles: 6

## Source Code

```text
  RTI                    RTI Return from interrupt                      RTI
                                                        N Z C I D V
  Operation:  P fromS PC fromS                           From Stack
                                 (Ref: 9.6)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Implied       |   RTI                 |    40   |    1    |    6     |
  +----------------+-----------------------+---------+---------+----------+
```

## References

- "instruction_operation_rti" — expands on RTI pseudocode (P and PC pulled from stack)
- 6502 Instruction Set ([masswerk.at](https://www.masswerk.at/6502/6502_instruction_set.html?utm_source=openai))

## Mnemonics
- RTI
