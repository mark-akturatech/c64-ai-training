# 6502 Multiplication and Division Width Caveat

**Summary:** In 6502 assembly, when dividing multi-byte values, the quotient must be as wide as the dividend, and the remainder as wide as the divisor. This requirement influences the implementation of division routines, such as a 16-bit dividend divided by an 8-bit divisor necessitating a 16-bit quotient. Multiplication (e.g., 1-byte × 1-byte → 2-byte) is mentioned for comparison.

**Caveat and Explanation**

When multiplying two one-byte numbers, the result is a two-byte value. This might lead to the incorrect assumption that dividing a two-byte number by a one-byte number yields a one-byte quotient. In reality:

- The quotient must be as wide as the dividend (e.g., dividing by 1 yields a quotient equal to the dividend).
- The remainder must be as wide as the divisor (it can be as large as divisor − 1).

Practical implications for 6502 routines:

- Do not assume that a smaller divisor produces a proportionally smaller-width quotient.
- When designing division routines for N-byte dividends and M-byte divisors, plan for the quotient to occupy N bytes and the remainder to occupy M bytes.
- Size-specific routines (e.g., 8→8, 16→8, 16→16 division implementations) are straightforward to write once the method is understood but must respect the width rules above.

## Source Code

Below is an example implementation of a 16-bit dividend divided by an 8-bit divisor routine, resulting in a 16-bit quotient and an 8-bit remainder.

```assembly
; 16-bit by 8-bit division routine
; Inputs:
;   Dividend: 16-bit value at DIVIDEND_LO (low byte) and DIVIDEND_HI (high byte)
;   Divisor: 8-bit value in DIVISOR
; Outputs:
;   Quotient: 16-bit value at QUOTIENT_LO (low byte) and QUOTIENT_HI (high byte)
;   Remainder: 8-bit value in REMAINDER

DIVIDE_16_BY_8:
    LDX #16             ; Set bit counter to 16
    LDA #0
    STA REMAINDER       ; Clear remainder
    STA QUOTIENT_HI     ; Clear high byte of quotient
    STA QUOTIENT_LO     ; Clear low byte of quotient

DIV_LOOP:
    ASL DIVIDEND_LO     ; Shift left dividend low byte
    ROL DIVIDEND_HI     ; Shift left dividend high byte
    ROL REMAINDER       ; Shift left remainder

    LDA REMAINDER
    SEC
    SBC DIVISOR         ; Subtract divisor from remainder
    BCC SKIP_SUBTRACT   ; If borrow, skip storing result

    STA REMAINDER       ; Store new remainder
    INC QUOTIENT_LO     ; Increment quotient low byte
    BNE SKIP_SUBTRACT
    INC QUOTIENT_HI     ; Increment quotient high byte if low byte overflows

SKIP_SUBTRACT:
    DEX
    BNE DIV_LOOP        ; Repeat for all 16 bits

    RTS
```

This routine performs a 16-bit by 8-bit division using a shift-and-subtract algorithm, ensuring the quotient is 16 bits wide and the remainder is 8 bits wide.

## References

- "Multiplying and Dividing on the 6502" — Discusses multiplication and division routines on the 6502 processor.
- "6502 Algorithms" — Provides various algorithms, including division, for the 6502 processor.
- "6502 Assembly Language #4: Binary Division" — A video tutorial on implementing binary division in 6502 assembly.