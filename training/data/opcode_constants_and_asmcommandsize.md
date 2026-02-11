# Kick Assembler opcode/addressing-mode constants (mnemonic suffixes)

**Summary:** Describes Kick Assembler opcode constant naming (uppercase mnemonics with addressing-mode suffixes) and example constants (LDA_IZPX, LDA_IZPY, LDA_ABS, RTS). Covers `asmCommandSize(...)` usage to obtain encoded instruction size (e.g., RTS=1, LDA_IMM=2, LDA_ABS=3) and examples for indexed-indirect/indirect-indexed LDA forms.

**Naming and usage**

Kick Assembler exposes each 6502 opcode as a constant formed from the uppercase mnemonic plus an addressing-mode suffix. Examples and conventions shown here are intended for use in self-modifying code and assembler macros.

- General pattern: `MNEMONIC_ADDRESSMODE` (e.g., `RTS`, `LDA_IMM`, `LDA_ABS`).
- Use `asmCommandSize(<opcode_constant>)` to get the assembled instruction size in bytes:
  - `asmCommandSize(RTS)` → 1
  - `asmCommandSize(LDA_IMM)` → 2
  - `asmCommandSize(LDA_ABS)` → 3

Indexed-indirect / indirect-indexed forms from the source:
- `LDA_IZPX` — corresponds to the assembly form: `lda ($30,x)` (indexed indirect, zeropage,X). Size: 2 bytes (opcode + zeropage address).
- `LDA_IZPY` — corresponds to the assembly form: `lda ($30),y` (indirect indexed, zeropage),Y. Size: 2 bytes (opcode + zeropage address).

Notes:
- "ABS" in a suffix refers to absolute addressing (e.g., `LDA_ABS` → `lda $HHLL`).
- `asmCommandSize` returns the assembled byte length (opcode + operand bytes).

**[Note: Source may contain an error — some documentation and assemblers use suffixes IZX/IZY or IZPX/IZPY interchangeably; verify canonical names in your Kick Assembler distribution.]**

## Source Code

```text
; Examples (Kick Assembler constant names → assembly → encoded size)
; RTS            -> rts             -> 1 byte
; LDA_IMM        -> lda #$nn        -> 2 bytes
; LDA_ABS        -> lda $HHLL       -> 3 bytes
; LDA_IZPX       -> lda ($30,x)     -> 2 bytes  ; indexed indirect (zeropage,X)
; LDA_IZPY       -> lda ($30),y     -> 2 bytes  ; indirect indexed (zeropage),Y
```

```asm
; Assembly examples
    LDA #$10        ; immediate (LDA_IMM)  ; 2 bytes
    LDA $1234       ; absolute  (LDA_ABS)  ; 3 bytes
    LDA ($30,X)     ; indexed indirect      ; 2 bytes
    LDA ($30),Y     ; indirect indexed      ; 2 bytes
    RTS             ; return from subroutine; 1 byte
```

## References

- "addressing_modes_table" — expands on addressing modes list and examples
- Kick Assembler Manual: [Argument Types](https://www.theweb.dk/KickAssembler/webhelp/content/ch03s02.html)
- Kick Assembler Manual: [Opcode Constants](https://www.theweb.dk/KickAssembler/webhelp/content/ch14s03.html)

## Mnemonics
- LDA
- RTS
