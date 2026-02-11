# AND — Logical AND instruction (6502)

**Summary:** 6502 AND instruction: bitwise AND between accumulator and memory (A /\ M -> A). Searchable terms: opcodes, addressing modes (Immediate, Zero Page, Zero Page,X, Absolute, Absolute,X, Absolute,Y, (Indirect,X), (Indirect),Y), cycles, page-boundary timing, flags (N, Z).

## Description
Performs a bitwise logical AND of the accumulator with a memory operand and stores the result in the accumulator: A /\ M -> A. Affects the N and Z flags (N = sign, Z = zero); C, I, D, V are not affected. See the opcode/timing table in Source Code for opcodes, byte counts and cycles.

Addressing modes supported: Immediate, Zero Page, Zero Page,X, Absolute, Absolute,X, Absolute,Y, (Indirect,X), (Indirect),Y. Absolute,X and Absolute,Y require an extra cycle if a page boundary is crossed.

(Ref: 2.2.3.0)

## Source Code
```text
AND                  "AND" memory with accumulator                    AND

Operation:  A /\ M -> A                               N Z C I D V
                                                        / / _ _ _ _
                               (Ref: 2.2.3.0)

+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Immediate     |   AND #Oper           |    29   |    2    |    2     |
|  Zero Page     |   AND Oper            |    25   |    2    |    3     |
|  Zero Page,X   |   AND Oper,X          |    35   |    2    |    4     |
|  Absolute      |   AND Oper            |    2D   |    3    |    4     |
|  Absolute,X    |   AND Oper,X          |    3D   |    3    |    4*    |
|  Absolute,Y    |   AND Oper,Y          |    39   |    3    |    4*    |
|  (Indirect,X)  |   AND (Oper,X)        |    21   |    2    |    6     |
|  (Indirect,Y)  |   AND (Oper),Y        |    31   |    2    |    5     |
+----------------+-----------------------+---------+---------+----------+

* Add 1 if page boundary is crossed.
```

## References
- "adc_add_with_carry_instruction" — expands on previous arithmetic instruction (ADC)
- "asl_arithmetic_shift_left_instruction" — expands on next instruction in the document (ASL)

## Mnemonics
- AND
