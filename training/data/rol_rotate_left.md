# ROL — Rotate one bit left (6502)

**Summary:** ROL rotates the accumulator or a memory operand one bit left through the Carry flag (bit7 -> Carry, Carry -> bit0). Opcodes 2A / 26 / 36 / 2E / 3E (Accumulator, Zero Page, Zero Page,X, Absolute, Absolute,X); affects N, Z, C flags.

## Operation
ROL performs a left rotate through the processor Carry:
- The eight-bit operand (memory or accumulator) is shifted left one bit.
- The high bit (bit 7) is moved into Carry.
- The previous Carry is shifted into bit 0 of the result.
- Flags affected: N (set from bit7), Z (set if result == 0), C (set from former bit7).
- Flags unaffected: I, D, V.

(Ref: 10.3)

## Source Code
```text
  ROL          ROL Rotate one bit left (memory or accumulator)          ROL

               +------------------------------+
               |         M or A               |
               |   +-+-+-+-+-+-+-+-+    +-+   |
  Operation:   +-< |7|6|5|4|3|2|1|0| <- |C| <-+         N Z C I D V
                   +-+-+-+-+-+-+-+-+    +-+             / / / _ _ _
                                 (Ref: 10.3)

  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Accumulator   |   ROL A               |    2A   |    1    |    2     |
  |  Zero Page     |   ROL Oper            |    26   |    2    |    5     |
  |  Zero Page,X   |   ROL Oper,X          |    36   |    2    |    6     |
  |  Absolute      |   ROL Oper            |    2E   |    3    |    6     |
  |  Absolute,X    |   ROL Oper,X          |    3E   |    3    |    7     |
  +----------------+-----------------------+---------+---------+----------+
```

## References
- "ror_rotate_right" — related rotate-right instruction (ROR)
- "lsr_logical_shift_right" — related logical shift-right instruction (LSR)

## Mnemonics
- ROL
