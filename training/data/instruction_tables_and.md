# 6502 AND (A AND M -> A)

**Summary:** Bitwise AND of the accumulator with a memory operand (A /\ M -> A). Affects the Negative and Zero flags (N, Z). Opcodes: $29, $25, $35, $2D, $3D, $39, $21, $31; Absolute,X and Absolute,Y modes note page-crossing timing.

## Operation
Performs a bitwise logical AND between the Accumulator and the memory operand, storing the result back into A:

A /\ M -> A

Flags affected:
- N: Set from bit 7 of the result.
- Z: Set if result == 0.
- C, I, D, V: unchanged.

(Ref: 2.2.3.0)

## Addressing modes and timing
The instruction supports Immediate, Zero Page, Zero Page,X, Absolute, Absolute,X, Absolute,Y, (Indirect,X) and (Indirect),Y addressing modes. Cycle counts are given per mode; Absolute,X and Absolute,Y include a footnote: add 1 cycle if a page boundary is crossed (marked * in the table). The detailed opcode/bytes/cycles table is in the Source Code section below.

## Source Code
```text
AND                  "AND" memory with accumulator                    AND

Operation:  A /\ M -> A                               N Z C I D V
                                                         / / _ _ _ _
                              (Ref: 2.2.3.0)

+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
| Immediate     |   AND #Oper           |   $29   |    2    |    2     |
| Zero Page     |   AND Oper            |   $25   |    2    |    3     |
| Zero Page,X   |   AND Oper,X          |   $35   |    2    |    4     |
| Absolute      |   AND Oper            |   $2D   |    3    |    4     |
| Absolute,X    |   AND Oper,X          |   $3D   |    3    |    4*    |
| Absolute,Y    |   AND Oper,Y          |   $39   |    3    |    4*    |
| (Indirect,X)  |   AND (Oper,X)        |   $21   |    2    |    6     |
| (Indirect,Y)  |   AND (Oper),Y        |   $31   |    2    |    5     |
+----------------+-----------------------+---------+---------+----------+

* Add 1 if page boundary is crossed.
```

## References
- "instruction_operation_and" — expands on AND pseudocode
- "instruction_timing_tables" — expands on addressing mode cycles

## Mnemonics
- AND
