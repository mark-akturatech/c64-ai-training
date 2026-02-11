# Nibble Mapping — Hex 8 (Upper-Nibble Table)

**Summary:** This section provides a 4-bit pattern mapping for the hexadecimal value 8 (0x8), illustrating the binary bit-weight columns (8, 4, 2, 1) and the combinations that yield the decimal/hex value 8. The original table rows from the upper half of a nibble map are included for reference.

**Bit-Weight Mapping**

Hexadecimal 8 (0x8) corresponds to the 4-bit binary pattern 1000, with bit weights as follows:

- Bit 3 (MSB): 8
- Bit 2: 4
- Bit 1: 2
- Bit 0 (LSB): 1

In this pattern, only the most significant bit (MSB) is set, while the other three bits are clear.

## Source Code

The following table represents the original row/column content from the nibble map fragment for hex 8:

```text
Bit Weights: 8 4 2 1

4 0 0 0

4 0 0 0

10 1 0 0 0

1 0 0 0 1

5 0 1 0 1

5 0 1 0 1

1 1 0 0 0 1

6 0 1 1 0

6 0 1 1 0

1 1 0 0 0 1

1 0 0 0 1

7 0 1 1 1

7 0 1 1 1

10 1 0 0 0

B 1 0 1 1

8 1 0 0 0

1 0 0 0 1

1 0 0 0 1
```

In this table:

- The first row indicates the bit weights for each column.
- Subsequent rows represent various combinations of bit settings that result in the decimal value 8.
- Entries such as "10" and "B" are hexadecimal representations of decimal values.

## References

- "nibble_mapping_hex_9" — mapping for hex 9
- "nibble_mapping_hex_a" — mapping for hex A
- "nibble_mapping_hex_b" — mapping for hex B
- "nibble_mapping_hex_c" — mapping for hex C
- "nibble_mapping_hex_d" — mapping for hex D
- "nibble_mapping_hex_e" — mapping for hex E
- "nibble_mapping_hex_f" — mapping for hex F
