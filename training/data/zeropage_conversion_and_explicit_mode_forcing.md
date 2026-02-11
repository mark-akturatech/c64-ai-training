# Kick Assembler — Zeropage vs Absolute Addressing

**Summary:** Kick Assembler automatically chooses zeropage ($00–$FF) addressing when an immediate/address operand fits and the instruction supports a zeropage form; you can force absolute or zeropage forms with mnemonic suffixes (.a / .abs and .z / .zp). Examples: lda $0030 (auto→zeropage), lda.abs $0040,x, stx.zp zpLabel,y.

## Behavior and Usage
- Automatic conversion: if an address literal or label resolves to a value in $00–$FF and the instruction has a zeropage opcode, the assembler emits the zeropage form (shorter encoding). Example: lda $0030 will be assembled as lda (zeropage).
- Forcing a mode:
  - Append .a or .abs to force the absolute form of the mnemonic (even if the operand fits in zeropage).
  - Append .z or .zp to force zeropage form (even if the assembler would otherwise use absolute).
  - Both full and abbreviated suffixes are accepted (.abs ≡ .a, .zp ≡ .z).
- Suffix semantics are applied to the mnemonic only; forcing a mode on an instruction that has no such addressing variant has no effect (e.g., jmp.z $1000 does nothing because JMP has no zeropage opcode).
- Label definition example (constant for zeropage): .label zpLabel = $10
- The suffix affects which opcode is selected (zeropage vs absolute), including indexed variants (.abs with ,x yields absolute,X opcode; .zp with ,y yields zeropage,Y if supported).
- Deprecated/alternative mnemonic extensions exist (see references) — this node documents the current .a/.abs and .z/.zp forms.

## Source Code
```asm
; Automatic conversion example (assembler will pick zeropage if supported)
lda $0030        ; assembler will assemble the zeropage LDA opcode if supported

; Forcing absolute
lda.abs $0040,x  ; uses absolute,X opcode
lda.a   $0030,x  ; same as .abs (forces absolute even though $0030 fits in zeropage)

; Forcing zeropage
stx.zp zpLabel,y ; uses zeropage,Y opcode (if STX supports zp,Y)
stx.z  zpLabel,y ; same as .zp

; Label definition
.label zpLabel = $10

; Forcing a mode that doesn't exist for the mnemonic — no effect
jmp.z $1000      ; JMP has no zeropage opcode, so this suffix is ignored
```

## References
- "6502_addressing_modes_overview" — expands on full list of addressing modes that may be chosen or forced
- "deprecated_mnemonic_extensions" — expands on alternative (deprecated) mnemonic extensions for forcing modes
