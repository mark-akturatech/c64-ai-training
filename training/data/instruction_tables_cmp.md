# 6502 CMP (Compare memory and accumulator)

**Summary:** CMP compares the accumulator with memory (A - M) and sets the N, Z and C flags accordingly; opcodes $C9,$C5,$D5,$CD,$DD,$D9,$C1,$D1 cover Immediate, Zero Page, Zero Page,X, Absolute, Absolute,X, Absolute,Y, (Indirect,X), (Indirect),Y addressing modes. Absolute,X, Absolute,Y and (Indirect),Y may add 1 cycle on page crossing.

## Description
CMP performs a comparison of the accumulator and a memory operand by effectively computing A - M and setting processor status flags based on that result (the accumulator itself is not changed). Affected flags: N, Z, C; I, D, V are unaffected.

- C (carry) reflects A >= M (set if no borrow would occur).
- Z (zero) is set if A == M.
- N (negative) is set from bit 7 of the subtraction result (A - M).

Timing: several addressing modes add one extra cycle if the memory access crosses a 256-byte page boundary; this applies to Absolute,X, Absolute,Y, and (Indirect),Y addressing modes.

(See "instruction_operation_cmp" for expanded pseudocode and example sequences.)

## Source Code
```text
  CMP                CMP Compare memory and accumulator                 CMP

  Operation:  A - M                                     N Z C I D V
                                                        / / / _ _ _
                                (Ref: 4.2.1)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Immediate     |   CMP #Oper           |    C9   |    2    |    2     |
  |  Zero Page     |   CMP Oper            |    C5   |    2    |    3     |
  |  Zero Page,X   |   CMP Oper,X          |    D5   |    2    |    4     |
  |  Absolute      |   CMP Oper            |    CD   |    3    |    4     |
  |  Absolute,X    |   CMP Oper,X          |    DD   |    3    |    4*    |
  |  Absolute,Y    |   CMP Oper,Y          |    D9   |    3    |    4*    |
  |  (Indirect,X)  |   CMP (Oper,X)        |    C1   |    2    |    6     |
  |  (Indirect),Y  |   CMP (Oper),Y        |    D1   |    2    |    5*    |
  +----------------+-----------------------+---------+---------+----------+
  * Add 1 if page boundary is crossed.
```

## References
- "instruction_operation_cmp" — expands on CMP pseudocode and flag-setting details

## Mnemonics
- CMP
