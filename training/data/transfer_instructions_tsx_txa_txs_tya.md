# 6502 Transfer Instructions: TSX, TXA, TXS, TYA

**Summary:** Describes 6502 transfer instructions TSX, TXA, TXS and TYA with operation (source -> destination), affected flags (N, Z), assembly mnemonics, opcode bytes ($BA,$8A,$9A,$98), instruction lengths and cycle counts. Includes reference numbers from the original manual.

## Operation and flags
- TSX — Transfer Stack Pointer to X: S -> X. Affects N and Z flags (set from resulting X). (Ref: 8.9)
- TXA — Transfer X to Accumulator: X -> A. Affects N and Z flags (set from resulting A). (Ref: 7.12)
- TXS — Transfer X to Stack Pointer: X -> S. Does not affect any processor flags. (Ref: 8.8)
- TYA — Transfer Y to Accumulator: Y -> A. Affects N and Z flags (set from resulting A). (Ref: 7.14)

Notes:
- All four instructions use the implied addressing mode.
- N (negative) is set from the high bit of the destination byte; Z (zero) is set if the destination becomes zero.
- TXS explicitly leaves flags unchanged.

## Assembly syntax, opcodes, lengths and timing
- All four instructions are 1 byte long and take 2 CPU cycles (implied addressing).
- Opcodes:
  - TSX — BA
  - TXA — 8A
  - TXS — 9A
  - TYA — 98

(See "instruction_addressing_modes_and_timing_table" for timing conventions and page-cross/branch penalties that apply to other instructions.)

## Source Code
```text
  TSX              TSX Transfer stack pointer to index X                TSX

  Operation:  S -> X                                    N Z C I D V
                                                        / / _ _ _ _
                                 (Ref: 8.9)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Implied       |   TSX                 |    BA   |    1    |    2     |
  +----------------+-----------------------+---------+---------+----------+

  TXA                TXA Transfer index X to accumulator                TXA
                                                        N Z C I D V
  Operation:  X -> A                                    / / _ _ _ _
                                 (Ref: 7.12)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Implied       |   TXA                 |    8A   |    1    |    2     |
  +----------------+-----------------------+---------+---------+----------+

  TXS              TXS Transfer index X to stack pointer                TXS
                                                        N Z C I D V
  Operation:  X -> S                                    _ _ _ _ _ _
                                 (Ref: 8.8)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Implied       |   TXS                 |    9A   |    1    |    2     |
  +----------------+-----------------------+---------+---------+----------+

  TYA                TYA Transfer index Y to accumulator                TYA

  Operation:  Y -> A                                    N Z C I D V
                                                        / / _ _ _ _
                                 (Ref: 7.14)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Implied       |   TYA                 |    98   |    1    |    2     |
  +----------------+-----------------------+---------+---------+----------+
```

## References
- "instruction_addressing_modes_and_timing_table" — timing conventions and addressing-mode cycle additions (page-cross/branch penalties)
- "opcode_hex_maps_00_to_FF" — opcode lookup (hex-to-mnemonic) showing opcode bytes for these instructions

## Mnemonics
- TSX
- TXA
- TXS
- TYA
