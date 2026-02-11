# 6502 INY (Increment Y) — opcode $C8

**Summary:** INY increments the Y index register by one (Y <- Y + 1), uses implied addressing, is opcode $C8, 1 byte, 2 cycles, and updates the Negative (N) and Zero (Z) flags on the 6502.

## Operation
INY increments the Y register by one (wraps from $FF to $00). The instruction uses implied addressing, consumes 1 byte and 2 clock cycles, and affects the N and Z processor status flags. Carry (C), Interrupt (I), Decimal (D) and Overflow (V) flags are not affected.

Pseudocode:
- Y = (Y + 1) AND $FF
- Z = (Y == $00)
- N = (Y & $80) != 0

**[Note: Source may contain an error — the original "Operation" line shows "X + 1 -> X" but INY operates on the Y register, not X.]**

## Source Code
```text
  INY                    INY Increment Index Y by one                   INY

  Operation:  X + 1 -> X                                N Z C I D V
                                                        / / _ _ _ _ _
                                 (Ref: 7.5)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Implied       |   INY                 |    C8   |    1    |    2     |
  +----------------+-----------------------+---------+---------+----------+
```

```asm
; Single-byte encoding example
        .org $0200
$0200:  .byte $C8     ; INY
```

## References
- "instruction_operation_iny" — expands on INY pseudocode and behavior
- Ref: 7.5 (as cited in source)

## Mnemonics
- INY
