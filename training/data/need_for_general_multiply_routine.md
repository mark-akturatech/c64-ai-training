# 6502 General Multiply (multiply-anything-by-anything)

**Summary:** Discusses the necessity of a general multiplication routine on the 6502 processor, which lacks a hardware multiply instruction. It outlines common software-based multiplication algorithms, provides assembly implementations for both 8-bit and multi-byte operands, addresses signed and unsigned operations, and includes performance considerations and test vectors. Keywords: 6502, multiplication, shift-and-add, Booth's algorithm, multiply-and-accumulate, assembly implementation, signed multiplication, unsigned multiplication, overflow handling, cycle count, optimization, test vectors.

**Description**

The MOS Technology 6502 microprocessor does not include a hardware instruction for multiplication. Consequently, performing multiplication requires implementing software routines. When neither operand is known at compile time, constant-based multiplication techniques (e.g., shifts and adds for fixed constants) are inapplicable. In such cases, a general multiplication routine is necessary to handle arbitrary multiplicands and multipliers at runtime, producing a full product. This can involve various operand sizes (e.g., 8×8→16-bit, 16×16→32-bit) and considerations for signed versus unsigned numbers.

### Multiplication Algorithms

Several algorithms can be employed to implement multiplication on the 6502:

- **Shift-and-Add Algorithm:** This method emulates the long multiplication process by iteratively shifting and adding. It examines each bit of the multiplier; if the bit is set, the multiplicand (shifted accordingly) is added to the result. This approach is straightforward and commonly used on processors without a hardware multiply instruction. ([elite.bbcelite.com](https://elite.bbcelite.com/deep_dives/shift-and-add_multiplication.html?utm_source=openai))

- **Booth's Algorithm:** Originally designed for signed multiplication, Booth's algorithm reduces the number of addition and subtraction operations by encoding the multiplier in a way that combines sequences of 1s. While more complex, it can be adapted for the 6502 to handle signed numbers efficiently.

- **Multiply-and-Accumulate Variants:** These methods involve accumulating partial products, which can be optimized for specific applications, such as digital signal processing. They are less common on the 6502 due to its limited instruction set and processing power.

### Assembly Implementations

Below are assembly implementations for unsigned 8-bit and 16-bit multiplications using the shift-and-add algorithm:

**8-bit × 8-bit Unsigned Multiplication (Result: 16-bit):**


**16-bit × 16-bit Unsigned Multiplication (Result: 32-bit):**


### Handling Signed vs. Unsigned Operands and Overflow Behavior

Handling signed multiplication requires additional steps:

1. **Determine Sign of Result:** XOR the signs of the operands to determine the sign of the result.
2. **Convert to Unsigned:** If operands are signed, convert them to their absolute values.
3. **Perform Unsigned Multiplication:** Use the unsigned multiplication routine.
4. **Apply Sign to Result:** If the result should be negative, negate it.

Overflow behavior must be carefully managed, especially when dealing with signed numbers, to ensure correct results and avoid unintended behavior.

### Calling Conventions and Input/Output Layout

For an 8×8→16-bit multiplication:

- **Inputs:**
  - `A`: Multiplicand
  - `X`: Multiplier

- **Outputs:**
  - `PRODUCT_LO`: Low byte of the product
  - `PRODUCT_HI`: High byte of the product

For a 16×16→32-bit multiplication:

- **Inputs:**
  - `MULTIPLICAND_LO` and `MULTIPLICAND_HI`: Low and high bytes of the multiplicand
  - `MULTIPLIER_LO` and `MULTIPLIER_HI`: Low and high bytes of the multiplier

- **Outputs:**
  - `PRODUCT_0` to `PRODUCT_3`: Bytes of the 32-bit product, from least to most significant

### Cycle Counts, Timing Analysis, and Optimization Notes

The performance of multiplication routines on the 6502 is critical due to its limited processing power. The shift-and-add algorithm's efficiency depends on the number of set bits in the multiplier. Optimizations may include:

- **Loop Unrolling:** Reducing loop overhead by manually expanding iterations.
- **Zero-Page Usage:** Utilizing zero-page memory for faster access.
- **Self-Modifying Code:** Modifying instructions at runtime to reduce instruction fetches.

Cycle counts vary based on the specific implementation and the values of the operands. Detailed cycle counting requires analyzing each instruction within the loop and considering the number of iterations.

### Test Vectors and Edge-Case Handling

Testing multiplication routines should include various cases:

- **Zero Operands:** Ensure multiplying by zero yields zero.
- **Maximum Values:** Test with maximum unsigned (e.g., 255 for 8-bit) and signed values (e.g., 127 and -128 for 8-bit).
- **Mixed Sign Combinations:** Verify correct results for all combinations of positive and negative operands.
- **Overflow Conditions:** Confirm that overflows are handled appropriately, especially for signed operations.

By implementing and thoroughly testing these routines, developers can perform reliable multiplication operations on the 6502 processor, despite its lack of native support for such operations.

## Source Code

```assembly
; Multiplies two 8-bit numbers (multiplicand in A, multiplier in X)
; Result: 16-bit product in memory locations PRODUCT_LO and PRODUCT_HI

        LDX #8              ; Set loop counter for 8 bits
        STZ PRODUCT_LO      ; Clear product low byte
        STZ PRODUCT_HI      ; Clear product high byte
MULT_LOOP:
        LSR MULTIPLIER      ; Shift right multiplier, LSB into carry
        BCC NO_ADD          ; If carry clear, skip addition
        CLC
        LDA PRODUCT_LO
        ADC MULTIPLICAND    ; Add multiplicand to product low byte
        STA PRODUCT_LO
        LDA PRODUCT_HI
        ADC #0              ; Add carry to product high byte
        STA PRODUCT_HI
NO_ADD:
        ASL MULTIPLICAND    ; Shift left multiplicand
        DEX
        BNE MULT_LOOP
        RTS
```

```assembly
; Multiplies two 16-bit numbers (multiplicand at MULTIPLICAND_LO/HI,
; multiplier at MULTIPLIER_LO/HI)
; Result: 32-bit product at PRODUCT_0 to PRODUCT_3

        LDX #16             ; Set loop counter for 16 bits
        STZ PRODUCT_0       ; Clear product bytes
        STZ PRODUCT_1
        STZ PRODUCT_2
        STZ PRODUCT_3
MULT_LOOP:
        LSR MULTIPLIER_HI   ; Shift right multiplier high byte
        ROR MULTIPLIER_LO   ; Shift right multiplier low byte
        BCC NO_ADD          ; If carry clear, skip addition
        CLC
        LDA PRODUCT_0
        ADC MULTIPLICAND_LO ; Add multiplicand low byte to product
        STA PRODUCT_0
        LDA PRODUCT_1
        ADC MULTIPLICAND_HI ; Add multiplicand high byte to product
        STA PRODUCT_1
        LDA PRODUCT_2
        ADC #0              ; Add carry to product high byte
        STA PRODUCT_2
        LDA PRODUCT_3
        ADC #0              ; Add carry to product high byte
        STA PRODUCT_3
NO_ADD:
        ASL MULTIPLICAND_LO ; Shift left multiplicand low byte
        ROL MULTIPLICAND_HI ; Shift left multiplicand high byte
        DEX
        BNE MULT_LOOP
        RTS
```


## References

- "Shift-and-add multiplication - Elite on the 6502" ([elite.bbcelite.com](https://elite.bbcelite.com/deep_dives/shift-and-add_multiplication.html?utm_source=openai))
- "Fast 6502 multiplication - Everything2.com" ([everything2.com](https://everything2.com/title/Fast%2B6502%2Bmultiplication?utm_source=openai))
- "6502 Algorithms - NESdev Wiki" ([nesdev.org](https://www.nesdev.org/obelisk-6502-guide/algorithms.html?utm_source=openai))
- "6502 asm - Many ways to multiply" ([blog.sugoi.be](https://blog.sugoi.be/posts/2024/mos-6502-asm-many-ways-multiply/?utm_source=openai))
- "Mastering the Add and Shift Multiplication Algorithm in 6502 Assembly - YouTube" ([youtube.com](https://www.youtube.com/watch?v=ZQwLb0tkAdU&utm_source=openai))