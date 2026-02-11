# Kick Assembler — Deprecated mnemonic extensions (explicit addressing-mode suffixes)

**Summary:** Lists Kick Assembler's deprecated mnemonic-extension tokens that explicitly force 6502 addressing modes (im/imm, z/zp, zx/zpx, zy/zpy, izx/izpx, izy/izpy, ax/absx, ay/absy, I/ind, r/rel) with example usages such as lda.absx $1234 and jmp.i $1000.

## Deprecated mnemonic extensions
Kick Assembler supported a set of deprecated suffix tokens appended to mnemonics to force a specific 6502 addressing mode. These tokens are kept only for backward compatibility and explicitly select the assembler encoding for an instruction regardless of operand value.

The tokens and the modes they force are listed in the table below (see Source Code for the canonical table and example usages).

Do not rely on these deprecated extensions in new code; use modern suffixes (.a/.abs/.z/.zp etc.) or let the assembler select the addressing mode from the operand where appropriate.

## Source Code
```text
Table 3.3. Deprecated Mnemonic Extensions

Ext     Mode
im,imm Immediate
z,zp   Zeropage
       Example: ldx.z $1234
zx,zpx Zeropage,X
       Example: lda.zpx table
zy,zpy Zeropage,Y
izx,izpx Indirect zeropage,X
izy,izpy Indirect zeropage,Y
ax,absx Absolute,X
ay,absy Absolute,Y
I,ind  Indirect
r,rel  Relative to program counter

Example usages:
lda.absx $1234
jmp.i $1000
```

```asm
; Minimal usage examples (deprecated suffixes)
    LDX.Z  $1234       ; force zeropage (deprecated)
    LDA.ZPX table      ; force (zeropage,X) (deprecated)
    LDA.ABSX $1234     ; force absolute,X (deprecated)
    JMP.I  $1000       ; force indirect (deprecated)
```

## References
- "6502_addressing_modes_overview" — expands on the canonical addressing modes table and examples
- "zeropage_conversion_and_explicit_mode_forcing" — expands on modern suffixes (.a/.abs/.z/.zp) used to force addressing modes