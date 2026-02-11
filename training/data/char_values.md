# Kick Assembler — Char values (.byte/.text, char arithmetic, .charAt)

**Summary:** Char literals use single quotes ('A') and act as a numeric subclass (ASCII code) so they work in immediate operands (lda #'H'), .byte lists (.byte 'H','e'...), .text concatenation ("World"+'!'), and support arithmetic and string methods (e.g., .charAt). Search terms: .byte, .text, char literal, #'H', .charAt, char arithmetic.

**Char values**

Char values in Kick Assembler are character literals written with single quotes (for example, 'A'). They are a numeric sub-class: their value is the character code (ASCII/encoding used by the assembler), so they can be used anywhere a number is allowed (immediate operands, arithmetic, directives that accept numeric data).

Usage patterns:

- **Immediate opcode operands:** Use with `#` for immediate addressing, e.g., `lda #'H'` — assembler emits the byte for 'H'.
- **Data directives:** `.byte` accepts char literals as numeric entries, e.g., `.byte 'H','e','l','l','o'`.
- **String concatenation:** When a char literal is used with `.text` (string directive), the char is converted to its string representation and concatenated, e.g., `.text "World"+'!'`.
- **String access:** String methods like `.charAt(n)` return a char value (numeric), usable in immediate expressions, e.g., `lda #"?!#".charAt(1)` loads the code for the second character ('!').

Char arithmetic:

- Because chars are numbers, arithmetic is valid: `#'H'+1` yields the code for 'I'. You can perform addition/subtraction and use the result as an immediate or data value.

Indexing note:

- `.charAt(n)` follows 0-based indexing (`charAt(1)` returns the second character of the string).

## Source Code

```asm
; Example usage from Kick Assembler section 4.7

lda #'H'
sta $0400
lda #'i'
sta $0401
lda #"?!#".charAt(1)
sta $0402

.byte 'H','e','l','l','o',' '
.text "World"+'!'

; Char arithmetic examples:
lda #'H'+1    ; -> #'I'
sta $0400
lda #'A'+1    ; -> #'B'
sta $0401
lda #'L'+1    ; -> #'M'
sta $0402
```

## References

- "string_values_escape_codes_and_string_functions" — expands on string/char interplay and .charAt usage
