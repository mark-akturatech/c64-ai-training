# INX — Increment Index X

**Summary:** INX (opcode $E8) increments the X index register by one (X = X + 1). Addressing mode: Implied. Size: 1 byte. Cycles: 2. Flags affected: N (negative) and Z (zero).

## Description
INX increments the X register by one and updates the N and Z processor status flags based on the resulting value. Other status flags (C, I, D, V) are unaffected. Operation semantics: X + 1 -> X. (Ref: 7.4)

- Mnemonic: INX
- Opcode: $E8
- Addressing mode: Implied
- Bytes: 1
- Cycles: 2
- Flags affected:
  - N — Negative (set if bit 7 of result is 1)
  - Z — Zero (set if result == 0)

## Source Code
```text
  INX                    INX Increment Index X by one                   INX
                                                        N Z C I D V
  Operation:  X + 1 -> X                                / / _ _ _ _
                                 (Ref: 7.4)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Implied       |   INX                 |    E8   |    1    |    2     |
  +----------------+-----------------------+---------+---------+----------+
```

## References
- "dex_decrement_x" — expands on DEX (decrement X)
- "tax_transfer_a_to_x" — expands on TAX (transfer A to X)
- "ldx_load_x" — expands on LDX (load X from memory)

## Mnemonics
- INX
