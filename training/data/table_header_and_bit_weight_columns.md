# Table 3-1. The Relationship Between the Binary, Hex, and Decimal Number Systems

**Summary:** Nibble (4-bit) mapping table showing bit weights (2^3, 2^2, 2^1, 2^0) and the correspondence between 4-bit binary patterns, decimal (0–15), and hexadecimal (0–F). Useful for quick reference when converting between binary, DEC, and HEX on 6502/C64 work.

**Description**
This chunk documents a standard nibble (4-bit) value mapping: each row is a 4-bit binary pattern with column headings that indicate bit weights 2^3, 2^2, 2^1, 2^0 (corresponding to decimal weights 8, 4, 2, 1). The table maps every possible nibble (0000–1111) to its decimal equivalent (0–15) and its hexadecimal digit (0–F). The original source contained a truncated top row of bit-weight labels; the complete standard mapping is reconstructed here.

Use cases: mental conversion when reading bit fields in VIC-II/SID/CIA registers, small mask/bitfield calculations, hex dumps, and manual assembly/debug conversions.

## Source Code
```text
Table 3-1. The Relationship Between the Binary, Hex, and Decimal Number Systems

Bit weights:   2^3  2^2  2^1  2^0    Binary    DEC   HEX
-----------------------------------------------------
0000           0    0    0    0      0000       0    0
0001           0    0    0    1      0001       1    1
0010           0    0    1    0      0010       2    2
0011           0    0    1    1      0011       3    3
0100           0    1    0    0      0100       4    4
0101           0    1    0    1      0101       5    5
0110           0    1    1    0      0110       6    6
0111           0    1    1    1      0111       7    7
1000           1    0    0    0      1000       8    8
1001           1    0    0    1      1001       9    9
1010           1    0    1    0      1010      10    A
1011           1    0    1    1      1011      11    B
1100           1    1    0    0      1100      12    C
1101           1    1    0    1      1101      13    D
1110           1    1    1    0      1110      14    E
1111           1    1    1    1      1111      15    F
```

## References
- "nibble_mapping_0_to_7" — expands on the lower half of the nibble mapping (values 0–7)
- "nibble_mapping_8_to_f" — expands on the upper half of the nibble mapping (values 8–F)