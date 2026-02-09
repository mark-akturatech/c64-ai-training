# CLV — Clear Overflow Flag

**Summary:** CLV clears the 6502 processor status V (overflow) flag (0 -> V). Implied addressing; opcode $B8; 1 byte; 2 cycles. (Ref: 3.6.1)

## Description
Operation: 0 -> V — clears the overflow flag. Status effect notation: N Z C I D V = _ _ _ _ _ 0 (V becomes 0; all other flags unchanged). Instruction uses the implied addressing mode and does not read or write memory.

## Source Code
```text
CLV                      CLV Clear overflow flag                      CLV

Operation: 0 -> V                                     N Z C I D V
                                                      _ _ _ _ _ 0
                                (Ref: 3.6.1)
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Implied       |   CLV                 |    B8   |    1    |    2     |
+----------------+-----------------------+---------+---------+----------+
```

## Key Registers
- (none)

## References
- "cli_clear_interrupt_disable" — clears the interrupt disable flag (CLI)
- "cmp_compare_accumulator" — comparison instructions (CMP)