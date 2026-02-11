# Large cross — 21-line sprite shape data example

**Summary:** 21 lines (63 bytes, three bytes per row) showing 24-bit sprite shape rows for a large cross; lists bit patterns and the corresponding decimal values to store in the sprite shape data area (sprite graphics, shape bytes).

## Description
This example shows how 21 horizontal rows of sprite shape data (each row 24 bits wide = 3 bytes) would be stored to draw a large cross using hardware sprite graphics. Each line shows the 24-bit bit pattern at left and the three decimal byte values (three numbers) that represent those 24 bits, in the order presented.

- Total bytes: 21 lines × 3 bytes = 63 bytes.
- Intended target: the sprite shape data area (where sprite bitmap bytes are stored).

## Source Code
```text
000000000000000000000000 = 0, 0, 0
000000000000000000000000 = 0, 0, 0
000000000111111000000000 = 0, 126, 0
000000000111111000000000 = 0, 126, 0
000000000111111000000000 = 0, 126, 0
000000000111111000000000 = 0, 126, 0
000000000111111000000000 = 0, 126, 0
000000000111111000000000 = 0, 126, 0
000000000111111000000000 = 0, 126, 0
000111111111111111111000 = 21, 255, 248
000111111111111111111000 = 21, 255, 248
000111111111111111111000 = 21, 255, 248
000000000111111000000000 = 0, 126, 0
000000000111111000000000 = 0, 126, 0
000000000111111000000000 = 0, 126, 0
000000000111111000000000 = 0, 126, 0
000000000111111000000000 = 0, 126, 0
000000000111111000000000 = 0, 126, 0
000000000111111000000000 = 0, 126, 0
000000000000000000000000 = 0, 0, 0
000000000000000000000000 = 0,0,0
```

## References
- "sprite_shape_data_format" — expands on how those bytes are formed and arranged in the sprite shape data area
