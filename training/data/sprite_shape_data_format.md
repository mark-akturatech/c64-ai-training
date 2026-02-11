# How sprite shape bytes map to dots (C64 sprites)

**Summary:** Explanation of C64 sprite shape bytes: each byte (0–255) encodes eight horizontal dots using binary bit weights (bit0=1 ... bit7=128); three bytes = 24 dots per raster line; standard single-color sprite = 24×21 = 504 bits = 63 bytes.

## Mapping overview
Each sprite shape byte is an 8-bit value (0–255). Each bit represents one horizontal dot in that byte's 8-dot group: a bit value of 0 is the background color, a bit value of 1 is the sprite color. Bit positions are numbered 0–7 with binary weights that double each step (2^0..2^7).

Three consecutive bytes supply one 24-dot-wide raster line of a single-color sprite (3 × 8 = 24). Repeating that for the sprite height (commonly 21 raster lines on the C64 for the standard sprite size) yields the full sprite bitmap. The numeric value stored in memory for a byte is the sum of its set-bit weights.

Numeric value formula:
value = sum(bit_n * 2^n) for n = 0..7 (bit_n is 0 or 1)

Common derived size (standard single-color sprite):
24 dots/line × 21 lines = 504 bits = 63 bytes of shape data per sprite.

## Source Code
```text
Bit positions and weights (LSB = bit0):
 bit7 bit6 bit5 bit4 bit3 bit2 bit1 bit0
 128  64  32  16   8   4   2   1

Examples:
 0b00000000 = 0     -> all background (8 dots off)
 0b11111111 = 255   -> all sprite color (8 dots on)
 0b00000001 = 1     -> only bit0 set (one dot)
 0b10000000 = 128   -> only bit7 set (one dot)
 0b10000001 = 129   -> two dots (bit7 and bit0)
 0b00111100 = 60    -> four middle dots on

24-dot line example (three bytes form one raster line):
 Byte A (first 8 dots)  = 0b11110000 = 240
 Byte B (middle 8 dots) = 0b00001111 = 15
 Byte C (last 8 dots)   = 0b01010101 = 85
 These three bytes produce 24 horizontal dots for that line.

Note: This section contains the bit-weight table and representative byte examples for retrieval; it does not assert bit-to-screen horizontal ordering beyond grouping bytes into 8-dot segments (three bytes = 24 dots).
```

## References
- "sprite_overview_and_data_pointers" — where to place the 63 bytes in memory / pointers
- "sprite_line_examples" — examples mapping bit patterns to byte values and visible dot patterns