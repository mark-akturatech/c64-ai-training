# 6502 Multiplication by Constants (shifts-and-adds)

**Summary:** Describes the shifts-and-adds method for multiplying by constants on the 6502: decompose the constant into a sum of powers of two, form each power-of-two product by shifting (repeated doubling), and add shifted results while using temporary memory for intermediate values.

**Method**

Multiplying by a constant that is not a power of two is done by expressing the constant as a sum of powers of two and adding the corresponding shifted copies of the multiplicand. Each power-of-two factor is produced by shifting (doubling) the value; the partial products are then summed. Temporary memory locations are generally required to hold the original value and/or intermediate results so they can be added together later.

Example statements from the source:

- 3 * x = 2 * x + x — multiply by two (shift) and add the original number; the original must be preserved in memory to perform the addition.
- More complex constants are composed similarly (for example, 10 * x can be formed from 8 * x + 2 * x by combining an 8-shift and a 2-shift).

Binary decomposition of the constant (reading the constant's binary bits) indicates which shifts are required: each set bit corresponds to a shifted copy that must be produced and summed.

## Source Code

```assembly
; Multiply a two-byte value by 3 using shifts and adds
; Input: 16-bit value at memory locations VALUE_LO and VALUE_HI
; Output: 16-bit result at RESULT_LO and RESULT_HI

    LDA VALUE_LO        ; Load low byte of VALUE into A
    STA TEMP_LO         ; Store it in TEMP_LO
    LDA VALUE_HI        ; Load high byte of VALUE into A
    STA TEMP_HI         ; Store it in TEMP_HI

    ASL TEMP_LO         ; Shift TEMP left (multiply by 2)
    ROL TEMP_HI         ; Rotate through carry to handle high byte

    CLC                 ; Clear carry before addition
    LDA TEMP_LO         ; Load shifted low byte
    ADC VALUE_LO        ; Add original low byte
    STA RESULT_LO       ; Store result low byte

    LDA TEMP_HI         ; Load shifted high byte
    ADC VALUE_HI        ; Add original high byte
    STA RESULT_HI       ; Store result high byte
```

```assembly
; Multiply a value by 10 using shifts and adds
; Input: 8-bit value in A
; Output: 8-bit result in A

    STA TEMP            ; Store original value in TEMP

    ASL A               ; Shift left (multiply by 2)
    ASL A               ; Shift left again (multiply by 4)
    ASL A               ; Shift left again (multiply by 8)

    CLC                 ; Clear carry before addition
    ADC TEMP            ; Add original value (8x + 1x = 9x)
    ADC TEMP            ; Add original value again (9x + 1x = 10x)
```

## References

- "multiply_by_3_two_byte_example" — Concrete two-byte example using 3x = 2x + x
- "multiply_by_10_example_using_shifts_and_adds" — Example composing 8x and 2x to form 10x
- "binary_decomposition_of_constants_examples" — How to read the binary representation of a constant to find required shifts