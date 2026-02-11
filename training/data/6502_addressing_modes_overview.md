# Kick Assembler — 6502/C64 Addressing Modes (Examples)

**Summary:** Lists traditional 6502/C64 addressing modes and Kick Assembler notation with examples: no-argument, immediate (#), zeropage, zeropage,X/Y, indirect zeropage,X/Y, absolute, absolute,X/Y, indirect (JMP), relative (branch), and 65C02-specific modes (indirect zeropage, zeropage-relative, indirect absolute+X).

## Argument Types
Kick Assembler uses traditional 6502 addressing-mode notation. The common modes covered here are listed with canonical example mnemonics. (Zeropage = low 256 bytes of memory; Relative = branch offset from PC.)

- No-argument
- Immediate (#value)
- Zeropage
- Zeropage,X / Zeropage,Y
- Indirect zeropage,X and indirect zeropage,Y
- Absolute
- Absolute,X / Absolute,Y
- Indirect (absolute) — JMP ($hhhh)
- Relative (branches)
- 65C02-specific: indirect zeropage (adc ($12)), zeropage-relative (bbr1 $12,label), indirect absolute+X (jmp ($1234,x))

## Source Code
```asm
; Traditional 6502 / Kick Assembler examples

nop
lda #$30           ; immediate
lda $30            ; zeropage
lda $30,x          ; zeropage,X
ldx $30,y          ; zeropage,Y
lda ($30,x)        ; indirect zeropage,X
lda ($30),y        ; indirect zeropage,Y
lda $1000          ; absolute
lda $1000,x        ; absolute,X
lda $1000,y        ; absolute,Y
jmp ($1000)        ; indirect (absolute)
bne loop           ; relative to program counter (branch)

; 65C02-specific modes
adc ($12)          ; indirect zeropage (65C02)
bbr1 $12,label     ; zeropage-relative (65C02)
jmp ($1234,x)      ; indirect with absolute+X (65C02)
```

## References
- "zeropage_conversion_and_explicit_mode_forcing" — expands on automatic zeropage conversion and suffixes to force addressing forms
- "deprecated_mnemonic_extensions" — deprecated mnemonic suffixes that also force addressing modes (kept for backward compatibility)
