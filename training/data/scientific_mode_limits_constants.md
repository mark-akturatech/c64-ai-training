# Scientific-notation threshold constants in C64 ROM (BASIC FP constants)

**Summary:** Three 5-byte Commodore BASIC floating-point constants at $BDB3, $BDB8 and $BDBD are used by the ROM routine that chooses fixed vs. scientific notation (see "choose_notation_and_scale_fac1_to_get_digit_count") by comparing FAC1 against these thresholds.

## Purpose and usage
These constants are threshold values used by the BASIC/ROM routine that decides whether to print numbers in fixed (decimal) form or in scientific notation. The routine compares the current floating-point accumulator FAC1 against these three stored constants to decide:
- the largest value that may still be printed with at least one decimal digit,
- the largest value before switching to scientific notation, and
- the 1,000,000,000 boundary.

The values are stored as Commodore BASIC 5-byte floating-point numbers (1 exponent byte + 4 mantissa bytes). The code compares FAC1 against these constants (in ROM) to select formatting mode and scaling; see the referenced routine name for the comparison sequence and further context.

## Source Code
```text
; limits for scientific mode (5-byte BASIC floats)
$BDB3:  9B 3E BC 1F FD    ->  99,999,999.90625   (maximum value with at least one decimal)
$BDB8:  9E 6E 6B 27 FD    ->  999,999,999.25     (maximum value before scientific notation)
$BDBD:  9E 6E 6B 28 00    ->  1,000,000,000      (exact billion boundary)
```

## References
- "choose_notation_and_scale_fac1_to_get_digit_count" — routine that compares FAC1 against these constants and selects fixed vs scientific notation
