# 6502 LDY (Load Y)

**Summary:** LDY loads a memory value into the Y index register and affects the N (negative) and Z (zero) flags. Addressing modes: Immediate, Zero Page, Zero Page,X, Absolute, Absolute,X with opcodes $A0, $A4, $B4, $AC, $BC; Absolute,X adds 1 cycle on page crossing.

## Operation
LDY transfers memory (M) into the Y register: M -> Y (Ref: 7.1).  
Flags affected:
- N = bit 7 of Y (set if 1)  
- Z = 1 if Y == 0, else 0  
- C, I, D, V = unaffected

Absolute,X page-crossing note:
- The Absolute,X addressing mode (opcode $BC) requires an additional cycle if the effective address crosses a 256-byte page boundary (i.e., low-byte wraps).

## Source Code
```text
LDY                   LDY Load index Y with memory                    LDY
                                                        N Z C I D V
  Operation:  M -> Y                                    / / _ _ _ _ _
                                 (Ref: 7.1)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Immediate     |   LDY #Oper           |    $A0  |    2    |    2     |
  |  Zero Page     |   LDY Oper            |    $A4  |    2    |    3     |
  |  Zero Page,X   |   LDY Oper,X          |    $B4  |    2    |    4     |
  |  Absolute      |   LDY Oper            |    $AC  |    3    |    4     |
  |  Absolute,X    |   LDY Oper,X          |    $BC  |    3    |    4*    |
  +----------------+-----------------------+---------+---------+----------+
  * Add 1 when page boundary is crossed.
```

## References
- "instruction_operation_ldy" — expanded LDY pseudocode and details

## Mnemonics
- LDY
