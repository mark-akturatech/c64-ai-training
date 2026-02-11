# Kick Assembler — Bitwise operators (AND, OR, XOR, shifts)

**Summary:** Describes Kick Assembler support for bitwise operators in numeric expressions: bitwise AND (&), bitwise OR, exclusive OR, and bit shifting (>> for right shift). Shows use of .var and .word to mask and extract bytes from a 32-bit value.

## Bitwise operators
Kick Assembler permits bitwise operations inside numeric expressions. The source example demonstrates:
- defining a 32-bit numeric constant with .var
- using the bitwise AND operator (&) to mask low bytes
- using the right-shift operator (>>) to move high bytes into the low byte position before masking

This allows extracting individual bytes from a larger integer at assembly time (e.g., to emit bytes with .word or .byte). (Right shift here is a logical shift for unsigned values.)

## Source Code
```asm
; Define a 32-bit value
.var x = $12345678

; Extract and mask bytes:
;  - x & $00ff        -> low byte $78
;  - [x>>16] & $00ff  -> after shifting right 16 bits, mask to get third byte $34
.word x & $00ff, [x>>16] & $00ff  ; gives .word $0078, $0034
```

## References
- "numeric_values_and_basic_arithmetic" — expands on Basic numeric expressions and arithmetic operators
- "numeric_values_table_and_number_function" — expands on Full list and descriptions of bitwise and shift operators
