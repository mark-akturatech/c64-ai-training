# DEC — Decrement Memory by One (6502 / MCS6510)

**Summary:** DEC decrements a memory location by one (M - 1 -> M). Opcodes: Zero Page $C6, Zero Page,X $D6, Absolute $CE, Absolute,X $DE. Affects N and Z flags; C, I, D, V are unchanged. (Ref: 10.7)

## Operation
DEC performs a read-modify-write on a memory operand: it reads the memory byte, subtracts one modulo 256, and writes the result back to the same memory location. The Negative (N) flag is set according to bit 7 of the result; the Zero (Z) flag is set if the result is zero. Carry (C), Interrupt Disable (I), Decimal (D) and Overflow (V) flags are not affected.

Supported addressing modes: Zero Page, Zero Page,X, Absolute, Absolute,X. Instruction lengths and cycle counts vary by addressing mode (see Source Code table).

Ref: 10.7 (MCS6510 / 6502 instruction set documentation).

## Source Code
```text
Operation:  M - 1 -> M                                N Z C I D V
                                                        / / _ _ _ _
                                 (Ref: 10.7)
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Zero Page     |   DEC Oper            |    C6   |    2    |    5     |
|  Zero Page,X   |   DEC Oper,X          |    D6   |    2    |    6     |
|  Absolute      |   DEC Oper            |    CE   |    3    |    6     |
|  Absolute,X    |   DEC Oper,X          |    DE   |    3    |    7     |
+----------------+-----------------------+---------+---------+----------+
```

## References
- "cpy_compare_index_y" — expands on CPY (compare instruction) and related indexing notes
- "mcs6510_instruction_set_part1" — original larger chunk / overview of the MCS6510 instruction set

## Mnemonics
- DEC
