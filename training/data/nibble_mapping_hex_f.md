# Nibble Mapping — Hex 8 to F (Upper Nibble)

**Summary:** This section provides the 4-bit binary mappings for hexadecimal values 8 through F (decimal 8 to 15). Each hex value is represented in binary, with bit positions and their respective weights detailed, illustrating how the sum of these weights equals the decimal equivalent of the hex value.

**Mapping for Hex 8 to F**

| Hex | Decimal | 4-bit Binary | Bit Positions and Weights | Contribution Calculation |
|-----|---------|--------------|---------------------------|--------------------------|
| 8   | 8       | 1000         | bit3=8, bit2=0, bit1=0, bit0=0 | 8 + 0 + 0 + 0 = 8        |
| 9   | 9       | 1001         | bit3=8, bit2=0, bit1=0, bit0=1 | 8 + 0 + 0 + 1 = 9        |
| A   | 10      | 1010         | bit3=8, bit2=0, bit1=2, bit0=0 | 8 + 0 + 2 + 0 = 10       |
| B   | 11      | 1011         | bit3=8, bit2=0, bit1=2, bit0=1 | 8 + 0 + 2 + 1 = 11       |
| C   | 12      | 1100         | bit3=8, bit2=4, bit1=0, bit0=0 | 8 + 4 + 0 + 0 = 12       |
| D   | 13      | 1101         | bit3=8, bit2=4, bit1=0, bit0=1 | 8 + 4 + 0 + 1 = 13       |
| E   | 14      | 1110         | bit3=8, bit2=4, bit1=2, bit0=0 | 8 + 4 + 2 + 0 = 14       |
| F   | 15      | 1111         | bit3=8, bit2=4, bit1=2, bit0=1 | 8 + 4 + 2 + 1 = 15       |

Each row in the table above details the hexadecimal value, its decimal equivalent, the corresponding 4-bit binary representation, the bit positions with their respective weights, and the calculation showing how the sum of these weights equals the decimal value.

## Source Code

```text
+-----+---------+--------------+---------------------------+--------------------------+
| Hex | Decimal | 4-bit Binary | Bit Positions and Weights | Contribution Calculation |
+-----+---------+--------------+---------------------------+--------------------------+
| 8   | 8       | 1000         | bit3=8, bit2=0, bit1=0, bit0=0 | 8 + 0 + 0 + 0 = 8        |
| 9   | 9       | 1001         | bit3=8, bit2=0, bit1=0, bit0=1 | 8 + 0 + 0 + 1 = 9        |
| A   | 10      | 1010         | bit3=8, bit2=0, bit1=2, bit0=0 | 8 + 0 + 2 + 0 = 10       |
| B   | 11      | 1011         | bit3=8, bit2=0, bit1=2, bit0=1 | 8 + 0 + 2 + 1 = 11       |
| C   | 12      | 1100         | bit3=8, bit2=4, bit1=0, bit0=0 | 8 + 4 + 0 + 0 = 12       |
| D   | 13      | 1101         | bit3=8, bit2=4, bit1=0, bit0=1 | 8 + 4 + 0 + 1 = 13       |
| E   | 14      | 1110         | bit3=8, bit2=4, bit1=2, bit0=0 | 8 + 4 + 2 + 0 = 14       |
| F   | 15      | 1111         | bit3=8, bit2=4, bit1=2, bit0=1 | 8 + 4 + 2 + 1 = 15       |
+-----+---------+--------------+---------------------------+--------------------------+
```

## References

- "nibble_mapping_hex_8" — mapping details for hex 8
- "nibble_mapping_hex_9" — mapping details for hex 9
- "nibble_mapping_hex_a" — mapping details for hex A
- "nibble_mapping_hex_b" — mapping details for hex B
- "nibble_mapping_hex_c" — mapping details for hex C
- "nibble_mapping_hex_d" — mapping details for hex D
- "nibble_mapping_hex_e" — mapping details for hex E
- "nibble_mapping_hex_f" — mapping details for hex F