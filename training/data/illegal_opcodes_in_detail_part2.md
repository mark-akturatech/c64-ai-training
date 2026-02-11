# 6502 Undocumented Opcodes: DCP, ISC/ISB/INS, LAS/LAR, LAX, LXA, RLA, RRA, SAX, SBX, SHA, SHX, SHY

**Summary:** This document details the undocumented (illegal) opcodes of the 6502 microprocessor, including their operations, opcode bytes, addressing modes, cycle counts, and flag effects. The opcodes covered are: DCP (DEC + CMP), ISC/ISB/INS (INC + SBC), LAS/LAR (LDA/TSX combined), LAX (LDA + LDX combined), LXA (LAX immediate), RLA (ROL + AND), RRA (ROR + ADC), SAX (A AND X → M), SBX (AXS immediate), SHA (stores using high-byte+1 behavior), SHX, and SHY. Notably, LXA and SHY are flagged as highly unstable.

**Overview of Operations (Behavior and Flags)**

- **DCP (DEC + CMP)**
  - **Effect:** Decrements memory and compares the result with the accumulator.
  - **Flags:** N Z C (set as CMP would), others unchanged.
  - **Use:** Combines decrementing a memory location with a comparison to the accumulator.

- **ISC/ISB/INS (INC + SBC)**
  - **Effect:** Increments memory and subtracts the result from the accumulator with borrow.
  - **Flags:** N Z C V (set as SBC would), others unchanged.
  - **Use:** Combines incrementing a memory location with a subtract operation.

- **LAS/LAR (LDA/TSX combined)**
  - **Effect:** Loads A, X, and SP with memory AND SP.
  - **Flags:** N Z (set from A), others unchanged.
  - **Use:** Simultaneously loads A, X, and SP, useful for stack manipulation.

- **LAX (LDA + LDX combined)**
  - **Effect:** Loads both A and X from memory.
  - **Flags:** N Z (set from A), others unchanged.
  - **Use:** Efficiently loads the same value into A and X.

- **LXA (LAX immediate)**
  - **Effect:** Loads A and X with immediate value AND a constant (unstable).
  - **Flags:** N Z (set from A), others unchanged.
  - **Use:** Similar to LAX but with an immediate operand; behavior is highly unstable.

- **RLA (ROL + AND)**
  - **Effect:** Rotates memory left and ANDs the result with A.
  - **Flags:** N Z C (set as ROL and AND would), others unchanged.
  - **Use:** Combines a left rotate with a logical AND into A.

- **RRA (ROR + ADC)**
  - **Effect:** Rotates memory right and adds the result to A with carry.
  - **Flags:** N Z C V (set as ROR and ADC would), others unchanged.
  - **Use:** Combines a right rotate with an addition into A.

- **SAX (A AND X → M)**
  - **Effect:** Stores the result of A AND X into memory.
  - **Flags:** None affected.
  - **Use:** Stores the bitwise AND of A and X into a memory location.

- **SBX (AXS immediate)**
  - **Effect:** Sets X to (A AND X) - immediate operand.
  - **Flags:** N Z C (set as CMP would), others unchanged.
  - **Use:** Combines a bitwise AND of A and X with a subtraction.

- **SHA (AHX, AXA)**
  - **Effect:** Stores A AND X AND (high-byte of address + 1) into memory.
  - **Instability:** Behavior is unreliable; page boundary crossings may fail.
  - **Use:** Stores a combination of A, X, and address high-byte; not recommended due to instability.

- **SHX (A11, SXA, XAS)**
  - **Effect:** Stores X AND (high-byte of address + 1) into memory.
  - **Instability:** Similar instability as SHA.
  - **Use:** Stores a combination of X and address high-byte; not recommended due to instability.

- **SHY (A11, SYA, SAY)**
  - **Effect:** Stores Y AND (high-byte of address + 1) into memory.
  - **Instability:** Similar instability as SHA.
  - **Use:** Stores a combination of Y and address high-byte; not recommended due to instability.

## Source Code

