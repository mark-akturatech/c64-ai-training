# Immediate Mode Addressing

**Summary:** Immediate addressing uses an operand prefixed by '#' to supply a literal value to the accumulator register (e.g., `LDA #$00` or `LDA #BLACK` where `BLACK` is equated to `$00`). Immediate mode does not read memory; the value following '#' is used directly.

**Immediate Mode Addressing**

In immediate mode, the operand is a literal value (or a label previously equated to a value) prefixed with the '#' character. The processor loads that literal into the accumulator without performing a memory read.

Examples:
- `LDA #$00` — loads the literal byte `$00` into the accumulator.
- `LDA #BLACK` — if `BLACK` has been equated to `$00`, this is identical to `LDA #$00`.

Contrast: Other addressing modes obtain data from memory locations specified by the operand; immediate mode supplies the data directly.

## Source Code

```asm
; label equated to a value
BLACK = $00

; immediate-mode loads (no memory access)
LDA #$00
LDA #BLACK
```

## References

- "assembly_syntax_labels_comments" — expands on use of labels as immediate values
- 6502 Instruction Set ([masswerk.at](https://www.masswerk.at/6502/6502_instruction_set.html?utm_source=openai))
- 6502 Programmers Reference ([csh.rit.edu](https://www.csh.rit.edu/~moffitt/docs/6502.html?utm_source=openai))

## Labels
- BLACK
