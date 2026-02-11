# 6502 ROL (Rotate Left)

**Summary:** ROL rotates one bit left through the carry flag (C -> bit0, old bit7 -> C). Affects N/Z/C flags. Opcodes: $2A (Accumulator), $26/$36 (Zero Page/Zero Page,X), $2E/$3E (Absolute/Absolute,X).

## Operation
ROL shifts the 8-bit operand left one bit. The processor carry flag is shifted into bit0; the operand's previous bit7 is shifted into the carry flag.

- Operation (bit flow): C -> bit0, bits 0..6 <- bits 1..7, old bit7 -> C
- Flags affected:
  - N (Negative): set from resulting bit7
  - Z (Zero): set if result == 0
  - C (Carry): set to the operand's previous bit7
  - I, D, V: unaffected

(Refers to standard 6502 behavior for rotate-through-carry instructions.)

## Source Code
```text
Operation diagram:
               +------------------------------+
               |         M or A               |
               |   +-+-+-+-+-+-+-+-+    +-+   |
Operation:   +-< |7|6|5|4|3|2|1|0| <- |C| <-+         N Z C I D V
                   +-+-+-+-+-+-+-+-+    +-+             / / / _ _ _
                                 (Ref: 10.3)

Opcode / Addressing modes table:
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
| Accumulator    | ROL A                 | $2A     |    1    |    2     |
| Zero Page      | ROL Oper              | $26     |    2    |    5     |
| Zero Page,X    | ROL Oper,X            | $36     |    2    |    6     |
| Absolute       | ROL Oper              | $2E     |    3    |    6     |
| Absolute,X     | ROL Oper,X            | $3E     |    3    |    7     |
+----------------+-----------------------+---------+---------+----------+
```

## References
- "instruction_operation_rol" — expands on ROL pseudocode and details

## Mnemonics
- ROL
