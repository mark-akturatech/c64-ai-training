# NMOS 6510 undocumented opcodes: SHA, SHY, SHX, TAS, LAS ($93, $9F/$9C, $9E, $9B, $BB)

**Summary:** This document details the undocumented NMOS 6510 opcodes SHA, SHY, SHX, TAS, and LAS, corresponding to opcode bytes $93, $9F/$9C, $9E, $9B, and $BB. These instructions perform combined-register bitwise operations, writing the result to memory or modifying the stack pointer. The document includes explicit addressing modes, definitions of notation such as "{H+1}", and observed flag behaviors.

**Behavior Overview**

The following undocumented opcodes perform combined-register bitwise operations:

- **SHA** ($93, $9F)
  - **Addressing Modes:**
    - $93: (Indirect),Y
    - $9F: Absolute,Y
  - **Effect:** `{addr} = A & X & {H+1}`

- **SHY** ($9C)
  - **Addressing Mode:** Absolute,X
  - **Effect:** `{addr} = Y & {H+1}`

- **SHX** ($9E)
  - **Addressing Mode:** Absolute,Y
  - **Effect:** `{addr} = X & {H+1}`

- **TAS** ($9B)
  - **Addressing Mode:** Absolute,Y
  - **Effects:**
    - `SP = A & X`
    - `{addr} = SP & {H+1}`

- **LAS** ($BB)
  - **Addressing Mode:** Absolute,Y
  - **Effects:**
    - `{addr} = SP & {H+1}`
    - `A, X, SP = {addr} & SP`

**Note on "{H+1}":** In these operations, "{H+1}" refers to the high byte of the effective address incremented by one. This value is derived from the addressing mode and the specific address targeted by the instruction. For example, in Absolute,Y addressing, if the base address is $12FF and Y is $01, the effective address is $1300, making H+1 equal to $14.

**Flag Behavior:**

- **SHA, SHY, SHX:** These instructions do not affect any processor flags.
- **TAS:** Modifies the Stack Pointer (SP) but does not affect other flags.
- **LAS:** Loads A, X, and SP registers; sets the Negative (N) and Zero (Z) flags based on the result.

**Addressing Mode Clarifications:**

- **SHA ($93):** (Indirect),Y addressing mode.
- **SHA ($9F):** Absolute,Y addressing mode.
- **SHY ($9C):** Absolute,X addressing mode.
- **SHX ($9E):** Absolute,Y addressing mode.
- **TAS ($9B):** Absolute,Y addressing mode.
- **LAS ($BB):** Absolute,Y addressing mode.

**Note on Addressing Mode Notation:**

The notation "{H+1}" is used to indicate the high byte of the effective address incremented by one. This is particularly relevant in indexed addressing modes where the addition of the index register to the base address may cause a page boundary crossing, affecting the high byte of the address.

## References

- "NMOS 6510 Unintended Opcodes: No More Secrets"
- "6502/6510/8500/8502 Opcodes"
- "Undocumented instruction support - Millfork documentation"
- "Opcode - C64-Wiki"
- "6502/6510/8500/8502 Opcodes"
- "6502 Opcodes"

## Mnemonics
- SHA
- SHY
- SHX
- TAS
- LAS
