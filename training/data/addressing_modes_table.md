# Kick Assembler: 6502 Addressing Modes and C64 Colour Constants

**Summary:** Lists Kick Assembler addressing-mode tokens (None, IMM, ZP, ZPX, ZPY, IZPX, IZPY, ABS, ABSX, ABSY, IND, REL) with example mnemonics and example instructions; includes the built-in Commodore 64 colour constants (BLACK..LIGHT_GRAY) with their numeric values.

## Addressing Modes
Tokens and common example mnemonics used in Kick Assembler for 6502 instructions:

- None — implied/stack-return (example mnemonic: RTS)
- IMM — immediate (example mnemonic: LDA_IMM; assembly form: lda #$30)
- ZP — zero page (LDA_ZP; lda $30)
- ZPX — zero page,X (LDA_ZPX; lda $30,x)
- ZPY — zero page,Y (LDX_ZPY; ldx $30,y)
- IZPX — (indirect,X) (LDA_IZPX; lda ($30,x))
- IZPY — (indirect),Y (LDA_IZPY; lda ($30),y)
- ABS — absolute (LDA_ABS; lda $1000)
- ABSX — absolute,X (LDA_ABSX; lda $1000,x)
- ABSY — absolute,Y (LDA_ABSY; lda $1000,y)
- IND — indirect (JMP_IND; jmp ($1000))
- REL — relative branch (BNE_REL; bne loop)

These tokens correspond to Kick Assembler opcode constant naming conventions (e.g., LDA_ABS, JMP_IND). Use the IMM form for immediate operands with '#' and the REL form for assembler branch encoding.

## Source Code
```asm
; Addressing mode examples (Kick Assembler naming and example assembly)
.; None (implied)
RTS_NONE    rts

; Immediate
LDA_IMM     lda #$30

; Zero page
LDA_ZP      lda $30

; Zero page,X
LDA_ZPX     lda $30,x

; Zero page,Y
LDX_ZPY     ldx $30,y

; (Indirect,X)
LDA_IZPX    lda ($30,x)

; (Indirect),Y
LDA_IZPY    lda ($30),y

; Absolute
LDA_ABS     lda $1000

; Absolute,X
LDA_ABSX    lda $1000,x

; Absolute,Y
LDA_ABSY    lda $1000,y

; Indirect (for JMP)
JMP_IND     jmp ($1000)

; Relative (branch)
BNE_REL     bne loop
```

```text
Table 14.2 — Kick Assembler C64 Colour Constants
Constant         Value
BLACK            0
WHITE            1
RED              2
CYAN             3
PURPLE           4
GREEN            5
BLUE             6
YELLOW           7
ORANGE           8
BROWN            9
LIGHT_RED        10
DARK_GRAY/DARK_GREY   11
GRAY/GREY             12
LIGHT_GREEN           13
LIGHT_BLUE            14
LIGHT_GRAY/LIGHT_GREY 15
```

## References
- "opcode_constants_and_asmcommandsize" — expands on use of asmCommandSize with these constants and opcode constant usage.