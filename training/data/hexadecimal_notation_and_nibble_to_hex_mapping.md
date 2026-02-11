# Hexadecimal notation — nibbles and bytes

**Summary:** Hexadecimal (hex) notation: one hex digit = 4 bits (a nibble), two hex digits = 8 bits (a byte); see Table 3-1 for the full 4-bit binary → decimal → hex mapping.

**Hexadecimal notation**
Hex (base-16) is used because one hex digit compactly represents 16 values — exactly one nibble (4 bits). Any 8-bit value (one byte) is therefore represented by two hex digits. The complete correlation of every 4-bit binary pattern to its decimal and hex equivalents is provided in Table 3-1 (binary → decimal → hex mapping).

## Source Code
```text
Table 3-1: 4-bit Binary to Decimal and Hexadecimal Mapping

Binary | Decimal | Hexadecimal
-------|---------|------------
0000   | 0       | 0
0001   | 1       | 1
0010   | 2       | 2
0011   | 3       | 3
0100   | 4       | 4
0101   | 5       | 5
0110   | 6       | 6
0111   | 7       | 7
1000   | 8       | 8
1001   | 9       | 9
1010   | 10      | A
1011   | 11      | B
1100   | 12      | C
1101   | 13      | D
1110   | 14      | E
1111   | 15      | F
```

## References
- "table_3-1_binary_hex_decimal_mapping" — full mapping table for 4-bit binary to decimal and hex (Table 3-1)
- "hex_digit_letters_and_assembly_notation" — explains hex digit letters A–F and assembler notation conventions