# round FAC1 (ROM $BC1B-$BC28)

**Summary:** Checks FAC1 exponent ($61), shifts FAC1 rounding byte ($70) with ASL to detect carry/overflow, calls the FAC1 mantissa increment routine ($B96F) if rounding carry occurred, and jumps to normalise/return ($B938) when the increment overflows; relevant opcodes: ASL, BCC, JSR, BNE, JMP.

## Description
This ROM fragment implements rounding for the FAC1 floating-point accumulator. Behavior, step-by-step:

- LDA $61 (at $BC1B) loads FAC1 exponent. If the exponent is zero (BEQ $BC1A), rounding is skipped — FAC1 is zero so no rounding needed.
- ASL $70 (at $BC1F) shifts the FAC1 rounding byte left one bit. The ASL sets the processor Carry flag to the bit shifted out; that carry indicates whether rounding requires incrementing the mantissa.
- BCC $BC1A (at $BC21) tests the carry from the ASL. If Carry is clear (no overflow from the rounding byte), the routine exits without incrementing the mantissa.
- If Carry is set, the code JSR $B96F (at $BC23) to call the FAC1 mantissa increment routine.
  - The increment routine signals whether an increment overflowed by setting the Zero flag appropriately: the following BNE $BC1A (at $BC26) branches if no overflow (Z=0), exiting normally.
  - If the increment overflowed (Z=1), execution falls through to JMP $B938 (at $BC28) which normalises FAC1 for C=1 and returns.
- Addresses and control flow:
  - Entry: $BC1B
  - Exit on exponent zero or no rounding: branches to $BC1A
  - Mantissa increment routine: $B96F
  - Normalise-on-overflow handler: $B938

This fragment relies on standard 6502 flag behavior:
- ASL sets Carry = bit shifted out (used to detect rounding carry).
- BCC branches when Carry=0 (no rounding carry).
- The called increment routine uses the Zero flag so BNE indicates "no overflow" and fall-through indicates "overflow".

## Source Code
```asm
.,BC1B A5 61    LDA $61         get FAC1 exponent
.,BC1D F0 FB    BEQ $BC1A       exit if zero
.,BC1F 06 70    ASL $70         shift FAC1 rounding byte
.,BC21 90 F7    BCC $BC1A       exit if no overflow
                                round FAC1 (no check)
.,BC23 20 6F B9 JSR $B96F       increment FAC1 mantissa
.,BC26 D0 F2    BNE $BC1A       branch if no overflow
.,BC28 4C 38 B9 JMP $B938       nornalise FAC1 for C=1 and return
```

## References
- "save_a_as_integer_byte_and_prepare_fac1_for_abs" — prepares FAC1 mantissa/exponent for ABS/normalisation after sign handling
- "get_fac1_sign" — obtains FAC1 sign used by rounding/normalisation decisions
