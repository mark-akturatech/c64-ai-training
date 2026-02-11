# Sprite line -> 3 bytes (24 bits) — bit-to-decimal mapping

**Summary:** Each C64 hardware sprite line is 24 dots wide (24 bits) and stored as 3 bytes; convert each 8-bit group by summing bit weights (128..1) to get the decimal byte values. Examples: 00000000 01111110 00000000 → 0,126,0 and 00011111 11111111 11111000 → 31,255,248 (source shows 21 for the first byte — see note).

## Explanation
- A single sprite scanline on the VIC-II is 24 pixels (dots) wide, which requires 24 bits = 3 bytes of memory per line.
- The 24 bits are stored as three consecutive bytes, left-to-right. Within each byte the MSB corresponds to the leftmost dot of that byte (MSB = bit value 128).
- To convert an 8-bit pattern to its stored byte value, add the weights of the bits set to 1: 128, 64, 32, 16, 8, 4, 2, 1.
- Visible pixel count for a line is simply the count of bits set to 1 across the three bytes.
- Example behavior:
  - 00000000 01111110 00000000: first and third bytes are zero (no pixels); the middle byte has bits 6..1 set giving 64+32+16+8+4+2 = 126 → stored as 0,126,0.
  - 00011111 11111111 11111000: bit counts per byte are 5, 8, 5 respectively → 5+8+5 = 18 visible pixels across the 24-dot line.
- **[Note: Source may contain an error — the source lists the first byte of the second example as "21", but 00011111 = 16+8+4+2+1 = 31, not 21. The correct triple is 31,255,248.]**

## Source Code
```text
# Bit-pattern examples (24 bits -> 3 bytes)

00000000 01111110 00000000  =  0, 126, 0
  middle byte 01111110 = 64 + 32 + 16 + 8 + 4 + 2 = 126

00011111 11111111 11111000  =  31, 255, 248
  first byte  00011111 = 16 + 8 + 4 + 2 + 1 = 31   (source shows "21" here — likely an error)
  second byte 11111111 = 128+64+32+16+8+4+2+1 = 255
  third byte  11111000 = 128+64+32+16+8 = 248

# Byte bit-weight reference (bit7 .. bit0)
bit positions: 7 6 5 4 3 2 1 0
weights:      128 64 32 16 8 4 2 1

# Visible pixels per line = count of '1' bits across all 24 bits
Examples:
  00000000 01111110 00000000  -> 0 + 6 + 0 = 6 visible pixels
  00011111 11111111 11111000  -> 5 + 8 + 5 = 18 visible pixels
```

## References
- "sprite_shape_data_format" — expands on bit weight explanation
- "sprite_cross_example" — expands on multi-line example showing a cross drawn with sprite bytes
