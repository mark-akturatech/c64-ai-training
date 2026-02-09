# CLD — Clear Decimal Mode (6502)

**Summary:** CLD clears the decimal (D) flag (0 -> D). Implied addressing, opcode $D8, 1 byte, 2 cycles (Ref: 3.3.2).

## Description
CLD clears the processor status decimal flag (D) by setting it to 0. It uses the implied addressing mode and does not read or write memory or registers other than the status register's D bit.

Operation: 0 -> D (clears decimal mode)

Manual reference: (Ref: 3.3.2)

## Flags affected
- N A C I D V
- _ _ _ _ 0 _  (only D is explicitly cleared; other flags are unaffected)

## Source Code
```text
  CLD                      CLD Clear decimal mode                       CLD

  Operation:  0 -> D                                    N A C I D V
                                                        _ _ _ _ 0 _
                                (Ref: 3.3.2)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Implied       |   CLD                 |    D8   |    1    |    2     |
  +----------------+-----------------------+---------+---------+----------+
```

## Key Registers
- (None — instruction operates on processor status flags, no memory-mapped registers)

## References
- "clc_clear_carry_flag" — expands on previous flag-clearing instruction (CLC)
- "cli_clear_interrupt_disable" — expands on next flag-clearing instruction (CLI)