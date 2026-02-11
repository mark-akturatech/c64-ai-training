# NMOS 6510 — RLA (Rotate Left then AND with Accumulator)

**Summary:** RLA is an undocumented NMOS 6502/6510 opcode that performs a memory ROL (rotate left through Carry) then ANDs the accumulator with that rotated memory byte. Behavior notes include Carry shifting (bit7 → Carry; previous Carry → memory bit0) and that N and Z are set from the AND result.

**Operation**
RLA performs two actions as a single instruction:
- Rotate the memory operand left through the Carry (equivalent to ROL {addr}): the processor Carry is shifted into the memory byte's bit0, and the memory byte's bit7 is shifted into the processor Carry.
- AND the accumulator with the rotated memory byte (A := A & {rotated memory}).

Flags and effects:
- Carry: updated by the rotate step (bit7 of memory → Carry; prior Carry → memory bit0).
- Negative (N) and Zero (Z): set according to the result of the AND (the new A).
- Other flags: no effect.

Equivalent (conceptual) instruction sequence:
- ROL {addr}
- AND {addr}

Example usage:
- RLA $FC,X

Notes:
- RLA is an unofficial/undocumented opcode in NMOS 6502 variants (6510 in the C64).
- Test programs covering multiple addressing modes are referenced (see References).

## Source Code
```asm
; Example encoding:
RLA $FC,X
; opcode bytes: 37 FC

; Equivalent instruction sequence:
ROL $FC,X
AND $FC,X

; Test programs:
; Lorenz-2.15/rlaa.prg
; Lorenz-2.15/rlaax.prg
; Lorenz-2.15/rlaay.prg
; Lorenz-2.15/rlaix.prg
; Lorenz-2.15/rlaiy.prg
; Lorenz-2.15/rlaz.prg
; Lorenz-2.15/rlazx.prg
```

## Key Registers
- **Accumulator (A):** Updated with the result of A & {rotated memory}.
- **Processor Status Register (P):**
  - **Carry (C):** Set to the original bit7 of the memory operand.
  - **Negative (N):** Set according to the result of the AND operation.
  - **Zero (Z):** Set if the result of the AND operation is zero.

## References
- "Lorenz-2.15/rlaa.prg" — test program for RLA
- "Lorenz-2.15/rlaax.prg" — test program for RLA with X-index
- "Lorenz-2.15/rlaay.prg" — test program for RLA with Y-index
- "Lorenz-2.15/rlaix.prg" — test program for RLA (indirect,X)
- "Lorenz-2.15/rlaiy.prg" — test program for RLA (indirect),Y
- "Lorenz-2.15/rlaz.prg" — test program for RLA (zero page)
- "Lorenz-2.15/rlazx.prg" — test program for RLA (zero page,X)
- "rla_opcodes_and_addressing_modes" — expanded opcode bytes and addressing modes for RLA
- "rla_examples_scrolling_and_addressing_modes" — applied examples and optimizations using RLA

## Mnemonics
- RLA
