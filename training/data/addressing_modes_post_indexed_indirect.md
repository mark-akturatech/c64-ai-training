# 6502 — Post-indexed indirect addressing (LDA (zp),Y)

**Summary:** Post-indexed indirect addressing (LDA (zp),Y) uses a zero-page pointer (two bytes at a zero-page address) plus the Y register to form the effective address; example uses $4C/$4D as the pointer, Y = $05, effective address $2105, then LDA loads from that address.

## Post-indexed indirect (zp),Y
In the post-indexed indirect mode the two bytes located at a zero-page address form a 16-bit pointer; the contents of the Y register are added to that pointer to yield the final 16-bit effective address. The assembly syntax shows parentheses around the zero-page operand: LDA ($4C),Y. Note that the parentheses conceptually apply to the zero-page pointer bytes (the second byte of the instruction) because the indirection is performed through that zero-page address.

Example execution sequence:
1. Read the two bytes at zero-page address $004C and $004D to form the base pointer (low byte from $004C, high byte from $004D).
2. Add the Y register to the 16-bit base pointer to produce the effective address.
3. Read the byte at the effective address and load it into the accumulator.

Only the Y register is used for indexing in this mode (no X register involvement).

## Source Code
```asm
    ; single-instruction example
    LDA ($4C),Y
```

```text
; Memory / register values for the example
Address   Value
$004C     $00      ; pointer low byte
$004D     $21      ; pointer high byte
Y-reg.    $05      ; index to add to pointer
$2105     $6D      ; final effective address contains this value
```

```text
; Step-by-step for the example
; (i)  pointer formed from $004C/$004D -> $2100
; (ii) add Y ($05) -> effective address $2105
; (iii) load A <- [$2105] -> $6D
```

## Key Registers
(omitted — this chunk describes an addressing mode, not specific C64 I/O registers)

## References
- "instruction_tables_lda" — expands on LDA (Oper),Y opcode and cycle counts