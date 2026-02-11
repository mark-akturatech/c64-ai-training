# CMP — Compare Memory and Accumulator

**Summary:** CMP (A - M) compares the accumulator with a memory operand and sets flags N, Z, C accordingly; opcodes: C9/C5/D5/CD/DD/D9/C1/D1 for Immediate/ZeroPage/ZeroPage,X/Absolute/Absolute,X/Absolute,Y/(Indirect,X)/(Indirect),Y. (Ref: 4.2.1)

## Description
Operation: A - M (compare accumulator with memory).  
Flags affected:
- N (Negative): set from bit 7 of the result (A - M).  
- Z (Zero): set if A == M.  
- C (Carry): set if A >= M (no borrow).  
- I, D, V: unchanged.

Timing notes:
- Certain addressing modes add 1 cycle if a page boundary is crossed on the effective address calculation (marked with * below).  
(Ref: 4.2.1)

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
- "clv_clear_overflow_flag" — covers CLV (clear overflow flag) related flag behaviour.  
- "cpx_compare_index_x" — covers CPX (compare X register) instruction and related addressing/modes.

## Mnemonics
- CMP
