# ADC — Add memory to accumulator with carry

**Summary:** ADC (6502) — performs A + M + C -> A, C; affects flags N, Z, C, V (I and D unchanged). Includes addressing modes, opcodes, byte counts and cycle counts (Immediate, Zero Page, Zero Page,X, Absolute, Absolute,X, Absolute,Y, (Indirect,X), (Indirect),Y). (Ref: 2.2.1)

## Operation
Performs A + M + C -> A, C. Flags affected: N, Z, C, V (I and D unchanged). (N = negative: result bit 7; Z = zero; C = carry-out; V = signed overflow.)

Page-boundary timing: Absolute,X; Absolute,Y; and (Indirect),Y incur +1 cycle if the indexed addressing crosses a 256-byte page boundary (see table for starred entries).

## Source Code
```text
  ADC               Add memory to accumulator with carry                ADC

  Operation:  A + M + C -> A, C                         N Z C I D V
                                                        / / / _ _ /
                                (Ref: 2.2.1)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Immediate     |   ADC #Oper           |    69   |    2    |    2     |
  |  Zero Page     |   ADC Oper            |    65   |    2    |    3     |
  |  Zero Page,X   |   ADC Oper,X          |    75   |    2    |    4     |
  |  Absolute      |   ADC Oper            |    6D   |    3    |    4     |
  |  Absolute,X    |   ADC Oper,X          |    7D   |    3    |    4*    |
  |  Absolute,Y    |   ADC Oper,Y          |    79   |    3    |    4*    |
  |  (Indirect,X)  |   ADC (Oper,X)        |    61   |    2    |    6     |
  |  (Indirect),Y  |   ADC (Oper),Y        |    71   |    2    |    5*    |
  +----------------+-----------------------+---------+---------+----------+
  * Add 1 if page boundary is crossed.
```

## References
- "instruction_table_notation_and_references" — expands on notation used for flags and addressing modes in this table  
- "and_logical_and_instruction" — expands on the subsequent logical/bitwise instruction (AND)