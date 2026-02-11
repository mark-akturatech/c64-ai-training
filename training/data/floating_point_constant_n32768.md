# N32768 ($B1A5)

**Summary:** Five-byte floating-point constant for -32768 stored at $B1A5; used for range checking when converting floating-point numbers to signed 16-bit integers (minimum value -32768). Search terms: $B1A5, five-byte floating point, -32768, range checking, AYINT.

**Description**

Label/address: $B1A5 — symbol N32768.

This entry documents the constant −32768 in the system's five-byte floating-point format. The constant is used for range checking during conversion of floating-point values to signed 16-bit integers (the minimum representable signed 16-bit value is −32768). The five-byte representation of -32768 in the Commodore 64's floating-point format is as follows:

- **Exponent Byte:** $9E (158 in decimal)
- **Mantissa Bytes:** $80, $00, $00, $00

In the Commodore 64's floating-point format:

- The **exponent** is stored in the first byte with a bias of 129. Therefore, an exponent byte of $9E corresponds to an actual exponent of 158 - 129 = 29.
- The **mantissa** is stored in the next four bytes in big-endian order, representing a normalized binary fraction.

For -32768:

- The binary representation of 32768 is 1000000000000000.
- Normalizing this to fit the floating-point format, we get 1.000000000000000 × 2^15.
- The exponent is 15 + 129 = 144 ($90 in hexadecimal).
- The mantissa, after normalization, is $80, $00, $00, $00.

However, since the number is negative, the sign bit (the most significant bit of the first mantissa byte) is set, resulting in $80 for the first mantissa byte.

Thus, the five-byte sequence stored at $B1A5 is:

- $9E, $80, $00, $00, $00

This sequence is used by the AYINT routine for range checking during the conversion of floating-point numbers to signed 16-bit integers.

## Source Code

```assembly
; Five-byte floating-point representation of -32768
N32768:
    .byte $9E, $80, $00, $00, $00
```

## Key Registers

- **$B1A5**: Address of the floating-point constant -32768.

## References

- "ayint_fp_to_signed_integer" — expands on usage by AYINT for range checking during conversion.
- "intidx_subscript_conversion" — relevant to converting subscripts to integer values (positive-range checking).