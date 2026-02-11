# Nibble mapping: hexadecimal 9 (4-bit binary 1001)

**Summary:** Shows the 4-bit (nibble) binary pattern for hexadecimal 9 (binary 1001), the bit-weight breakdown (8/4/2/1), and the resulting decimal and hex representation (decimal 9, hex $9 / 0x9).

## Mapping
A nibble has four bit positions (MSB → LSB): b3 b2 b1 b0 with weights 8, 4, 2, 1 respectively.  
Hexadecimal 9 is represented by the binary nibble 1 0 0 1:

- b3 = 1 → weight 8 → contribution 8
- b2 = 0 → weight 4 → contribution 0
- b1 = 0 → weight 2 → contribution 0
- b0 = 1 → weight 1 → contribution 1

Sum of contributions: 8 + 0 + 0 + 1 = 9 (decimal) → 9 decimal = hex 9 (notation: $9 or 0x9).

## Source Code
```text
Nibble:      b3 b2 b1 b0
Bit values:   1  0  0  1

Bit-weight  b3  b2  b1  b0
(8,4,2,1)    8  4  2  1

Contrib:     8  0  0  1
Decimal sum: 8 + 0 + 0 + 1 = 9
Hex:         9  (0x9, $9)

Compact table:
Binary   | b3 b2 b1 b0 | Weights (8/4/2/1) | Contributions | Decimal | Hex
-----------------------------------------------------------------------
1001     | 1  0  0  1  | 8 / 4 / 2 / 1     | 8 / 0 / 0 / 1 | 9       | $9
```

## References
- "nibble_mapping_hex_8" — mapping for hex 8
- "nibble_mapping_hex_a" — mapping for hex A
- "nibble_mapping_hex_b" — mapping for hex B
- "nibble_mapping_hex_c" — mapping for hex C
- "nibble_mapping_hex_d" — mapping for hex D
- "nibble_mapping_hex_e" — mapping for hex E
- "nibble_mapping_hex_f" — mapping for hex F
