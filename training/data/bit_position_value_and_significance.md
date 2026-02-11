# Bit ordering, positional values, and the nibble

**Summary:** Defines bit ordering (LSB on the right, MSB on the left), the positional value rule 2^N for bit positions, how to compute a group's numeric value by summing ON bits, and the nibble maximum value (15). Searchable terms: LSB, MSB, 2^N, nibble, bit positions.

**Bit ordering and positional value**
- Bits in a group are arranged horizontally; the rightmost bit is the least significant bit (LSB) and the leftmost bit is the most significant bit (MSB).
- Each bit position has a positional value equal to 2^N, where N is the number of bit-steps from the LSB (N = 0 for the LSB).
  - Example: LSB has N = 0 → value = 2^0 = 1.
  - The next bit to the left has N = 1 → value = 2^1 = 2.
- To compute the numeric value of a group of bits, add the positional values for every bit whose state is ON (1).
  - Example (nibble, 4 bits): positional values are 1, 2, 4, 8. The maximum sum when all bits are ON is 1 + 2 + 4 + 8 = 15.
- This positional-value method scales to any bit-width (e.g., 8-bit byte uses 2^0 through 2^7).

## Source Code
```text
Bit positions and values for a 4-bit nibble:

Bit position:  3   2   1   0
Bit value:     8   4   2   1
```

## References
- "bits_grouping_and_nibble" — expands on grouping and the nibble concept
- "bytes_and_8-bit_machine" — applies positional-value idea to 8-bit bytes
