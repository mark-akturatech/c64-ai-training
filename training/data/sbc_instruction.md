# SBC — Subtract with Carry (6502)

**Summary:** SBC (Subtract with Carry) 6502 instruction opcodes and addressing modes: Immediate ($E9), Zero Page ($E5), Zero Page,X ($F5), Absolute ($ED), Absolute,X ($FD), Absolute,Y ($F9), (Indirect,X) ($E1), (Indirect),Y ($F1). Affects flags N (Negative), V (Overflow), Z (Zero), C (Carry).

## Instruction overview
SBC — Subtract with Carry. Available addressing modes and their opcodes/lengths are listed below. Flags affected: Negative, Overflow, Zero, Carry. (This entry lists supported addressing modes and opcode bytes; operand/address semantics are not expanded here.)

Supported addressing modes:
- Immediate
- Zero Page
- Zero Page,X
- Absolute
- Absolute,X
- Absolute,Y
- (Indirect,X) — Indexed-Indirect
- (Indirect),Y — Indirect-Indexed

## Source Code
```asm
; SBC opcode summary (mnemonic, addressing mode, opcode, bytes, flags affected)
SBC    Absolute             ; SBC $aaaa     ; $ED ; 3 bytes ; N,V,Z,C
SBC    Zero Page            ; SBC $aa       ; $E5 ; 2 bytes ; N,V,Z,C
SBC    Immediate            ; SBC #$aa      ; $E9 ; 2 bytes ; N,V,Z,C
SBC    Absolute,X           ; SBC $aaaa,X   ; $FD ; 3 bytes ; N,V,Z,C
SBC    Absolute,Y           ; SBC $aaaa,Y   ; $F9 ; 3 bytes ; N,V,Z,C
SBC    Zero Page,X          ; SBC $aa,X     ; $F5 ; 2 bytes ; N,V,Z,C
SBC    (Zero Page,X)        ; SBC ($aa,X)   ; $E1 ; 2 bytes ; N,V,Z,C
SBC    (Zero Page),Y        ; SBC ($aa),Y   ; $F1 ; 2 bytes ; N,V,Z,C
```

## References
- "adc_instruction" — related arithmetic instruction (Add with Carry)

## Mnemonics
- SBC