```text
                 DCP (DCM)
                      DEC oper + CMP oper
                      M - 1 -> M, A - M
                                                         N Z C I D V
                                                         + + + - - -
                      addressing     assembler       opc bytes cycles
                      zeropage       DCP oper         C7   2      5
                      zeropage,X     DCP oper,X       D7   2      6
                      absolute       DCP oper         CF   3      6
                      absolute,X     DCP oper,X       DF   3      7
                      absolute,Y     DCP oper,Y       DB   3      7
                      (indirect,X)   DCP (oper,X)     C3   2      8
                      (indirect),Y   DCP (oper),Y     D3   2      8

                 ISC (ISB, INS)
                      INC oper + SBC oper
                      M + 1 -> M, A - M - C̅ -> A
                                                         N Z C I D V
                                                         + + + - - +
                      addressing     assembler       opc bytes cycles
                      zeropage       ISC oper         E7   2      5
                      zeropage,X     ISC oper,X       F7   2      6
                      absolute       ISC oper         EF   3      6
                      absolute,X     ISC oper,X       FF   3      7
                      absolute,Y     ISC oper,Y       FB   3      7
                      (indirect,X)   ISC (oper,X)     E3   2      8
                      (indirect),Y   ISC (oper),Y     F3   2      8

                 LAS (LAR)
                      LDA/TSX oper
                      M AND SP -> A, X, SP
                                                         N Z C I D V
                                                         + + - - - -
                      addressing     assembler       opc bytes cycles
                      absolute,Y     LAS oper,Y       BB   3      4*

                 LAX
                      LDA oper + LDX oper
                      M -> A -> X
                                                         N Z C I D V
                                                         + + - - - -
                      addressing     assembler       opc bytes cycles
                      zeropage       LAX oper         A7   2      3
                      zeropage,Y     LAX oper,Y       B7   2      4
                      absolute       LAX oper         AF   3      4
                      absolute,Y     LAX oper,Y       BF   3      4*
                      (indirect,X)   LAX (oper,X)     A3   2      6
                      (indirect),Y   LAX (oper),Y     B3   2      5*

                 LXA (LAX immediate)
                      (A OR CONST) AND oper -> A -> X
                      unstable: CONST is chip- and/or temperature dependent
                                                         N Z C I D V
                                                         + + - - - -
                      addressing     assembler       opc bytes cycles
                      immediate      LXA #oper        AB   2      2

                 SHY (SYA, SAY)
                      Stores Y AND (high-byte of addr. + 1) at addr.
                      unstable: sometimes 'AND (H+1)' is dropped, page boundary
                      crossings may not work (with the high-byte of the value
                      used as the high-byte of the address)
                      Y AND (H+1) -> M
                                                         N Z C I D V
                                                         - - - - - -
                      addressing     assembler       opc bytes cycles
                      absolute,X     SHY oper,X       9C   3      5   †
```

*Note: The dagger (†) indicates that an additional cycle is added if a page boundary is crossed.*

## Key Registers

- **DCP (DCM):** A, Memory
- **ISC (ISB, INS):** A, Memory
- **LAS (LAR):** A, X, SP
- **LAX:** A, X
- **LXA (LAX immediate):** A, X
- **SHY (SYA, SAY):** Memory

## References

- [6502 Instruction Set](https://www.masswerk.at/6502/6502_instruction_set.html)
- [6502 Undocumented Opcodes](https://www.masswerk.at/nowgobang/2021/6502-illegal-opcodes)
- [6502 Instruction Tables](https://www.masswerk.at/6502/instruction-tables/)
- [6502 Undocumented Opcodes PDF](https://c74project.com/wp-content/uploads/2020/04/c74-6502-undocumented-opcodes.pdf)
- [6502 Unstable Opcodes PDF](https://c74project.com/wp-content/uploads/2020/04/c74-6502-unstable-opcodes.pdf)

## Mnemonics
- DCP
- DCM
- ISC
- ISB
- INS
- LAS
- LAR
- LAX
- LXA
- RLA
- RRA
- SAX
- SBX
- SHA
- AHX
- AXA
- SHX
- A11
- SXA
- XAS
- SHY
- SYA
- SAY
