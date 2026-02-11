# Multiplying by a Constant (6502)

**Summary:** 6502 constant multiplication by powers of two uses ASL/ROL shifts; single-byte multiply-by-2 is a single ASL, two-byte results use ASL on low then ROL on high (carry propagation). Techniques: ASL, ROL, multi-byte shift.

## Algorithm
Multiplying a binary integer by 2 is implemented with arithmetic/logic shifts: ASL shifts the low byte left and places bit 7 into the processor carry. For multi-byte values, propagate that carry into the next (higher) byte with ROL.

- Single-byte result: shift the byte left once with ASL.
- Two-byte result: ASL the low byte, then ROL the high byte to incorporate the carry from the low byte.
- Wider (multi-byte) numbers extend by repeating ASL on each byte from low to high and ROL on each higher byte to receive carries.

(ROL on the high byte incorporates the carry from the low byte.)

## Source Code
```asm
; Single-byte multiply by 2
        ASL NUM       ; NUM = NUM * 2  (carry contains overflow)

; Two-byte multiply by 2 (NUM = low byte, NUM+1 = high byte)
        ASL NUM       ; shift low byte, bit7 -> carry
        ROL NUM+1     ; rotate-in carry into high byte
```

## References
- "multiply_by_powers_of_two_repeated_shifts" — expands on repeated ASL/ROL to multiply by 4, 8, 16, etc.
- "multiply_by_non_power_of_two_strategy" — strategy for constants not powers of two (use sums of powers of two)

## Mnemonics
- ASL
- ROL
