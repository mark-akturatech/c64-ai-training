# SED — Set Decimal Mode (Opcode $F8)

**Summary:** SED sets the 6502 Decimal flag (D) to 1. Implied addressing, opcode $F8, 1 byte, 2 cycles; affects only the Decimal status flag.

## Description
Operation: 1 -> D (set Decimal flag). The instruction does not modify the other status flags (N, Z, C, I, V remain unchanged). Addressing mode: Implied. Reference: 3.3.1.

## Source Code
```asm
; SED - Set Decimal Flag
SED         ; Opcode $F8, 1 byte, 2 cycles
```

```text
  SED                       SED Set decimal mode                        SED
                                                        N Z C I D V
  Operation:  1 -> D                                    _ _ _ _ 1 _
                                (Ref: 3.3.1)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Implied       |   SED                 |    F8   |    1    |    2     |
  +----------------+-----------------------+---------+---------+----------+
```

## References
- "sec_set_carry" — SEC instruction (set Carry flag)
- "sei_set_interrupt_disable" — SEI instruction (set Interrupt Disable flag)

## Mnemonics
- SED
