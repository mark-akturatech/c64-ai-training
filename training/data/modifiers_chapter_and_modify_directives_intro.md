# Kick Assembler: .filemodify and .modify (Chapter 13 — Modifiers)

**Summary:** Explains Kick Assembler modifiers that alter assembled bytes before storage (.filemodify for whole-file plugins, .modify for local blocks), the asmCommandSize call to query assembled mnemonic sizes, and demonstrates the use of origin adjustment (*=) and .fill inside .modify blocks.

**Modifier overview**
Modifiers are plugins or local blocks that run after assembly of bytes but before those bytes are written to the output file/image. Typical uses: encrypting, packing/crunching, or otherwise transforming assembled bytes.

- `.filemodify MyModifier(arg)` — register a modifier that receives the whole file output (used for global/file-level transformations).
- `.modify MyModifier() { ... }` — a local modifier block that can be applied to a specific assembly region (local in-place modification before storage).
- Inside a `.modify` block, you can change the current origin (using `*=`) and emit/alter bytes (for example, using `.fill`). The modifier block scope applies only to the enclosed code.

Segment-level modifiers are related but distinct from `.modify` local blocks; see the referenced "segment_modifiers_intro" for details on segment-scoped modifiers.

**asmCommandSize and opcode sizes**
Use `asmCommandSize(<mnemonic>)` to obtain the assembled size (in bytes) of a specific mnemonic/addressing-mode token. This lets modifier code compute offsets/patch sizes reliably.

Examples:
- `RTS` is 1 byte
- `LDA_IMM` (lda #imm) is 2 bytes
- `LDA_ABS` (lda abs) is 3 bytes

**Addressing modes**
The following table lists the addressing modes, their descriptions, example constants, and example commands:

| Argument | Description             | Example Constant | Example Command |
|----------|-------------------------|------------------|-----------------|
| None     | No argument             | `RTS`            | `rts`           |
| IMM      | Immediate               | `LDA_IMM`        | `lda #$30`      |
| ZP       | Zeropage                | `LDA_ZP`         | `lda $30`       |
| ZPX      | Zeropage,x              | `LDA_ZPX`        | `lda $30,x`     |
| ZPY      | Zeropage,y              | `LDX_ZPY`        | `ldx $30,y`     |
| IZPX     | Indirect zeropage,x     | `LDA_IZPX`       | `lda ($30,x)`   |
| IZPY     | Indirect zeropage,y     | `LDA_IZPY`       | `lda ($30),y`   |
| ABS      | Absolute                | `LDA_ABS`        | `lda $1000`     |
| ABSX     | Absolute,x              | `LDA_ABSX`       | `lda $1000,x`   |
| ABSY     | Absolute,y              | `LDA_ABSY`       | `lda $1000,y`   |
| IND      | Indirect                | `JMP_IND`        | `jmp ($1000)`   |
| REL      | Relative                | `BNE_REL`        | `bne loop`      |

## Source Code
```asm
; Register a file-level modifier
.filemodify MyModifier(25)

; Local modify-block with origin adjustment and byte filling
.modify MyModifier() {
    *=$8080
main:
    inc $d020
    dec $d021
    jmp main

    *=$1000
    .fill $100, i
}

; Example: place an RTS opcode at 'target' by using the RTS constant
lda #RTS
sta target

; Query assembled sizes of mnemonics
.var rtsSize = asmCommandSize(RTS)      ; rtsSize = 1
.var ldaSize1 = asmCommandSize(LDA_IMM) ; ldaSize1 = 2
.var ldaSize2 = asmCommandSize(LDA_ABS) ; ldaSize2 = 3
```

## References
- "segment_modifiers_intro" — expands on segment-level modifiers vs .modify for local blocks

## Mnemonics
- RTS
- LDA_IMM
- LDA_ABS
