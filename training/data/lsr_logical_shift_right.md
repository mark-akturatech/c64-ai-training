# LSR — Logical Shift Right (6502 / Commodore 64)

**Summary:** LSR (Logical Shift Right) shifts a byte right one bit, inserting 0 into bit 7 and moving bit 0 into the Carry flag; affects N (cleared), Z, C. Opcodes: accumulator 4A, zero page 46, zero page,X 56, absolute 4E, absolute,X 5E; see cycles/bytes below.

## Operation
LSR shifts the operand one bit toward the least-significant bit:

- Operation: 0 -> bit7..bit0 -> C (bit0 moves into Carry).
- The high bit (bit7) is always filled with 0.
- Resulting N flag is cleared (since bit7 = 0 after the shift).
- Z (zero) is set if the result is zero; otherwise cleared.
- C (carry) is set to the original bit0 of the operand.

(Accumulator refers to the A register.)

## Instruction summary
- Affects flags: N (cleared), Z (set if result = 0), C (original bit0). I, D, V are unaffected.
- Use LSR for unsigned divide-by-2 operations or bit testing where original LSB is needed in Carry.
- Addressing modes and timing are provided in the reference table (see Source Code).

## Source Code
```text
Operation:  0 -> |7|6|5|4|3|2|1|0| -> C
             +-+-+-+-+-+-+-+-+
Flags:       N Z C I D V
             0 / / _ _ _
             (Ref: 10.1)

+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Accumulator   |   LSR A               |    4A   |    1    |    2     |
|  Zero Page     |   LSR Oper            |    46   |    2    |    5     |
|  Zero Page,X   |   LSR Oper,X          |    56   |    2    |    6     |
|  Absolute      |   LSR Oper            |    4E   |    3    |    6     |
|  Absolute,X    |   LSR Oper,X          |    5E   |    3    |    7     |
+----------------+-----------------------+---------+---------+----------+
```

## References
- "rol_rotate_left" — expands on ROL (rotate left) related instruction
- "ror_rotate_right" — expands on ROR (rotate right) related instruction

## Mnemonics
- LSR
