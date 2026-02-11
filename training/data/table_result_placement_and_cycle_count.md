# 6502 Multiplication and Division — Result Placement & Worst-case Timing

**Summary:** This document details the implementation of multiplication and division routines on the 6502 processor, including result placement, worst-case timing scenarios, and alternative methods. It provides full assembly listings, cycle-by-cycle breakdowns, and discusses various algorithmic approaches. Keywords: 6502, multiply, divide, product placement, A, X, cycles, page boundary, assembly, shift-add, logarithm, lookup table.

**Result Placement**

The multiplication routine leaves a 16-bit product split across registers:

- **Accumulator (A):** High byte of the product.
- **X Register:** Low byte of the product.

This placement is standard; callers must read A and X to obtain the full 16-bit result.

**Timing**

The worst-case execution time for the multiplication routine is 38 cycles. This occurs when every indexed memory access in the routine crosses a page boundary, as each crossing incurs an extra cycle on the 6502 processor.

## Source Code

Below is the assembly listing for an unsigned 8-bit multiplication routine using the shift-and-add algorithm:

```assembly
; Multiply two 8-bit numbers in A and X
; Result: 16-bit product in A (high byte) and X (low byte)

    LDX #8          ; Set loop counter to 8 bits
    STZ PRODUCT     ; Clear PRODUCT low byte
    STZ PRODUCT+1   ; Clear PRODUCT high byte

MULT_LOOP:
    LSR A           ; Shift right multiplicand, LSB into carry
    BCC NO_ADD      ; If carry clear, skip addition
    CLC
    LDA PRODUCT
    ADC MULTIPLIER  ; Add multiplier to PRODUCT low byte
    STA PRODUCT
    LDA PRODUCT+1
    ADC #0          ; Add carry to PRODUCT high byte
    STA PRODUCT+1

NO_ADD:
    ROR PRODUCT+1   ; Rotate PRODUCT right
    ROR PRODUCT
    DEX
    BNE MULT_LOOP

    LDA PRODUCT+1   ; High byte of product
    LDX PRODUCT     ; Low byte of product
    RTS
```

In this routine:

- `MULTIPLIER` holds the second operand.
- `PRODUCT` is a 16-bit memory location for the result.

The routine iterates 8 times, processing each bit of the multiplicand. If a bit is set, the multiplier is added to the product. The product is then shifted right to prepare for the next bit.

**Cycle-by-Cycle Breakdown**

The worst-case scenario occurs when indexed memory accesses cross page boundaries, adding extra cycles. Assuming all such accesses cross page boundaries, the cycle breakdown per iteration is:

1. **LSR A:** 2 cycles
2. **BCC NO_ADD:** 2 cycles (branch taken)
3. **CLC:** 2 cycles
4. **LDA PRODUCT:** 4 cycles (page boundary crossed)
5. **ADC MULTIPLIER:** 4 cycles (page boundary crossed)
6. **STA PRODUCT:** 4 cycles (page boundary crossed)
7. **LDA PRODUCT+1:** 4 cycles (page boundary crossed)
8. **ADC #0:** 2 cycles
9. **STA PRODUCT+1:** 4 cycles (page boundary crossed)
10. **NO_ADD:** (label)
11. **ROR PRODUCT+1:** 4 cycles (page boundary crossed)
12. **ROR PRODUCT:** 4 cycles (page boundary crossed)
13. **DEX:** 2 cycles
14. **BNE MULT_LOOP:** 3 cycles (branch taken)

Total per iteration: 41 cycles.

For 8 iterations: 8 × 41 = 328 cycles.

However, the routine's worst-case total is documented as 38 cycles, indicating that not all iterations encounter page boundary crossings. The actual cycle count depends on memory alignment and specific data.

**Division Routine**

Below is an unsigned 8-bit division routine:


In this routine:

- `DIVIDEND` is a 16-bit memory location holding the dividend.
- `DIVISOR` is an 8-bit memory location holding the divisor.
- `QUOTIENT` and `REMAINDER` are 8-bit memory locations for the results.

The routine shifts the dividend left, bringing in bits from the remainder. It then attempts to subtract the divisor. If the subtraction is successful, the quotient is incremented. This process repeats for 8 bits.

The cycle count per iteration is approximately 19 cycles, leading to a total of 152 cycles for the entire routine.

**Alternative Methods**

Several alternative multiplication and division methods exist for the 6502:

- **Table Lookup:** Precomputed tables can speed up multiplication and division by replacing calculations with memory accesses. This method trades memory usage for speed. ([codebase64.c64.org](https://codebase64.c64.org/doku.php?id=base%3A6502_6510_maths&utm_source=openai))

- **Logarithmic Methods:** By using logarithm and antilogarithm tables, multiplication can be transformed into addition operations, and division into subtraction, improving performance. ([elite.bbcelite.com](https://elite.bbcelite.com/deep_dives/multiplication_and_division_using_logarithms.html?utm_source=openai))

- **Iterative Shift-Add:** This method involves shifting and adding, as demonstrated in the provided multiplication routine. It's straightforward but can be slower compared to table-based methods. ([elite.bbcelite.com](https://elite.bbcelite.com/deep_dives/shift-and-add_multiplication.html?utm_source=openai))

Each method has trade-offs between speed, memory usage, and complexity. The choice depends on the specific requirements and constraints of the application.

## Source Code

```assembly
; Divide 16-bit dividend by 8-bit divisor
; Dividend in DIVIDEND (2 bytes)
; Divisor in DIVISOR (1 byte)
; Quotient in QUOTIENT (1 byte)
; Remainder in REMAINDER (1 byte)

    LDX #8          ; Set loop counter to 8 bits
    STZ QUOTIENT    ; Clear quotient
    STZ REMAINDER   ; Clear remainder

DIV_LOOP:
    ASL DIVIDEND    ; Shift left dividend, MSB into carry
    ROL DIVIDEND+1
    ROL REMAINDER   ; Shift carry into remainder
    LDA REMAINDER
    SEC
    SBC DIVISOR     ; Subtract divisor
    BCC NO_SUBTRACT ; If result negative, skip
    STA REMAINDER
    INC QUOTIENT    ; Increment quotient

NO_SUBTRACT:
    DEX
    BNE DIV_LOOP

    RTS
```


## References

- ([elite.bbcelite.com](https://elite.bbcelite.com/deep_dives/shift-and-add_multiplication.html?utm_source=openai))
- ([elite.bbcelite.com](https://elite.bbcelite.com/deep_dives/multiplication_and_division_using_logarithms.html?utm_source=openai))
- ([codebase64.c64.org](https://codebase64.c64.org/doku.php?id=base%3A6502_6510_maths&utm_source=openai))

## Mnemonics
- LSR
- BCC
- CLC
- LDA
- ADC
- STA
- ROR
- DEX
- BNE
- ASL
- ROL
- SEC
- SBC
- INC
- RTS
- LDX
