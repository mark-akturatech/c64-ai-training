# 6502 INC (Increment Memory)

**Summary:** INC increments a memory location (M -> M+1) and updates N and Z flags; addressing modes: Zero Page, Zero Page,X, Absolute, Absolute,X. Opcodes: $E6 (ZP), $F6 (ZP,X), $EE (ABS), $FE (ABS,X).

## Operation and effects
INC reads a memory operand, adds one, stores the result back to the same memory location, and updates the Negative (N) and Zero (Z) flags according to the result. Carry (C), Interrupt (I), Decimal (D) and Overflow (V) flags are not affected by INC.

- Operation: M + 1 -> M
- Flags affected:
  - N = set if bit 7 of result is 1
  - Z = set if result == 0
  - C, I, D, V = unchanged
- Use cases: incrementing counters in memory, adjusting multi-byte values (with carry handled separately via ADC or manual checks), or pointer arithmetic in zero page/absolute memory.

(Ref: 10.6)

## Source Code
```text
                                                        N Z C I D V
  Operation:  M + 1 -> M                                / / _ _ _ _
                                 (Ref: 10.6)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Zero Page     |   INC Oper            |    E6   |    2    |    5     |
  |  Zero Page,X   |   INC Oper,X          |    F6   |    2    |    6     |
  |  Absolute      |   INC Oper            |    EE   |    3    |    6     |
  |  Absolute,X    |   INC Oper,X          |    FE   |    3    |    7     |
  +----------------+-----------------------+---------+---------+----------+
```

## References
- "instruction_operation_inc" — expands on INC pseudocode and behaviors

## Mnemonics
- INC
