# MULSHF ($B983)

**Summary:** MULSHF at $B983 is a shift routine utilized within the Commodore 64 BASIC ROM's floating-point arithmetic operations, particularly in multiplication and division processes. It handles bit-shift operations essential for floating-point normalization and adjustment.

**Description**

MULSHF is invoked during floating-point multiplication and division to perform bit-shift operations necessary for aligning mantissas and normalizing results. The routine is shared between multiplication and addition operations, where it adjusts the exponent and shifts the mantissa accordingly.

## Source Code

```assembly
; MULSHF - Shift Routine
; Address: $B983

MULSHF:
    A2 25       LDX #$25
    B4 04       LDY $04,X
    84 70       STY $70
    B4 03       LDY $03,X
    94 04       STY $04,X
    B4 02       LDY $02,X
    94 03       STY $03,X
    B4 01       LDY $01,X
    94 02       STY $02,X
    A4 68       LDY $68
    94 01       STY $01,X
    69 08       ADC #$08
    90 0E       BCC $B946
    E6 61       INC $61
    F0 42       BEQ $B97E
    66 62       ROR $62
    66 63       ROR $63
    66 64       ROR $64
    66 65       ROR $65
    66 70       ROR $70
    60          RTS
```

## Key Registers

- **$62-$65**: Floating-point accumulator (FAC) mantissa bytes.
- **$61**: Floating-point accumulator exponent.
- **$70**: Temporary storage for overflow bits during shifts.

## References

- "fmultiplication_internals" — expands on shift operations used by FMULT and other multiplication internals.