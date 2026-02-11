# Hexadecimal to Decimal — multiply-then-add method (example: $12AC)

**Summary:** Algorithm to convert hexadecimal to decimal by iteratively multiplying the accumulated value by 16 and adding the next hex digit; includes hex-digit mapping (A=10…F=15) and a worked example converting $12AC. Speak hex digits individually (e.g. "one two A C"), not as a decimal phrase.

## Conversion algorithm
1. Read the leftmost hexadecimal digit. If it's a letter A–F, convert it to its numeric value (A=10, B=11, C=12, D=13, E=14, F=15).
2. If there are no more digits, the current value is the decimal result. Stop.
3. Multiply the current value by 16, add the numeric value of the next hex digit, and repeat from step 2.

Note: When reading hex aloud, say each digit separately (for $12AC say "one two A C") to avoid confusion with decimal pronunciations.

## Worked example: convert $12AC
- Start: leftmost digit = 1 → current value = 1.
- More digits remain.
- Multiply by 16: 1 × 16 = 16. Add next digit 2 → 16 + 2 = 18.
- More digits remain.
- Multiply by 16: 18 × 16 = 288. Add next digit A (10) → 288 + 10 = 298.
- More digits remain.
- Multiply by 16: 298 × 16 = 4768. Add next digit C (12) → 4768 + 12 = 4780.
- No more digits: decimal value = 4780.

## References
- "hexadecimal_notation" — expands on hex digit grouping and notation
- "decimal_to_hexadecimal_methods" — covers inverse conversion techniques (decimal → hex)
