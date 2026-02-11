# CLI — Clear Interrupt Disable Bit

**Summary:** 6502 instruction CLI clears the interrupt-disable flag (I) in the processor status register; implied addressing, opcode $58, 1 byte, 2 cycles, affects status flags (N Z C I D V). Reference: manual section 3.2.2.

## Operation
CLI clears the I (interrupt disable) bit in the processor status: I := 0 (interrupts enabled). All other status flags are unaffected by this instruction.

Flags notation (showing I cleared):
N Z C I D V
_ _ _ 0 _ _

Addressing mode: Implied — no operand bytes are fetched.

Manual reference: (Ref: 3.2.2)

**[Note: Source lists OP CODE as "58" — interpreted here as hexadecimal $58 (standard 6502 encoding).]**

## Source Code
```text
  CLI                  CLI Clear interrupt disable bit                  CLI

  Operation: 0 -> I                                     N Z C I D V
                                                        _ _ _ 0 _ _
                                (Ref: 3.2.2)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Implied       |   CLI                 |    58   |    1    |    2     |
  +----------------+-----------------------+---------+---------+----------+
```

## References
- "cld_clear_decimal_mode" — expands on previous flag-clearing instruction (CLD)
- "clv_clear_overflow_flag" — expands on next flag-clearing instruction (CLV)

## Mnemonics
- CLI
