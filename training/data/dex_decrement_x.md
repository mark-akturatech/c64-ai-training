# DEX (Decrement X)

**Summary:** DEX decrements the X index register by one (X <- X - 1). Implied addressing, opcode $CA, 1 byte, 2 cycles; affects N (negative) and Z (zero) flags only.

## Operation
DEX subtracts one from the X register and stores the result back in X. It updates:
- N (Negative) — set from bit 7 of the result
- Z (Zero) — set if result == 0
C, I, D, V are not affected. ("/" = affected, "_" = unaffected)

Reference: 7.6

## Source Code
```text
DEX                   DEX  Decrement index X by one                    DEX

Operation:  X - 1 -> X                                N Z C I D V
                                                      / / _ _ _ _
                                 (Ref: 7.6)

+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Implied       |   DEX                 |   $CA   |    1    |    2     |
+----------------+-----------------------+---------+---------+----------+
```

## References
- "dey_decrement_y" — expands on decrement Y instruction (related index operation)
- "inx_increment_x" — expands on increment X instruction (inverse operation)
- "ldx_load_x" — expands on loading X from memory
- "tax_transfer_a_to_x" — expands on transfer A to X (register transfer affecting X)

## Mnemonics
- DEX
