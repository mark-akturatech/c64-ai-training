# 6502 one-byte unsigned multiply (schoolbook / binary algorithm)

**Summary:** One-byte unsigned multiplication routine for 6502 using a bit-by-bit (schoolbook/binary) method. Uses LDA, LDX, LSR, BCC, CLC, ADC, ROR, DEX, BNE, STA to multiply NUM1 * NUM2 producing a two-byte RESULT (low byte at RESULT, high byte at RESULT+1).

**Description**
This routine multiplies two unsigned 8-bit values (NUM1 × NUM2) using repeated-add-and-shift. It tests the low bit of NUM2 each loop: if the bit is 1, it adds NUM1 into the accumulator; then it "stairsteps" the running two-byte result right by one bit, capturing carries between the accumulator and the RESULT memory byte so that added values are effectively shifted left relative to the accumulating result. After 8 iterations the accumulator contains the high result byte and RESULT contains the low byte.

Key mechanics:
- LSR NUM2 shifts NUM2 right, placing its previous bit0 into Carry (C).
- BCC skips the add when that bit was 0; otherwise ADC NUM1 (with CLC) adds the multiplicand into A.
- ROR A shifts the accumulator right through Carry, moving the add result carry into Carry.
- ROR RESULT shifts the low result byte right through that Carry, propagating bits toward the low/high boundary.
- Loop runs 8 times via DEX/BNE to cover all bits of an 8-bit multiplier.
- Final STA RESULT+1 stores the accumulator (high byte) into RESULT+1.

Result sizing: multiplying two 1-byte numbers yields a 2-byte result. General rule: bytes_in_result = bytes_in_operand1 + bytes_in_operand2 (so two 2-byte operands produce a 4-byte result).

## Source Code
```asm
        ; Multiply unsigned 8-bit NUM1 by 8-bit NUM2 -> 16-bit RESULT (RESULT low byte, RESULT+1 high byte)
        LDA #0        ; Initialize A=0
        STA RESULT    ; Initialize RESULT low byte to 0
        LDX #8        ; There are 8 bits in NUM2
L1      LSR NUM2      ; Get low bit of NUM2 -> shifted into Carry
        BCC L2        ; If Carry=0, skip add
        CLC           ; If 1, add NUM1 into A
        ADC NUM1
L2      ROR A         ; Stairstep shift: rotate A right through Carry
        ROR RESULT    ; Rotate RESULT right through Carry (propagate carry between A and RESULT)
        DEX
        BNE L1
        STA RESULT+1  ; Store A as RESULT high byte
```

## References
- "binary_multiplication_algorithm" — algorithmic origin and explanation of the binary (schoolbook) multiply method  
- "two_byte_multiplication_routine" — extension to multi-byte operands and producing larger results (e.g., 4-byte result from two 2-byte operands)