# 6502 CPY — Compare memory and Y

**Summary:** CPY compares the Y index register with a memory operand (operation Y - M). Affects flags N, Z, C. Opcodes: $C0 (immediate), $C4 (zero page), $CC (absolute).

## Operation
Performs the subtraction Y - M (without changing Y or memory) to set processor status flags:

- Carry (C): set if Y >= M (i.e., no borrow), clear if Y < M.
- Zero (Z): set if Y == M, otherwise clear.
- Negative (N): set to bit 7 of the subtraction result (bit7 of Y - M).
- Interrupt (I), Decimal (D), and Overflow (V) are not affected by CPY. 

Minimal pseudocode:
- temp = (Y - M) & $FF
- C = (Y >= M) ? 1 : 0
- Z = (temp == 0) ? 1 : 0
- N = (temp & $80) ? 1 : 0

Addressing modes and usage:
- Immediate: CPY #$nn — compare Y to immediate byte.
- Zero Page: CPY $nn — compare Y to byte in zero page.
- Absolute: CPY $nnnn — compare Y to byte in absolute memory.

## Source Code
```text
CPY                  CPY Compare memory and index Y                   CPY
                                                        N Z C I D V
Operation:  Y - M                                     / / / _ _ _
                                (Ref: 7.9)
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
| Immediate     |   CPY *Oper           |    C0   |    2    |    2     |
| Zero Page     |   CPY Oper            |    C4   |    2    |    3     |
| Absolute      |   CPY Oper            |    CC   |    3    |    4     |
+----------------+-----------------------+---------+---------+----------+
```

## References
- "instruction_operation_cpy" — expands on CPY pseudocode

## Mnemonics
- CPY
