# SEI — Set Interrupt Disable (opcode $78)

**Summary:** SEI (opcode $78) is an implied 6502 instruction that sets the processor status I (Interrupt Disable) flag to 1, preventing maskable IRQs; 1 byte, 2 clock cycles ($78, implied).

## Operation
SEI sets the Interrupt Disable flag (I) in the processor status register to 1. This masks (disables) maskable IRQ interrupts; it does not affect the other status flags. Addressing mode: implied.

Pseudocode (behavioral):
- I := 1
- No other status flags changed

Flags affected:
- I — set to 1
- N, Z, C, D, V — unchanged

Timing:
- Instruction length: 1 byte
- Execution time: 2 CPU cycles

## Source Code
```text
  SEI                 SEI Set interrupt disable status                  SED
                                                        N Z C I D V
  Operation:  1 -> I                                    _ _ _ 1 _ _
                                (Ref: 3.2.1)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Implied       |   SEI                 |    78   |    1    |    2     |
  +----------------+-----------------------+---------+---------+----------+
```

## References
- "instruction_operation_sei" — expands on SEI pseudocode and operation details

## Mnemonics
- SEI
