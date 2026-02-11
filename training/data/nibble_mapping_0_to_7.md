# Nibble Mapping 0x0–0xF (Table 3-1)

**Summary:** Mapping of 4-bit binary patterns (nibbles) 0000–1111 to their decimal and hexadecimal equivalents, illustrating bit weights (8, 4, 2, 1) and how each nibble produces values 0–15 (0x0–0xF).

**Mapping and Bit-Weight Explanation**

A 4-bit nibble consists of bits b3, b2, b1, and b0, with bit weights 8, 4, 2, and 1 respectively. The decimal value of a nibble is the sum of the weights for bits set to 1. The following table shows each 4-bit pattern (MSB left), its decimal value, and the corresponding hexadecimal digit (0x0–0xF).

## Source Code

```text
Binary  b3 b2 b1 b0   Decimal   Hex
0000    0  0  0  0       0     0x0
0001    0  0  0  1       1     0x1
0010    0  0  1  0       2     0x2
0011    0  0  1  1       3     0x3
0100    0  1  0  0       4     0x4
0101    0  1  0  1       5     0x5
0110    0  1  1  0       6     0x6
0111    0  1  1  1       7     0x7
1000    1  0  0  0       8     0x8
1001    1  0  0  1       9     0x9
1010    1  0  1  0      10     0xA
1011    1  0  1  1      11     0xB
1100    1  1  0  0      12     0xC
1101    1  1  0  1      13     0xD
1110    1  1  1  0      14     0xE
1111    1  1  1  1      15     0xF
```

## References

- "table_header_and_bit-weight_columns" — expands on Table title and binary bit-weight headings used by these rows
- "nibble_mapping_8_to_f" — continuation: mapping for values 8–F (upper nibble)