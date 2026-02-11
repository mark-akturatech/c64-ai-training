# SED — Set Decimal Mode (6502)

**Summary:** Sets the processor status Decimal flag (D) to 1. Opcode $F8, implied addressing, 1 byte, 2 cycles; does not alter N, Z, C, I, or V flags.

## Operation
SED (Set Decimal Mode) sets the Decimal flag in the 6502 status register to 1 (enables BCD mode for ADC/SBC). Operation: 1 -> D. Other status flags are unaffected.

- Mnemonic: SED
- Opcode: $F8
- Addressing: Implied
- Bytes: 1
- Cycles: 2
- Flags affected: D set to 1; N, Z, C, I, V unchanged
- Reference: (Ref: 3.3.1)

## Source Code
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
- "instruction_operation_sed" — expands on SED pseudocode and implementation details

## Mnemonics
- SED
