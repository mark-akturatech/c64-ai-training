# Compare and Bit Test Group (CMP, CPX, CPY, BIT)

**Summary:** 6502 compare and bit-test instructions: CMP/CPX/CPY perform unsigned comparisons (A/X/Y − M) and set N, Z, C; BIT performs a bitwise AND of A and memory and sets Z plus the N and V flags from memory bits. Includes opcodes, addressing modes, and exact flag behavior.

## Description

CMP / CPX / CPY
- Operation: perform an unsigned subtraction: register − memory (no result stored). Internally the CPU computes (register − memory) to set status flags but does not write the arithmetic result back to the register.
- Flags affected:
  - C (carry): set if register >= memory (i.e., no borrow), cleared if register < memory.
  - Z (zero): set if register == memory.
  - N (negative): set to bit 7 of the subtraction result (register − memory).
  - V: not affected.
- Registers:
  - CMP compares the accumulator (A).
  - CPX compares the X register.
  - CPY compares the Y register.
- Common notes:
  - These are unsigned comparisons; C indicates the unsigned >= relation.
  - N reflects the signed result's sign bit of (register − memory) (useful for signed comparisons when combined with V knowledge, but V is not changed).
  - Page-crossing penalties apply for indexed absolute and (indirect),Y modes where applicable.

BIT
- Operation: performs A AND M and sets flags based on the result and memory operand bits. No data is written.
- Flags affected:
  - Z: set if (A & M) == 0, cleared otherwise.
  - N: set to bit 7 of M.
  - V: set to bit 6 of M.
  - C: not affected.
- Addressing modes:
  - Zero Page and Absolute only on NMOS 6502.
- Common notes:
  - BIT is used to test specific bits in a memory location while preserving A.
  - Because N and V are taken directly from memory bits, BIT is useful for quick status tests (e.g., checking sign or a two-bit flag stored in memory).

## Source Code
```text
Opcode/Timing tables for CMP, CPX, CPY, BIT (NMOS 6502)

CMP (compare accumulator A with memory M)
  Immediate       C9  bytes=2 cycles=2
  Zero Page       C5  bytes=2 cycles=3
  Zero Page,X     D5  bytes=2 cycles=4
  Absolute        CD  bytes=3 cycles=4
  Absolute,X      DD  bytes=3 cycles=4 (+1 if page crossed)
  Absolute,Y      D9  bytes=3 cycles=4 (+1 if page crossed)
  (Indirect,X)    C1  bytes=2 cycles=6
  (Indirect),Y    D1  bytes=2 cycles=5 (+1 if page crossed)

CPX (compare X register with memory M)
  Immediate       E0  bytes=2 cycles=2
  Zero Page       E4  bytes=2 cycles=3
  Absolute        EC  bytes=3 cycles=4

CPY (compare Y register with memory M)
  Immediate       C0  bytes=2 cycles=2
  Zero Page       C4  bytes=2 cycles=3
  Absolute        CC  bytes=3 cycles=4

BIT (bit test A & M)
  Zero Page       24  bytes=2 cycles=3
  Absolute        2C  bytes=3 cycles=4

Example usages (assembly)
  CMP #$10        ; compare A with immediate 0x10 (sets N,Z,C)
  CMP $20         ; compare A with zero page $20
  CPX $1234       ; compare X with absolute $1234
  CPY #$FF        ; compare Y with immediate 0xFF
  BIT $2000       ; test bits in memory $2000 against A

Flag result examples (CMP semantics):
  A = $05, M = $03 -> C=1 (5>=3), Z=0, N=0
  A = $03, M = $05 -> C=0 (3<5), Z=0, N=1 (high bit of result set)
  A = $80, M = $80 -> C=1, Z=1, N=0

BIT semantics examples:
  A = $0F, M = $F0 -> (A & M) = $00 -> Z=1; N = bit7(M)=1; V = bit6(M)=1
  A = $FF, M = $01 -> (A & M) = $01 -> Z=0; N = 0; V = 0
```

## References
- "cmp_instruction" — detailed CMP description and examples
- "cpx_instruction" — detailed CPX description and examples
- "cpy_instruction" — detailed CPY description and examples
- "bit_instruction" — detailed BIT description and examples

## Mnemonics
- CMP
- CPX
- CPY
- BIT
