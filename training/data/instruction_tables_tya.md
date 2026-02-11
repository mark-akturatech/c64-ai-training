# 6502 TYA (Transfer Y to Accumulator)

**Summary:** TYA is an implied 6502 instruction (opcode $98) that copies the Y index register into the accumulator and updates the N and Z flags; it is 1 byte and takes 2 CPU cycles.

## Operation
TYA transfers the contents of the Y register into the accumulator:
- Operation: A <- Y
- Affected flags: N (set from bit 7 of A) and Z (set if A == 0).
- Unaffected flags: C, I, D, V.

Pseudocode (concise):
- A = Y
- Z = (A == 0)
- N = (A & %10000000) != 0

## Source Code
```text
  TYA                TYA Transfer index Y to accumulator                TYA

  Operation:  Y -> A                                    N Z C I D V
                                                        / / _ _ _ _ _
                                 (Ref: 7.14)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Implied       |   TYA                 |    98   |    1    |    2     |
  +----------------+-----------------------+---------+---------+----------+
```

## References
- "instruction_operation_tya" — expands on TYA pseudocode

## Mnemonics
- TYA
