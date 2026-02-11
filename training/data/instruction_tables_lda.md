# LDA (Load Accumulator)

**Summary:** Load accumulator from memory (M -> A); affects N and Z flags. Addressing modes and opcodes: $A9, $A5, $B5, $AD, $BD, $B9, $A1, $B1. Page-boundary crossing may add one extra cycle for Absolute,X; Absolute,Y; and (Indirect),Y addressing modes.

## Operation
LDA reads a value from memory and places it into the accumulator (A). The Negative (N) flag is set from bit 7 of A; the Zero (Z) flag is set if A == 0. All other processor status flags are unaffected.

Brief pseudocode:
```text
A := M
N := (A & %10000000) != 0    ; set negative if bit 7 set
Z := (A == 0)                ; set zero if accumulator is zero
```

Page crossing note:
- For Absolute,X ($BD), Absolute,Y ($B9), and (Indirect),Y ($B1) addressing modes, add 1 cycle if the effective address crosses a 256-byte page boundary.

## Source Code
```text
LDA                  LDA Load accumulator with memory                 LDA

Operation:  M -> A                                    N Z C I D V
                                                      / / _ _ _ _ _
                                (Ref: 2.1.1)
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Immediate     |   LDA #Oper           |    A9   |    2    |    2     |
|  Zero Page     |   LDA Oper            |    A5   |    2    |    3     |
|  Zero Page,X   |   LDA Oper,X          |    B5   |    2    |    4     |
|  Absolute      |   LDA Oper            |    AD   |    3    |    4     |
|  Absolute,X    |   LDA Oper,X          |    BD   |    3    |    4*    |
|  Absolute,Y    |   LDA Oper,Y          |    B9   |    3    |    4*    |
|  (Indirect,X)  |   LDA (Oper,X)        |    A1   |    2    |    6     |
|  (Indirect),Y  |   LDA (Oper),Y        |    B1   |    2    |    5*    |
+----------------+-----------------------+---------+---------+----------+

* Add 1 if page boundary is crossed.
```

## References
- "instruction_operation_lda" — expands on LDA pseudocode and internal operation
- "addressing_modes_pre_indexed_indirect" — expands on (Oper,X) and (Oper),Y addressing examples

## Mnemonics
- LDA
