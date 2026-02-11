# Hexadecimal Notation (nibbles, $ prefix)

**Summary:** Hexadecimal (hex) is a human-friendly compact representation of binary by grouping bits into nibbles (4 bits). Uses $ prefix for hex (e.g. $12AC) and % prefix for binary (e.g. %01011011), with each nibble mapped to 0–F.

## Hexadecimal Notation
Binary is grouped four bits at a time (a nibble) and each nibble is represented by a single hex digit. Example grouping:

0001 0010 1010 1100 → hexadecimal digits 1 2 A C → $12AC

Nibble bit weights (from rightmost to leftmost within the nibble):
- bit 0 = 1
- bit 1 = 2
- bit 2 = 4
- bit 3 = 8

When the sum of weighted bits is greater than 9, alphabetic digits are used:
- A = 10, B = 11, C = 12, D = 13, E = 14, F = 15

Nibble-to-hex mapping:
0000 - 0     0100 - 4     1000 - 8     1100 - C
0001 - 1     0101 - 5     1001 - 9     1101 - D
0010 - 2     0110 - 6     1010 - A     1110 - E
0011 - 3     0111 - 7     1011 - B     1111 - F

Eight-bit values are written with two hex digits. Example:
%01011011 = $5B

The dollar sign ($) is commonly prefixed to hex numbers so they are easily recognized in code and documentation.

## References
- "hex_to_decimal" — algorithm to convert hex to decimal  
- "decimal_to_hexadecimal_methods" — methods to convert decimal to hex