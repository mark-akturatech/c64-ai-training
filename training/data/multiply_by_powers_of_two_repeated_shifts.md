# Multiply by powers of two (ASL/ROL)

**Summary:** Demonstrates 6502 assembly technique for multiplying by powers of two using ASL (arithmetic shift left) and ROL (rotate left) for single- and multi-byte values; shows examples for multiplying a 1‑byte value by 4 and a 2‑byte value by 4. Searchable terms: ASL, ROL, multiply-by-2, two-byte multiply.

## Description
Multiplying by a power of two is implemented on the 6502 by repeating a multiply-by-2 operation (ASL / ROL) the required number of times: 2^n is achieved by n left shifts. For single-byte values a plain ASL shifts the byte left and places the high bit into the carry. For multi-byte values propagate the carry into the next byte with ROL so the full multi-byte number shifts left correctly.

Examples shown here:
- Multiply a single-byte value by 4: perform ASL twice (ASL = multiply by 2).
- Multiply a two-byte little-endian value (low byte at NUM, high byte at NUM+1) by 4: perform ASL/ROL pairs to propagate carries between bytes.

Repeat ASL/ROL sequences additional times to multiply by 8, 16, etc. (e.g., three ASL/ROL pairs to multiply a two-byte value by 8).

## Source Code
```asm
; Multiply one-byte number NUM by 4 (NUM <<= 2)
        ASL NUM
        ASL NUM

; Multiply two-byte number NUM+1:NUM (low at NUM, high at NUM+1) by 4
        ASL NUM        ; shift low, carry -> C
        ROL NUM+1      ; rotate carry into high
        ASL NUM        ; second shift of low
        ROL NUM+1      ; propagate carry into high
```

## References
- "multiply_by_two_basic" — single- and two-byte multiply-by-2 examples
- "multiply_by_non_power_of_two_strategy" — combining power-of-two results to form other constants

## Mnemonics
- ASL
- ROL
