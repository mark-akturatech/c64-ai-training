# 6502 unsigned 16×16→32 multiplication (bit-serial add/rotate method)

**Summary:** Unsigned multiplication of two 16-bit operands producing a 32-bit RESULT using a bit-serial algorithm: extract NUM2 LSBs with LSR/ROR, conditionally add NUM1 into the high word of RESULT (ADC sequence), then "stairstep" ROR through A and the RESULT bytes to shift the 32-bit accumulator right; loop 16 times (LDX #16). Key mnemonics: LSR, ROR, ADC, CLC, TAY, TYA, DEX/BNE.

**Algorithm and implementation notes**
- **Purpose:** Multiply two 2-byte (16-bit) operands (NUM1, NUM2) to produce a 4-byte (32-bit) RESULT using a serial (bit-by-bit) method suitable for the 6502.
- **High-level flow:**
  1. **Initialize RESULT:** Zero all four bytes of RESULT to ensure no residual data affects the computation.
  2. **Loop 16 times:**
     - **Shift NUM2 right:** Extract the least significant bit (LSB) of NUM2 into the carry flag using LSR and ROR instructions.
     - **Conditional addition:** If the extracted bit is 1 (carry set), add NUM1 to the high half of RESULT.
     - **Right shift RESULT:** Perform a "stairstep" right-rotate through A and the RESULT bytes to shift the 32-bit RESULT right by one bit.
  3. **Store final A into RESULT+3:** After completing all iterations, store the final value of A into the most significant byte of RESULT.
- **Endianness and byte order:**
  - **NUM1 and NUM2:** Stored in little-endian format; the low byte is at the lower memory address, followed by the high byte.
  - **RESULT:** A 32-bit value stored in little-endian format across four consecutive bytes; RESULT (least significant byte) at the lowest address, followed by RESULT+1, RESULT+2, and RESULT+3 (most significant byte).
- **Register usage:**
  - **A (Accumulator):** Used for arithmetic operations and as part of the rotation chain.
  - **X:** Loop counter, initialized to 16 for the 16 bits of NUM2.
  - **Y:** Temporarily stores the value of A during the addition sequence to facilitate adding both bytes of NUM1.

## Source Code
```asm
        LDA #0        ; Initialize RESULT to 0
        STA RESULT
        STA RESULT+1
        STA RESULT+2
        STA RESULT+3
        LDX #16       ; There are 16 bits in NUM2
L1      LSR NUM2+1    ; Shift high byte of NUM2 (part of 16-bit right shift)
        ROR NUM2      ; Rotate low byte of NUM2 through carry -> carry = old LSB of 16-bit NUM2
        BCC L2        ; If extracted bit = 0, skip add
        TAY           ; Save A in Y (A will be used for add)
        CLC
        LDA NUM1
        ADC RESULT+2
        STA RESULT+2
        TYA
        ADC NUM1+1
L2      ROR A         ; "Stairstep" shift: rotate through A and RESULT bytes
        ROR RESULT+2
        ROR RESULT+1
        ROR RESULT
        DEX
        BNE L1
        STA RESULT+3
```

## Key Registers
- **A (Accumulator):** Used for arithmetic operations and as part of the rotation chain.
- **X:** Loop counter, initialized to 16 for the 16 bits of NUM2.
- **Y:** Temporarily stores the value of A during the addition sequence to facilitate adding both bytes of NUM1.

## References
- "one_byte_multiplication_routine" — one-byte variant and expansion notes
- "extending_multiplication_to_wider_numbers" — generalization to wider operands and wider RESULT
