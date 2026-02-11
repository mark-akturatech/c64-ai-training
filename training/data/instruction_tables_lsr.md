# 6502 LSR (Logical Shift Right)

**Summary:** LSR shifts the accumulator or a memory operand right one bit, moving bit0 into the Carry flag and filling bit7 with 0; affects N (cleared), Z (zero), and C (carry). Addressing modes/opcodes: Accumulator $4A, Zero Page $46, Zero Page,X $56, Absolute $4E, Absolute,X $5E.

## Operation
LSR shifts the operand one bit to the right. The low bit (bit0) is transferred into the Carry flag; the high bit (bit7) is set to 0. The Zero flag is set if the result is zero; the Negative flag is cleared because bit7 is always 0 after the shift.

- Semantic effect: result = operand >> 1; C <- old bit0; bit7 <- 0.
- Affects flags: C (new = old bit0), Z (set if result == 0), N (cleared).

See the opcode/addressing table and operation diagram in the Source Code section.

## Source Code
```text
                   +-+-+-+-+-+-+-+-+
Operation:  0 -> |7|6|5|4|3|2|1|0| -> C
                   +-+-+-+-+-+-+-+-+
                                 (Ref: 10.1)

+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Accumulator   |   LSR A               |    $4A  |    1    |    2     |
|  Zero Page     |   LSR Oper            |    $46  |    2    |    5     |
|  Zero Page,X   |   LSR Oper,X          |    $56  |    2    |    6     |
|  Absolute      |   LSR Oper            |    $4E  |    3    |    6     |
|  Absolute,X    |   LSR Oper,X          |    $5E  |    3    |    7     |
+----------------+-----------------------+---------+---------+----------+
```

## References
- "instruction_operation_lsr" — expands on LSR pseudocode and detailed operation.

## Mnemonics
- LSR
