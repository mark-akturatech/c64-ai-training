# NMOS 6510 — Undocumented LAX opcode (Load A and X)

**Summary:** Undocumented 6502/6510 opcode family LAX loads both the accumulator (A) and X register from memory. Includes opcodes ($A7,$B7,$A3,$B3,$AF,$BF), addressing modes, byte sizes, cycle counts (with +1 on page-cross for some indexed modes), example encoding, equivalent LDA/TAX sequence, and test program names.

## Description
LAX is an undocumented instruction found on NMOS 6502 / 6510 variants that performs a single memory read and copies the result into both A and X. It is effectively a combined LDA (load accumulator) followed by TAX (transfer A to X) in one opcode. Several addressing modes are implemented by different illegal opcode bytes; some indexed addressing modes add one extra cycle on a page boundary crossing.

- Operation: A ← M; X ← M (load memory into both accumulator and X)
- Common use: save a memory byte into both A and X in one instruction (space/time savings compared to LDA..TAX)
- Note: This chunk preserves only the opcode, size and timing details present in the source. (Flag effects are not restated here.)

## Source Code
```text
Undocumented LAX opcode summary (NMOS 6502 / 6510)

Mnemonic  Addressing mode   Bytes  Cycles      Opcode
--------  ----------------  -----  ------      ------
LAX       zp                2      3           $A7
LAX       zp,Y              2      4           $B7
LAX       (zp,X)            2      6           $A3
LAX       (zp),Y            2      5 (+1 on page cross)  $B3
LAX       abs               3      4           $AF
LAX       abs,Y             3      4 (+1 on page cross)  $BF

Notes:
- Cycle counts follow the usual 6502 timing patterns for equivalent addressing modes.
- "+1 on page cross" applies to the (zp),Y and absolute,Y indexed addressing modes.
```

```asm
; Example: use LAX with absolute,Y to load A and X from $8400 + Y
        LAX $8400,Y
; machine code bytes (little-endian address): BF 00 84

; Equivalent two-instruction sequence:
        LDA $8400,Y
        TAX
```

```text
Test program file names (from source):
- Lorenz-2.15/laxa.prg
- Lorenz-2.15/laxay.prg
- Lorenz-2.15/laxix.prg
- Lorenz-2.15/laxiy.prg
- Lorenz-2.15/laxz.prg
- Lorenz-2.15/laxzy.prg
```

## References
- "lax_example_simulate_lda_zp_y" — Demonstrates using LAX zp,Y to save a byte by trashing X
- "lax_load_a_x_same_value" — Shows technique of loading A and X together for later reuse

## Mnemonics
- LAX
