# DEC (Decrement Memory by One) — 6502

**Summary:** DEC decrements a memory location (M -> M-1) and updates the N and Z flags. Encodings: Zero Page $C6, Zero Page,X $D6, Absolute $CE, Absolute,X $DE; cycles and byte counts vary by addressing mode.

## Description
Operation: M - 1 -> M (the memory operand is read, decremented by one, and the result is written back). The Negative (N) and Zero (Z) flags are set according to the result; Carry (C), Interrupt Disable (I), Decimal (D), and Overflow (V) flags are not affected. (Ref: 10.7)

Assembly forms:
- DEC Oper          ; Zero Page / Absolute (decrement memory)
- DEC Oper,X        ; Zero Page,X / Absolute,X (decrement memory indexed by X)

Behavior notes:
- DEC modifies memory, not the accumulator.
- Flag effects: N reflects bit 7 of the result; Z is set if result == 0.
- Instruction lengths and timing depend on addressing mode as listed below.

## Source Code
```text
  DEC                   DEC Decrement memory by one                     DEC

  Operation:  M - 1 -> M                                N Z C I D V
                                                        / / _ _ _ _ _
                                 (Ref: 10.7)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Zero Page     |   DEC Oper            |    C6   |    2    |    5     |
  |  Zero Page,X   |   DEC Oper,X          |    D6   |    2    |    6     |
  |  Absolute      |   DEC Oper            |    CE   |    3    |    6     |
  |  Absolute,X    |   DEC Oper,X          |    DE   |    3    |    7     |
  +----------------+-----------------------+---------+---------+----------+
```

## References
- "instruction_operation_dec" — expands on DEC pseudocode and detailed behavior (searchable)

## Mnemonics
- DEC
