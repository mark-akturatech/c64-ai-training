# 6502 ORA — OR memory with accumulator

**Summary:** 6502 instruction ORA (A OR M -> A). Searchable opcodes: $09, $05, $15, $0D, $1D, $19, $01, $11. Addressing modes: Immediate, Zero Page, Zero Page,X, Absolute, Absolute,X, Absolute,Y, (Indirect,X), (Indirect),Y. Page-crossing note: Absolute,X/Y add 1 cycle on page crossing.

**Description**
ORA performs a bitwise OR between the accumulator (A) and a memory operand (M), storing the result back into A:

- Operation: A ← A OR M
- Flags affected: N (negative) and Z (zero) updated based on the result. C, I, D, V are unchanged.

Page crossing behavior: for Absolute,X and Absolute,Y addressing modes, add 1 extra CPU cycle if the indexed address crosses a 256-byte page boundary (i.e., high byte of the effective address changes). (Page crossing = address crosses a 0x00FF->0x0100 boundary.)

## Source Code
```text
ORA                 ORA "OR" memory with accumulator                  ORA

Operation: A V M -> A                                 N Z C I D V
                                                      N Z _ _ _ _

+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
| Immediate     |   ORA #Oper           |    $09  |    2    |    2     |
| Zero Page     |   ORA Oper            |    $05  |    2    |    3     |
| Zero Page,X   |   ORA Oper,X          |    $15  |    2    |    4     |
| Absolute      |   ORA Oper            |    $0D  |    3    |    4     |
| Absolute,X    |   ORA Oper,X          |    $1D  |    3    |    4*    |
| Absolute,Y    |   ORA Oper,Y          |    $19  |    3    |    4*    |
| (Indirect,X)  |   ORA (Oper,X)        |    $01  |    2    |    6     |
| (Indirect),Y  |   ORA (Oper),Y        |    $11  |    2    |    5*    |
+----------------+-----------------------+---------+---------+----------+

* Add 1 on page crossing (Absolute,X and Absolute,Y)
```

## References
- "instruction_operation_ora" — expands on ORA pseudocode and behavior (see referenced document)

## Mnemonics
- ORA
