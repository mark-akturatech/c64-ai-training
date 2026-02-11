# Nibble Mapping for Hexadecimal C (0xC)

**Summary:** This document details the 4-bit nibble representation for the hexadecimal value C (decimal 12), illustrating the bit-weight combinations (8, 4, 2, 1) that yield this value.

**Description**

A 4-bit nibble consists of bit positions b3, b2, b1, and b0, with corresponding weights of 8, 4, 2, and 1, respectively (b3 being the most significant bit). The hexadecimal digit C corresponds to the decimal value 12, achieved by setting the bits with weights 8 and 4, while clearing the bits with weights 2 and 1.

- **Bit weights:** b3 = 8, b2 = 4, b1 = 2, b0 = 1
- **Pattern for 0xC:** b3 = 1, b2 = 1, b1 = 0, b0 = 0 → 8 + 4 + 0 + 0 = 12 (decimal) → 0xC (hex)

This mapping is specific to the nibble pattern for hexadecimal C.

## Source Code

```text
; Nibble -> bit weights -> decimal -> hex
; Bit positions:  b3 b2 b1 b0   Weights: 8 4 2 1
1100 -> 1 1 0 0  -> 8 + 4 + 0 + 0 = 12  -> 0xC

; Full explicit row:
Pattern  Binary   b3 b2 b1 b0   Calculation       Decimal Hex
C        1100     1  1  0  0     8 + 4 + 0 + 0    12      0xC
```

## References

- "nibble_mapping_hex_8" — mapping for hex 8
- "nibble_mapping_hex_9" — mapping for hex 9
- "nibble_mapping_hex_a" — mapping for hex A
- "nibble_mapping_hex_b" — mapping for hex B
- "nibble_mapping_hex_d" — mapping for hex D
- "nibble_mapping_hex_e" — mapping for hex E
- "nibble_mapping_hex_f" — mapping for hex F