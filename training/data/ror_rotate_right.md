# COMMODORE 64 - ROR

**Summary:** ROR — 6502 Rotate Right through Carry instruction (affects N, Z, C). Addressing modes and opcodes: Accumulator 6A, Zero Page 66, Zero Page,X 76, Absolute 6E, Absolute,X 7E (bytes/cycles vary). Available on MCS650X parts after June 1976.

## Operation
ROR rotates all bits of the accumulator or a memory operand one position to the right through the processor Carry flag: the old Carry becomes bit 7, each bit shifts right, and bit 0 is moved into Carry. Flags affected: N (result bit 7), Z (zero result), C (previous bit 0). Other flags (I, D, V) are not affected by ROR.

- Logical effect (high-level): C <- bit0 ; bits7..1 <- bits6..0 ; bit7 <- old C
- Flags: N = result bit7, Z = (result == 0), C = old bit0

## Addressing modes and encodings (summary)
- Accumulator — opcode 6A — 1 byte, 2 cycles
- Zero Page — opcode 66 — 2 bytes, 5 cycles
- Zero Page,X — opcode 76 — 2 bytes, 6 cycles
- Absolute — opcode 6E — 3 bytes, 6 cycles
- Absolute,X — opcode 7E — 3 bytes, 7 cycles

(See the Source Code section for the original ASCII diagram and the full opcode table.)

## Source Code
```text
ROR          ROR Rotate one bit right (memory or accumulator)         ROR

               +------------------------------+
               |                              |
               |   +-+    +-+-+-+-+-+-+-+-+   |
Operation:      +-> |C| -> |7|6|5|4|3|2|1|0| >-+         N Z C I D V
                   +-+    +-+-+-+-+-+-+-+-+             / / / _ _ _
                                 (Ref: 10.4)

+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Accumulator   |   ROR A               |    6A   |    1    |    2     |
|  Zero Page     |   ROR Oper            |    66   |    2    |    5     |
|  Zero Page,X   |   ROR Oper,X          |    76   |    2    |    6     |
|  Absolute      |   ROR Oper            |    6E   |    3    |    6     |
|  Absolute,X    |   ROR Oper,X          |    7E   |    3    |    7     |
+----------------+-----------------------+---------+---------+----------+

Note: ROR instruction is available on MCS650X microprocessors after
      June, 1976.
```

## References
- "rol_rotate_left" — complementary rotate-left instruction (ROL)
- "lsr_logical_shift_right" — related logical shift-right instruction (LSR)

## Mnemonics
- ROR
