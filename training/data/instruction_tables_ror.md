# 6502 ROR (Rotate Right)

**Summary:** 6502 ROR (Rotate Right) rotates the operand one bit right through the Carry flag (C -> bit7, bit0 -> C). Opcodes: $6A (A), $66 (zp), $76 (zp,X), $6E (abs), $7E (abs,X). Affects flags N, Z, C.

## Operation
ROR shifts the entire 8-bit operand one bit toward bit0; the former bit0 becomes the new Carry, and the prior Carry becomes the new bit7. The instruction may operate on the accumulator or a memory operand (zero page, zero page,X, absolute, absolute,X).

- Bit flow: Carry -> bit7, bits 7..1 -> bits 6..0, bit0 -> Carry.
- Flags:
  - C: set to the value of the bit shifted out (original bit0).
  - N: set to the result's bit7.
  - Z: set if the result is zero.
  - I, D, V: unaffected.
- Availability: Present on MCS650X-family microprocessors (introduced June 1976).

## Source Code
```text
Operation diagram:
    +------------------------------+
    |                              |
    |   +-+    +-+-+-+-+-+-+-+-+   |
    +-> |C| -> |7|6|5|4|3|2|1|0| >-+
        +-+    +-+-+-+-+-+-+-+-+
       (Carry in)           (Carry out = old bit0)
(Ref: 10.4)

Opcode / Addressing modes / bytes / cycles
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
| Accumulator    | ROR A                 | $6A     | 1       | 2        |
| Zero Page      | ROR Oper              | $66     | 2       | 5        |
| Zero Page,X    | ROR Oper,X            | $76     | 2       | 6        |
| Absolute       | ROR Oper              | $6E     | 3       | 6        |
| Absolute,X     | ROR Oper,X            | $7E     | 3       | 7        |
+----------------+-----------------------+---------+---------+----------+

Flags affected summary:
- N: set from result bit7
- Z: set if result == 0
- C: set to original bit0
- I, D, V: unchanged

Note: ROR instruction is available on MCS650X microprocessors after June, 1976.
```

## References
- "instruction_operation_ror" — expands on ROR pseudocode and detailed behavior

## Mnemonics
- ROR
