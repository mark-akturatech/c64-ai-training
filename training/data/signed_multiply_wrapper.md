# Signed 8-bit × 8-bit → 16-bit Multiply Wrapper (6502)

**Summary:** This routine multiplies two signed 8-bit numbers (NUM1 and NUM2) to produce a 16-bit RESULT, utilizing an existing unsigned multiply routine (MUL1BYTE). It computes the result's sign, normalizes operands to positive values, performs the unsigned multiplication, and adjusts the result's sign accordingly.

**Description**

The routine follows these steps:

- **Compute sign:** `LDA NUM1; EOR NUM2` sets the processor's negative flag (N) based on the XOR of the sign bits. `PHP` saves the status register to preserve this sign information.

- **Normalize inputs to positive:** For each operand, if negative (`BPL` skips if positive), take the two's complement (`EOR #$FF; CLC; ADC #1`) and store back to the operand.

- **Call the unsigned multiplier:** `JSR MUL1BYTE` performs the unsigned multiplication, storing the 16-bit result in RESULT and RESULT+1.

- **Restore the saved status:** `PLP` restores the negative flag, indicating the sign of the final result.

- **Adjust result sign if necessary:** If the result should be negative (`BPL` skips if positive), negate the 16-bit RESULT using a subtract-from-zero sequence:

  - `LDA #0; SEC; SBC RESULT; STA RESULT`

  - `LDA #0; SBC RESULT+1; STA RESULT+1`

  This sequence performs two's-complement negation of the low and high bytes, respectively.

**Notes:**

- `MUL1BYTE` is expected to produce an unsigned 16-bit result stored in RESULT (low byte) and RESULT+1 (high byte).

- `PHP` and `PLP` push and pull the entire status register; only the negative flag is utilized here.

- The routine modifies NUM1 and NUM2 in place; the caller must account for this or preserve copies if necessary.

## Source Code

```asm
        LDA NUM1     ; Compute sign of result
        EOR NUM2
        PHP          ; Save it on the stack
        LDA NUM1     ; Is NUM1 negative?
        BPL T1
        EOR #$FF     ; If so, make it positive
        CLC
        ADC #1
        STA NUM1
T1      LDA NUM2     ; Is NUM2 negative?
        BPL T2
        EOR #$FF     ; If so, make it positive
        CLC
        ADC #1
        STA NUM2
T2      JSR MUL1BYTE ; Do the unsigned multiplication
        PLP          ; Get sign of result
        BPL T3
        LDA #0       ; If negative, negate result
        SEC
        SBC RESULT
        STA RESULT
        LDA #0
        SBC RESULT+1
        STA RESULT+1
T3      RTS          ; Return from subroutine
```

The `MUL1BYTE` routine performs an unsigned 8-bit by 8-bit multiplication, producing a 16-bit result. It uses a shift-and-add algorithm, iterating over each bit of the multiplier, adding the multiplicand to the result when the corresponding bit is set.

```asm
MUL1BYTE:
        LDA #0       ; Clear A and carry
        STA RESULT
        STA RESULT+1
        LDX #8       ; Set loop counter
MUL_LOOP:
        LSR NUM2     ; Shift right multiplier
        BCC SKIP_ADD ; If bit is 0, skip addition
        CLC
        LDA RESULT
        ADC NUM1
        STA RESULT
        LDA RESULT+1
        ADC #0
        STA RESULT+1
SKIP_ADD:
        ASL NUM1     ; Shift left multiplicand
        DEX
        BNE MUL_LOOP
        RTS
```

**Memory Labels:**

- `NUM1`: Address of the first signed 8-bit operand.

- `NUM2`: Address of the second signed 8-bit operand.

- `RESULT`: Address where the low byte of the 16-bit result is stored.

- `RESULT+1`: Address where the high byte of the 16-bit result is stored.

## References

- "one_byte_multiplication_routine" — expands on the unsigned MUL1BYTE routine

- "negation_methods" — expands on negation used for inputs and output

- "signed_division_conventions_wrapper" — analogous wrapper approach for division