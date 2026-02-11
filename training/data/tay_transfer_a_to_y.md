# TAY — Transfer Accumulator to Index Y (Opcode $A8)

**Summary:** Opcode $A8 (TAY) — Implied addressing, 1 byte, 2 CPU cycles. Transfers the accumulator (A) into the Y index register and updates the N and Z flags (N = sign bit from result, Z = result is zero).

## Operation
TAY copies the value in the accumulator into the Y register (A -> Y). Flags affected:
- N (Negative): set from bit 7 of the result (the value now in Y)
- Z (Zero): set if the result (Y) is zero
- C, I, D, V: unaffected

Assembly mnemonic: TAY
Addressing mode: Implied
Opcode: $A8
Bytes: 1
Cycles: 2
Reference: (Ref: 7.13)

## Source Code
```text
TAY                TAY Transfer accumulator to index Y                TAY

Operation:  A -> Y                                    N Z C I D V
                                                      / / _ _ _ _
                             (Ref: 7.13)
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Implied       |   TAY                 |    A8   |    1    |    2     |
+----------------+-----------------------+---------+---------+----------+
```

## References
- "tax_transfer_a_to_x" — expands on TAX (transfer A to X) — similar register transfer
- "ldy_load_y" — expands on LDY (load Y) — Y register load relation
- "dey_decrement_y" — expands on DEY (decrement Y) — operations affecting Y register

## Mnemonics
- TAY
