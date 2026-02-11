# TXS (Transfer X to Stack Pointer) — opcode $9A

**Summary:** TXS is a 6502 implied instruction that copies the X register into the stack pointer (S). Opcode $9A, 1 byte, 2 cycles; it does not affect any processor status flags.

## Operation
TXS transfers the contents of the X index register to the stack pointer:
- Operation: S <- X
- Addressing mode: Implied
- Assembly mnemonic: TXS
- Flags: none are affected (N, Z, C, I, D, V unchanged)

## Encoding / Timing
- Opcode: $9A
- Bytes: 1
- Cycles: 2

(Ref: 8.8)

## Source Code
```text
  TXS              TXS Transfer index X to stack pointer                TXS
                                                        N Z C I D V
  Operation:  X -> S                                    _ _ _ _ _ _
                                 (Ref: 8.8)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Implied       |   TXS                 |    9A   |    1    |    2     |
  +----------------+-----------------------+---------+---------+----------+
```

## References
- "instruction_operation_txs" — expands on TXS pseudocode

## Mnemonics
- TXS
