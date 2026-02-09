# 6502 Addressing: Absolute and Zero-page

**Summary:** Absolute addressing encodes a full 16-bit address (low byte stored first) while zero-page addressing uses a single byte address with an implicit high byte $00; opcodes differ (e.g. LDA absolute $AD, LDA zero-page $A5). Examples: LDA $31F6 -> $AD $F6 $31; LDA $F4 -> $A5 $F4.

## Absolute vs Zero-page addressing
- Absolute mode: operand is a full 16-bit address. Machine encoding stores the low byte first, then the high byte. Instruction length: 3 bytes. Example opcode for LDA (absolute) is $AD.
- Zero-page mode: operand is a single byte (0x00xx addresses). The processor assumes the high byte is $00. Instruction length: 2 bytes. Example opcode for LDA (zero-page) is $A5.
- Note: "Zero-page absolute" is commonly shortened to "zero-page" in documentation.

## Source Code
```asm
; Assembler and corresponding machine code examples

; Absolute addressing (16-bit address, low byte first)
    LDA $31F6       ; assembler
; machine bytes: $AD $F6 $31

; Zero-page addressing (implicit high byte $00)
    LDA $F4         ; assembler
; machine bytes: $A5 $F4
```

## References
- "instruction_tables_lda" — expands on LDA absolute and zero-page opcodes