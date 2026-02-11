# FAC1 (Floating Point Accumulator #1) — $61-$66 layout

**Summary:** FAC1 layout: FACEXP ($61) holds exponent with bias 129 (128 = zero); FACHO ($62-$65) is a four‑byte normalized mantissa (MSB implied 1), with $62-$63 also used to store a signed integer result (high/low); FACSGN ($66) is the sign byte (0 = +, $FF = −).

## Floating Point Accumulator #1 layout
FAC1 is split into three parts:

- FACEXP ($61): exponent stored with a bias of 129. Value 128 denotes the value zero. Exponent interpretation:
  - 128 = 0 (special zero)
  - 129 = 2^0 = 1
  - 130 = 2^1 = 2
  - 131 = 2^2 = 4
  - 132 = 2^3 = 8
  - (and so on; exponent value N represents 2^(N-129) for nonzero values)

- FACHO ($62-$65): four‑byte normalized mantissa. The stored mantissa range for normalized numbers is 1.00000... to 1.99999... (MSB is assumed 1 and not stored explicitly). The mantissa occupies 32 bits; the documentation states the first bit is used for the sign of the number and the remaining 31 bits hold the fractional/significant digits. The first two bytes ($62 = high, $63 = low) are also used to hold the signed integer result (high byte, low byte) when a floating‑point → integer conversion occurs.

- FACSGN ($66): sign byte. 0 indicates a positive number, $FF (255) indicates a negative number.

The accumulator therefore encodes a value as:
  sign (FACSGN), exponent biased by +129 (FACEXP), and a normalized 4‑byte mantissa (FACHO) with an implied leading 1 for normalized values.

## Source Code
```text
Decimal  Hex   Name    Description
97       $61   FACEXP  Floating Point Accumulator #1: Exponent
                   - Stored with bias of 129
                   - 128 = zero; 129 = 2^0 = 1; 130 = 2^1 = 2; etc.

98-101   $62-$65 FACHO Floating Point Accumulator #1: Mantissa
                   - Four-byte normalized mantissa (32 bits)
                   - MSB assumed to be 1 for normalized numbers (range 1.0-1.9999...)
                   - "First bit used for sign; other 31 bits hold significant digits" (per source)
                   - First two bytes ($62 high, $63 low) also used as signed integer result (high/low) after FP→INT conversion

102      $66   FACSGN  Floating Point Accumulator #1: Sign
                   - 0 = positive
                   - $FF = negative

Example exponent mapping (biased):
  FACEXP = $80 (128) -> value = 0 (zero)
  FACEXP = $81 (129) -> 2^(129-129) = 2^0 = 1
  FACEXP = $82 (130) -> 2^(130-129) = 2^1 = 2
  FACEXP = $83 (131) -> 2^(131-129) = 2^2 = 4
  FACEXP = $84 (132) -> 2^(132-129) = 2^3 = 8
```

## Key Registers
- $0061-$0066 - Floating Point Accumulator #1 (FAC1) - FACEXP ($61), FACHO ($62-$65), FACSGN ($66)

## References
- "fac1_accumulator_overview" — FAC1 purpose and floating-point format summary
- "facov_rounding_overflow_byte" — handling of extra low-order mantissa bytes used in rounding

## Labels
- FAC1
- FACEXP
- FACHO
- FACSGN
