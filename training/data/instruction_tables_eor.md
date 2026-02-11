# 6502 EOR (Exclusive OR) — A EOR M -> A

**Summary:** EOR performs a bitwise exclusive-OR between the accumulator and memory (A EOR M -> A). Opcodes: $49 (immediate), $45 (zp), $55 (zp,X), $40 (abs), $50 (abs,X), $59 (abs,Y), $41 ((ind,X)), $51 ((ind),Y). Note: Absolute,X, Absolute,Y and (Indirect),Y can add 1 cycle if a page boundary is crossed.

## Operation
Per instruction encoding: A EOR M -> A (Exclusive-OR, i.e. bitwise XOR).

Flags affected:
- N — set if bit 7 of the result is 1 (negative)
- Z — set if the result is zero
- C, I, D, V — unchanged

Addressing modes that may incur an extra cycle when a page boundary is crossed: Absolute,X ($50), Absolute,Y ($59), (Indirect),Y ($51).

(Ref: instruction_operation_eor for expanded pseudocode)

## Source Code
```text
Operation:  A EOR M -> A                              N Z C I D V
                                                          / / _ _ _ _
                               (Ref: 2.2.3.2)
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
| Immediate     |   EOR #Oper           |   $49   |    2    |    2     |
| Zero Page     |   EOR Oper            |   $45   |    2    |    3     |
| Zero Page,X   |   EOR Oper,X          |   $55   |    2    |    4     |
| Absolute      |   EOR Oper            |   $40   |    3    |    4     |
| Absolute,X    |   EOR Oper,X          |   $50   |    3    |    4*    |
| Absolute,Y    |   EOR Oper,Y          |   $59   |    3    |    4*    |
| (Indirect,X)  |   EOR (Oper,X)        |   $41   |    2    |    6     |
| (Indirect),Y  |   EOR (Oper),Y        |   $51   |    2    |    5*    |
+----------------+-----------------------+---------+---------+----------+

* Add 1 cycle if page boundary is crossed.
```

## References
- "instruction_operation_eor" — expanded EOR pseudocode and behavior details

## Mnemonics
- EOR
