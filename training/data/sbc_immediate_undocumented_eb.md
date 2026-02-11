# NMOS 6510 — Undocumented Opcodes: $EB (SBC #imm) and LAS ($BB)

**Summary:** This document details two undocumented opcodes of the NMOS 6510 processor: $EB, which functions identically to the standard SBC immediate instruction, and LAS (opcode $BB), an Absolute,Y addressing mode instruction that performs a bitwise AND between memory and the stack pointer, storing the result in the accumulator, X register, and stack pointer. It includes information on instruction sizes, operations, flag behaviors, example usages, equivalent instruction sequences, and references to test programs.

**Description**

- **$EB (SBC #imm):** This undocumented opcode operates as an immediate mode SBC (Subtract with Carry) instruction. It is 2 bytes in size and requires 2 cycles to execute. The operation and flag behavior are identical to the standard SBC #imm instruction:

  - **Operation:** A = A - Immediate - (1 - C)
  - **Flags Affected:**
    - **N (Negative):** Set if the result is negative.
    - **V (Overflow):** Set if signed overflow occurs.
    - **Z (Zero):** Set if the result is zero.
    - **C (Carry):** Set if no borrow occurs; cleared if a borrow occurs.

- **LAS (opcode $BB):** This 3-byte Absolute,Y addressing mode instruction performs the following operations:

  - **Operation:**
    1. Read memory at (absolute address) + Y.
    2. Compute (memory) AND SP.
    3. Store the result into A, X, and SP concurrently.
    4. Set flags N and Z according to the result.

  - **Size:** 3 bytes
  - **Cycles:** 4 cycles (+1 if page boundary is crossed)
  - **Flags Affected:**
    - **N (Negative):** Set if the result is negative.
    - **Z (Zero):** Set if the result is zero.
    - **Other flags:** Not affected.

  **Example Usage:**
  - `LAS $C000,Y`

  **Equivalent Instruction Sequence:**
  - `TSX`
  - `TXA`
  - `AND $C000,Y`
  - `TAX`
  - `TXS`

  Note: Some reports suggest that LAS may be unreliable, but testing indicates consistent behavior.

## Source Code

The following is an assembly test program for the LAS instruction:

```assembly
; Test program for LAS instruction
; Assumes Y register is set appropriately

    LDX #$FF        ; Initialize X register
    TXS             ; Set stack pointer to $FF
    LDY #$00        ; Initialize Y register
    LDA #$AA        ; Load A with test value
    STA $C000       ; Store test value at $C000
    LAS $C000,Y     ; Execute LAS instruction
    ; A, X, and SP should now all be $AA
    ; N and Z flags should be set according to the result
    BRK             ; End of program
```

## References

- "CPU/asap/cpu_las.prg" — Test code referenced in source
- "Lorenz-2.15/lasay.prg" — Test code referenced in source
- "NMOS 6510 Unintended Opcodes - No More Secrets v0.99" by groepaz
- "C64 Studio - CPU - 6510 - Opcodes"
- "Opcode - C64-Wiki"
- "6502 / 6510 Instruction Set | C64 OS"
- "6502/6510/8500/8502 Opcodes"
- "6502 Opcodes"
- "MOS 6502 6510 65xx CPU processor opcodes - ElfQrin.com"
- "CPU - 6502 - FCEUX Documentation"
- "base:6510_instructions_by_addressing_modes [Codebase64 wiki]"
- "6502 - map of documented opcodes · GitHub"
- "File: mainc64cpu.c | Debian Sources"
- "Unknown Op-Code. - Commodore 64 - Lemon64 - Commodore 64"
- "Chapter 3 – Intro to 6510 Assembly – Scanline Memory"

## Mnemonics
- SBC
- LAS
