# ROR (Rotate Right) — 6502 instruction

**Summary:** ROR (Rotate Right) — mnemonic ROR; opcodes include $6A (Accumulator), $66 (Zero Page), $76 (Zero Page,X), $6E (Absolute), $7E (Absolute,X). Operation is a right rotate through the Carry flag and it affects Negative (N), Zero (Z) and Carry (C) flags.

## Operation
ROR shifts the target (accumulator or memory) one bit right through the Carry flag:

- The low bit (bit 0) shifted out becomes the new Carry (C).
- The previous Carry becomes the new high bit (bit 7).
- Result overwrites the operand (accumulator or memory).
- Flags affected:
  - Carry (C) = original bit 0
  - Negative (N) = result bit 7
  - Zero (Z) = set if result == 0
- Overflow (V) and Decimal (D) are not affected by ROR.
- Accumulator mode (ROR A) operates on the A register only.
- Memory modes perform a read-modify-write sequence (read the memory byte, compute result, write the result back).

Example:
- If A = %00000001 and C = 1, then ROR A -> A = %10000000, C = 1, N = 1, Z = 0.

## Source Code
```text
Instruction     Description                 Syntax        Opcode  Bytes  Cycles*  Flags
ROR             Rotate Right                ROR $aaaa     $6E     3      6        N,Z,C
ROR             Rotate Right (Zero Page)    ROR $aa       $66     2      5        N,Z,C
ROR             Rotate Right (Accumulator)  ROR A         $6A     1      2        N,Z,C
ROR             Rotate Right (Absolute,X)   ROR $aaaa,X   $7E     3      7        N,Z,C
ROR             Rotate Right (Zero Page,X)  ROR $aa,X     $76     2      6        N,Z,C

*Cycles shown are the typical NMOS 6502 cycle counts: Zero Page=5, Zero Page,X=6, Absolute=6, Absolute,X=7, Accumulator=2.
```

## References
- "rol_instruction" — Rotate Left (ROR counterpart)
- "lsr_instruction" — Logical Shift Right (related bit-shift instruction)

## Mnemonics
- ROR
