# 6502 CPX — Compare Memory and Index X (opcodes $E0, $E4, $EC)

**Summary:** CPX performs X - M (compare X register with memory) and updates flags N, Z, C accordingly; opcodes $E0 (immediate), $E4 (zero page), $EC (absolute). Instruction sizes: 2/2/3 bytes and cycles: 2/3/4 respectively.

## Operation
CPX computes X - M (where M is the fetched operand) and sets three condition flags based on the (unstored) result:
- Carry (C) = 1 if X >= M (unsigned comparison), else 0.
- Zero (Z) = 1 if X == M, else 0.
- Negative (N) = bit 7 of (X - M) (sign of two's‑complement result).

Other flags (I, D, V) are not affected.

Pseudocode:
- result = (X - M) & 0xFF
- C = (X >= M) ? 1 : 0
- Z = (result == 0) ? 1 : 0
- N = (result & 0x80) ? 1 : 0

Behavioral notes:
- The operation is an unsigned compare for the Carry flag; Negative reflects the high bit of the 8-bit subtraction result (two's‑complement sign).
- No registers or memory are changed except the processor status flags listed above.
- Cycle counts depend on addressing mode (see table in Source Code).

## Source Code
```text
CPX                  CPX Compare Memory and Index X                   CPX
                                                        N Z C I D V
  Operation:  X - M                                     / / / _ _ _
                                 (Ref: 7.8)
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
| Immediate     |   CPX #Oper            |    $E0   |    2    |    2     |
| Zero Page     |   CPX Oper             |    $E4   |    2    |    3     |
| Absolute      |   CPX Oper             |    $EC   |    3    |    4     |
+----------------+-----------------------+---------+---------+----------+
```

## References
- "instruction_operation_cpx" — expands on CPX pseudocode and examples

## Mnemonics
- CPX
