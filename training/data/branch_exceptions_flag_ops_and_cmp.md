# 6502: Branch on overflow (BVC/BVS), status-clear, compare and decrement instructions

**Summary:** Details and opcodes for branch-on-overflow (BVC/BVS), clear-status instructions (CLC/CLD/CLI/CLV), compare instructions (CMP/CPX/CPY) and decrement instructions (DEC/DEX/DEY), including addressing modes, opcodes, bytes and cycle counts.

## Branch on overflow (BVC / BVS)
BVC and BVS are relative branch instructions that test the V (overflow) flag in the status register:
- BVC — Branch if V = 0 (overflow clear).
- BVS — Branch if V = 1 (overflow set).

Semantics: perform a relative branch using a signed 8-bit displacement if the tested condition on V is true. Typical timing: 2 cycles if the branch is not taken; +1 cycle if taken; +1 additional cycle if the branch is taken and the jump crosses a page boundary (standard 6502 branch timing behavior).

## Clear-status instructions (CLC / CLD / CLI / CLV)
These implied instructions clear individual status flags:
- CLC — clear Carry flag (C).
- CLD — clear Decimal mode flag (D).
- CLI — clear Interrupt disable flag (I).
- CLV — clear Overflow flag (V).

All are implied addressing (no operand). They affect only the named flag; other flags are unchanged.

## Compare instructions (CMP / CPX / CPY)
Compare instructions perform a subtraction (register - memory) without changing the register, setting flags to reflect the result:
- CMP — Compare accumulator with memory (A - M). Sets N, Z, C based on the signed/unsigned result: N = bit7 of (A - M), Z = 1 if equal, C = 1 if A >= M (unsigned). I, D, V are unaffected by CMP.
- CPX — Compare X register with memory (X - M). Affects N, Z, C similarly; I, D, V unaffected.
- CPY — Compare Y register with memory (Y - M). Affects N, Z, C similarly; I, D, V unaffected.

Use these to test equality/ordering relative to an unsigned value (carry=1 means register >= memory).

## Decrement instructions (DEC / DEX / DEY)
- DEC — Decrement memory: M := M - 1. Affects N and Z based on the result; C is not affected. Addressing modes include zeropage/zeropage,X/absolute/absolute,X.
- DEX — Decrement X: X := X - 1. Implied addressing; affects N and Z; C unaffected.
- DEY — Decrement Y: Y := Y - 1. Implied addressing; affects N and Z; C unaffected.

## Source Code
```text
              addressing    assembler       opc   bytes cycles
              implied       CLV             B8      1      2

          CMP Compare Memory with Accumulator
              A - M                                N Z C I D V
                                                   + + + - - -
              addressing    assembler       opc   bytes cycles
              immediate     CMP #oper       C9      2      2
              zeropage      CMP oper        C5      2      3
              zeropage,X    CMP oper,X      D5      2      4
              absolute      CMP oper        CD      3      4
              absolute,X    CMP oper,X      DD      3      4*
              absolute,Y    CMP oper,Y      D9      3      4*
              (indirect,X)  CMP (oper,X)    C1      2      6
              (indirect),Y  CMP (oper),Y    D1      2      5*

          CPX Compare Memory and Index X
              X - M                                N Z C I D V
                                                   + + + - - -
              addressing    assembler       opc   bytes cycles
              immediate     CPX #oper       E0      2      2
              zeropage      CPX oper        E4      2      3
              absolute      CPX oper        EC      3      4

          CPY Compare Memory and Index Y
              Y - M                                N Z C I D V
                                                   + + + - - -
              addressing    assembler       opc   bytes cycles
              immediate     CPY #oper       C0      2      2
              zeropage      CPY oper        C4      2      3
              absolute      CPY oper        CC      3      4

          DEC Decrement Memory by One
              M - 1 -> M                           N Z C I D V
                                                   + + - - - -
              addressing    assembler       opc   bytes cycles
              zeropage      DEC oper        C6      2      5
              zeropage,X    DEC oper,X      D6      2      6
              absolute      DEC oper        CE      3      6
              absolute,X    DEC oper,X      DE      3      7

          DEX Decrement Index X by One
              X - 1 -> X                           N Z C I D V
                                                   + + - - - -
              addressing    assembler       opc   bytes cycles
              implied       DEX             CA      1      2

          DEY Decrement Index Y by One
              Y - 1 -> Y                           N Z C I D V
                                                   + + - - - -
              addressing    assembler       opc   bytes cycles
              implied       DEY             88      1      2

          EOR Exclusive-OR Memory with Accumulator
              A EOR M -> A                         N Z C I D V
                                                   + + - - - -
              addressing    assembler       opc   bytes cycles
              immediate     EOR #oper       49      2      2
              zeropage      EOR oper        45      2      3
              zeropage,X    EOR oper,X      55      2      4
              absolute      EOR oper        4D      3      4
              absolute,X    EOR oper,X      5D      3      4*
              absolute,Y    EOR oper,Y      59      3      4*
              (indirect,X)  EOR (oper,X)    41      2      6
              (indirect),Y  EOR (oper),Y    51      2      5*
```

Additional commonly-used implied clear instructions (opcode bytes and typical cycles):
```text
              addressing    assembler       opc   bytes cycles
              implied       CLC             18      1      2
              implied       CLD             D8      1      2
              implied       CLI             58      1      2
              implied       CLV             B8      1      2
```

Branch-on-overflow opcodes (relative branch; signed 8-bit displacement):
```text
              addressing    assembler       opc   bytes cycles
              relative      BVC (V=0)       50      2      2 (+1 if taken, +1 if page crossed)
              relative      BVS (V=1)       70      2      2 (+1 if taken, +1 if page crossed)
```

Notes:
- The CMP/CPX/CPY tables show which addressing modes are available and the standard 6502 cycle counts (marked * when page- or indexing-affected cycles apply).
- DEC/DEX/DEY only affect N and Z (carry unaffected).
- Branch timing: base 2 cycles; +1 if branch is taken; +1 additional if the branch crosses a page boundary.

## Key Registers
(omitted — this chunk documents CPU instructions, not memory-mapped I/O)

## References
- "pragmatics_of_comparisons_and_bit" — expands on how comparisons encode relations via flags
- "status_register_and_flags" — expands on impact of these instructions on SR flags