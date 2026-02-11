# 6502 Multiplication and Division Algorithms — author note

**Summary:** This note discusses generalizing 6502 binary multiplication and division algorithms to handle operands wider than a single byte. It emphasizes adapting the core bit-shift and add/subtract algorithms to accommodate multi-byte operations, rather than creating numerous size-specific routines.

**Guidance**

Understanding the fundamental binary multiplication and division algorithms allows for straightforward extension to multi-byte operands. The core techniques involve:

- **Multiplication:** Utilizing a shift-and-add approach, where the multiplicand is shifted and added based on the bits of the multiplier. This method can be extended to multi-byte numbers by processing each byte sequentially and managing carries between bytes.

- **Division:** Employing a shift-and-subtract method, analogous to long division, where the divisor is subtracted from the dividend, and the result is shifted. For multi-byte division, this process is extended across additional bytes, handling borrows appropriately.

By studying these base algorithms, programmers can develop parameterized routines that handle operands of varying widths, avoiding the need for multiple fixed-width implementations.

## Source Code

Below is an example of a two-byte (16-bit) multiplication routine using the shift-and-add method:

```assembly
; 16-bit multiplication routine
; Multiplies two 16-bit numbers: multiplicand (MULT1) and multiplier (MULT2)
; Result is a 32-bit number stored in RESULT (low and high words)

MULT1   = $0200  ; Address of multiplicand (16-bit)
MULT2   = $0202  ; Address of multiplier (16-bit)
RESULT  = $0204  ; Address of result (32-bit)

        LDX #16          ; Set loop counter for 16 bits
        LDA #0
        STA RESULT       ; Clear RESULT low word
        STA RESULT+1     ; Clear RESULT high word
        STA RESULT+2     ; Clear RESULT+2 (for carry)
        STA RESULT+3     ; Clear RESULT+3 (for carry)

MULT_LOOP:
        LSR MULT2+1      ; Shift right high byte of MULT2
        ROR MULT2        ; Shift right low byte of MULT2
        BCC NO_ADD       ; If carry is clear, skip addition

        CLC
        LDA RESULT
        ADC MULT1
        STA RESULT
        LDA RESULT+1
        ADC MULT1+1
        STA RESULT+1
        LDA RESULT+2
        ADC #0
        STA RESULT+2
        LDA RESULT+3
        ADC #0
        STA RESULT+3

NO_ADD:
        ASL MULT1        ; Shift left low byte of MULT1
        ROL MULT1+1      ; Shift left high byte of MULT1
        DEX
        BNE MULT_LOOP

        ; RESULT now contains the 32-bit product
```

This routine multiplies two 16-bit numbers stored at `MULT1` and `MULT2`, producing a 32-bit result in `RESULT`. It uses the shift-and-add method, processing each bit of the multiplier and adding the multiplicand to the result when the corresponding bit is set.

## Key Registers

This routine primarily utilizes the following registers:

- **A (Accumulator):** Used for arithmetic operations.
- **X (Index Register X):** Serves as a loop counter.
- **Carry Flag (C):** Manages carries during addition and determines when to add the multiplicand based on the multiplier's bits.

## References

- "Shift-and-add multiplication - Elite on the 6502"
- "Multiplying and Dividing on the 6502"
- "6502 Assembly Language Subroutines" by Lance A. Levent