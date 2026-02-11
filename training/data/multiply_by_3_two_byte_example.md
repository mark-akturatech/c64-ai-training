# Multiply two-byte value by 3 (2x + x) — 6502 assembly

**Summary:** Two-byte (16-bit) multiplication by 3 using the identity 3*x = 2*x + x. Uses ASL/ROL to form 2*NUM into RESULT low/high, then ADC to add original NUM into RESULT (instructions: ASL, ROL, ADC; two-byte carry propagation).

## Description
This routine computes RESULT = 3 * NUM where NUM is a two-byte little-endian value at NUM (low) / NUM+1 (high) and RESULT is a separate two-byte destination at RESULT / RESULT+1.

Algorithm:
- Compute 2*NUM by left-shifting the two-byte value: ASL low byte produces low result and carry into C, then ROL high byte incorporates that carry to produce the high result.
- Clear carry (CLC) and add the original two-byte NUM to the 2*NUM result using ADC on low then high bytes. ADC propagates any carry from low to high, producing the correct 16-bit sum (3*NUM mod 65536).
- The routine preserves only the low 16 bits of the product; any overflow beyond 16 bits is discarded (no third byte stored).

Important implementation details:
- ASL shifts the accumulator left and places the shifted-out bit into the Carry flag; ROL uses that Carry as its input, so ASL (low) then ROL (high) yields a correct 16-bit left shift.
- CLC before ADC ensures the add of NUM to RESULT does not include a spurious carry.
- Order: compute 2*NUM into RESULT first, then add NUM into RESULT with ADC low then ADC high so that carries propagate correctly between bytes.

## Source Code
```asm
        ; NUM: two-byte input (NUM = low, NUM+1 = high)
        ; RESULT: two-byte output (RESULT = low, RESULT+1 = high)

        LDA NUM        ; Start: compute 2*NUM into RESULT
        ASL A
        STA RESULT
        LDA NUM+1
        ROL A
        STA RESULT+1

        CLC            ; Add original NUM to RESULT (2*NUM + NUM = 3*NUM)
        LDA NUM
        ADC RESULT
        STA RESULT
        LDA NUM+1
        ADC RESULT+1
        STA RESULT+1  ; RESULT = 3*NUM (low/high)
```

## References
- "multiply_by_non_power_of_two_strategy" — expands on Uses the 2x + x decomposition described in the strategy
- "binary_decomposition_of_constants_examples" — expands on Binary view of 3 (11b) explains why 2x + x is used

## Mnemonics
- ASL
- ROL
- ADC
- CLC
