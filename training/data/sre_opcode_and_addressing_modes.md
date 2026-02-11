# NMOS 6510 undocumented opcode: SRE (aka LSE) — $47,$57,$43,$53,$4F,$5F,$5B

**Summary:** Undocumented 6510/6502 opcode SRE (also called LSE) — performs a memory LSR (logical shift right) then EORs the accumulator with that memory. Opcodes: $47,$57,$43,$53,$4F,$5F,$5B; addressing modes: zp, zp,X, (zp,X), (zp),Y, abs, abs,X, abs,Y; affects N, Z and C (carry from LSR); sizes and cycle counts listed below.

## Description
SRE combines two operations into a single undocumented instruction:
1. Shift the addressed memory location right one bit (LSR mem). The bit shifted out (original bit0) is placed into the Carry flag and the memory is updated with the shifted value.
2. EOR the accumulator with the (now-shifted) memory value (A := A XOR mem). N and Z are set according to the EOR result; Carry contains the bit shifted out by the LSR. Other flags are not modified by the EOR beyond N/Z; V is unaffected by the combined operation.

Per-addressing-mode mnemonic forms:
- SRE zp        ; opcode $47
- SRE zp,X      ; opcode $57
- SRE (zp,X)    ; opcode $43
- SRE (zp),Y    ; opcode $53
- SRE abs       ; opcode $4F
- SRE abs,X     ; opcode $5F
- SRE abs,Y     ; opcode $5B

Typical sizes and cycles (see Source Code table for quick reference). Example usage and equivalent instruction sequence are given in Source Code.

Behavioral notes:
- The LSR is performed on memory and writes the shifted value back to memory before the EOR reads it.
- Carry is set to the original memory bit0 (from the LSR).
- N and Z are set from the accumulator after the EOR.
- V (overflow) is unaffected by this opcode.
- This is undocumented/illegal on NMOS 6502-derived CPUs (including the C64 6510) and may not exist or may behave differently on other 6502-family variants.

## Source Code
```text
Opcode listing — addressing mode, size (bytes), cycles, opcode byte
$47  - SRE zp        - 2 bytes - 5 cycles  - $47
$57  - SRE zp,X      - 2 bytes - 6 cycles  - $57
$43  - SRE (zp,X)    - 2 bytes - 8 cycles  - $43
$53  - SRE (zp),Y    - 2 bytes - 8 cycles  - $53
$4F  - SRE abs       - 3 bytes - 6 cycles  - $4F
$5F  - SRE abs,X     - 3 bytes - 7 cycles  - $5F
$5B  - SRE abs,Y     - 3 bytes - 7 cycles  - $5B

Flags affected summary:
- N: set according to A after EOR (result high bit)
- V: unchanged
- B: unchanged (instruction does not push B)
- D: unchanged
- I: unchanged
- Z: set if A after EOR is zero
- C: set to original memory bit0 (from LSR)

Example invocation (absolute,X):
    SRE $C100,X
Encoded bytes (little-endian): 5F 00 C1

Equivalent sequence (semantic equivalent, two instructions):
    LSR $C100,X
    EOR $C100,X

Test program filenames (from Lorenz test collection):
- Lorenz-2.15/lsea.prg
- Lorenz-2.15/lseax.prg
- Lorenz-2.15/lseay.prg
- Lorenz-2.15/lseix.prg
- Lorenz-2.15/lseiy.prg
- Lorenz-2.15/lsez.prg
- Lorenz-2.15/lsezx.prg
```

## References
- "sre_8bit_one_of_eight_counter_example" — Practical 8-bit counter example using SRE and pixel setting integration
- "sre_parity_example_and_lsr_addressing_simulation" — Parity example using repeated SRE; notes on simulating extra LSR addressing modes
- "rra_opcode_header" — Next undocumented opcode section (RRA) following SRE

## Mnemonics
- SRE
- LSE
