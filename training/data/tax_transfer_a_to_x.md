# TAX — Transfer accumulator to index X

**Summary:** 6502/TAX instruction (opcode $AA) — implied addressing, 1 byte, 2 cycles. Transfers A -> X and updates the N and Z processor flags (reflecting the new X); does not affect C, I, D, V.

## Description
TAX copies the contents of the accumulator (A) into the X index register (X). Addressing mode is implied. The instruction updates the Negative (N) and Zero (Z) flags to reflect the new value in X; other flags (Carry, Interrupt disable, Decimal, Overflow) are not affected. Assembly mnemonic: TAX. Opcode: $AA. Size: 1 byte. Cycles: 2.

Short reference: Operation: A -> X. Flags affected: N, Z. (Ref: 7.11)

## Source Code
```text
TAX                TAX Transfer accumulator to index X                TAX

Operation:  A -> X                                    N Z C I D V
                                                      / / _ _ _ _
                                 (Ref: 7.11)
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Implied       |   TAX                 |    AA   |    1    |    2     |
+----------------+-----------------------+---------+---------+----------+
```

## References
- "tay_transfer_a_to_y" — TAY (transfer A to Y)
- "ldx_load_x" — LDX (load X)
- "dex_decrement_x" — DEX (decrement X)

## Mnemonics
- TAX
