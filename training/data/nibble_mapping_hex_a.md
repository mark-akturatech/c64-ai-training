# Nibble Mapping for Hexadecimal A (0xA)

**Summary:** This section details the 4-bit binary representation of the hexadecimal digit A (0xA, equivalent to decimal 10), illustrating the bit positions, their respective weights (8, 4, 2, 1), individual bit contributions, and the combined decimal and hexadecimal values.

**Bit Contributions**

The hexadecimal digit A (0xA) corresponds to the 4-bit binary pattern 1010. Assigning standard bit weights from most significant bit (MSB) to least significant bit (LSB):

- **Bit 3 (Weight 8):** 1 → contributes 8
- **Bit 2 (Weight 4):** 0 → contributes 0
- **Bit 1 (Weight 2):** 1 → contributes 2
- **Bit 0 (Weight 1):** 0 → contributes 0

Summing these contributions:

8 (from Bit 3) + 0 (from Bit 2) + 2 (from Bit 1) + 0 (from Bit 0) = 10 (decimal) = 0xA (hexadecimal).

## Source Code

```text
Bit Position:   3    2    1    0
Bit Weight:     8    4    2    1
Bit Value:      1    0    1    0
Contribution:   8    0    2    0

Combined Decimal Value: 10
Combined Hexadecimal Value: 0xA
```

## References

- "nibble_mapping_hex_8" — mapping for hex 8
- "nibble_mapping_hex_9" — mapping for hex 9
- "nibble_mapping_hex_b" — mapping for hex B
- "nibble_mapping_hex_c" — mapping for hex C
- "nibble_mapping_hex_d" — mapping for hex D
- "nibble_mapping_hex_e" — mapping for hex E
- "nibble_mapping_hex_f" — mapping for hex F
