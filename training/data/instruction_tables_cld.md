# 6502: CLD (Clear Decimal Mode)

**Summary:** CLD (opcode $D8) clears the processor status decimal flag (D = 0). Addressing: implied; Size: 1 byte; Cycles: 2; affects status flags (D cleared, others unchanged).

## Operation
CLD clears the Decimal (D) flag in the processor status register.

- Operation (effect on flags): 0 -> D
- Status flags layout shown as N A C I D V with D set to 0 and other flags left unchanged.
- Typical use: disable BCD (binary-coded decimal) arithmetic so ADC/SBC use binary mode.

(Ref: 3.3.2)

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

## References
- "instruction_operation_cld" — expands on CLD pseudocode

## Mnemonics
- CLD
