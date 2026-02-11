# 6502 Undocumented Opcodes (partial): DCP / ISC / LAS / LAX / LXA / RLA

**Summary:** Partial reference for undocumented (illegal) 6502 opcodes DCP (DEC then CMP), ISC/ISB/INS (INC then SBC), LAS/LAR, LAX, LXA (unstable immediate), and RLA; includes operation semantics, status-flag effects, addressing modes, opcode bytes, instruction lengths, and cycle counts as shown in the source.

**Undocumented opcode descriptions**

- **DCP (also seen as DCP oper)**
  - **Semantics:** Decrement memory operand, then compare the resulting value with the accumulator (A - M).
  - **Flags:** N Z C I D V → + + + - - -
  - **Addressing modes and opcode bytes:** zeropage, zeropage,X, absolute, absolute,X, absolute,Y, (indirect,X), (indirect),Y (see Source Code table).
  - **Typical use:** Behaves like DEC oper followed by CMP oper, but implemented as a single illegal opcode.

- **ISC (also labeled ISB or INS)**
  - **Semantics:** INC memory operand, then perform SBC with that memory operand: M = M + 1; A = A - M - (NOT C). (From source: "M + 1 -> M, A - M - C̅ -> A")
  - **Flags:** N Z C I D V → + + + - - +
  - **Addressing modes and opcode bytes:** zeropage, zeropage,X, absolute, absolute,X, absolute,Y, (indirect,X), (indirect),Y (see Source Code table).
  - **Typical use:** Effectively INC + SBC in one illegal opcode.

- **LAS (also labeled LAR)**
  - **Semantics:** Load A and X and update SP from memory AND SP: M AND SP -> A, X, SP (i.e., A = X = SP = M & SP).
  - **Flags:** N Z C I D V → + + - - - -
  - **Addressing mode shown:** absolute,Y (opcode BB). (cycles noted in source as 4* — see table for caveat)

- **LAX**
  - **Semantics:** Load memory into A and then copy A into X (M -> A -> X).
  - **Flags:** N Z C I D V → + + - - - -
  - **Addressing modes and opcode bytes:** zeropage, zeropage,Y, absolute, absolute,Y, (indirect,X), (indirect),Y (see Source Code table). Some indexed modes have cycle-count caveats (*).

- **LXA (LAX immediate / "Store * AND oper in A and X")**
  - **Semantics (from source):** Highly unstable; involves a 'magic' constant — see ANE. Described as "(A OR CONST) AND oper -> A -> X".
  - **Flags:** N Z C I D V → + + - - - -
  - **Addressing mode shown:** immediate (opcode AB), 2 cycles (marked †† in source) and explicitly called "Highly unstable" in the source.

- **RLA**
  - **Semantics:** Rotate-left memory through carry, then AND result with A: M = ROL M (with carry), then A = A AND M. Source phrasing: "M = C <- [76543210] <- C, A AND M -> A".
  - **Flags:** N Z C I D V → + + + - - -
  - **Addressing mode shown in source:** zeropage (opcode 27).

**Notes:**
- The source includes cycle-count caveats for some indexed/addressing modes (marked with *) and an instability marker (††) for LXA immediate; see Source Code for the exact opcode bytes and cycle counts.
- The source references ANE (XAA) when describing LXA/LXA-immediate; ANE/XAA behaviors and the "magic constant" are noted as related and unstable — full behavior not included in this chunk.

## Source Code

```text
                      Decrements the operand and then compares the result to the
                      accumulator.
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
                                                           6502 Instruction Set
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
                      Store * AND oper in A and X
                      Highly unstable, involves a 'magic' constant, see ANE
                      (A OR CONST) AND oper -> A -> X
                                                         N Z C I D V
                                                         + + - - - -
                      addressing     assembler       opc bytes cycles
                      immediate      LXA #oper        AB   2      2   ††
                 RLA
                      ROL oper + AND oper
                      M = C <- [76543210] <- C, A AND M -> A
                                                         N Z C I D V
                                                         + + + - - -
                      addressing     assembler       opc bytes cycles
                      zeropage       RLA oper         27   2      5
```

## Key Registers

- **Accumulator (A):** Used in arithmetic and logic operations.
- **X Register (X):** Index register used for addressing modes.
- **Stack Pointer (SP):** Points to the top of the stack.

## References

- "illegal_opcodes_in_detail_part2" — continued illegal opcode descriptions (DCP, ISC, etc.)

## Mnemonics
- DCP
- ISC
- ISB
- INS
- LAS
- LAR
- LAX
- LXA
- RLA
