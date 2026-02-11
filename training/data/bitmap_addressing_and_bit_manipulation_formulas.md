# C64 bitmap pixel address calculation (X,Y) -> byte/bit

**Summary:** Calculation for per-pixel addressing in C64 bitmap mode using coordinates (X,Y): ROW = INT(Y/8), CHAR = INT(X/8), LINE = Y AND 7, BIT = 7-(X AND 7); byte address BYTE = BASE + ROW*320 + CHAR*8 + LINE. Use POKE BYTE, PEEK(BYTE) OR 2^BIT to set a pixel (bitmap memory organized as 25×40 character blocks, 320 bytes per raster line).

## Explanation
This chunk describes how to locate and modify a single pixel on the C64 high-resolution (bitmap) screen by converting X,Y coordinates into the exact memory byte and bit.

- Coordinate system:
  - X runs left→right: 0..319 (320 pixels across).
  - Y runs top→bottom: 0..199 (200 pixels down).

- Logical organization:
  - The bitmap is formed from programmable 8×8 character blocks arranged in 25 rows × 40 columns.
  - Each character is 8 bytes (one byte per vertical line inside the 8-pixel-high character).
  - Each raster "line" of character rows contains 320 bytes (40 characters × 8 bytes).

- Intermediate values:
  - ROW = INT(Y/8) — which character-row (0..24) vertically.
  - CHAR = INT(X/8) — which character-column (0..39) horizontally.
  - LINE = Y AND 7 — which of the 8 byte-rows inside the character (0..7).
  - BIT = 7 - (X AND 7) — which bit in the byte corresponds to X (bit 7 is leftmost).

- Final byte address:
  - BYTE = BASE + ROW*320 + CHAR*8 + LINE
    - BASE is the start address of the display bitmap area (defined elsewhere/configurable).

- To set (turn ON) the pixel at (X,Y) without changing other bits in that byte:
  - POKE BYTE, PEEK(BYTE) OR 2^BIT
    - (This reads the current byte, ORs the mask for the target bit, and writes it back.)

Notes:
- The formulas use integer division for INT and bitwise AND for LINE and BIT extraction.
- This method preserves the other pixels in the same byte when setting a single pixel.

## Source Code
```text
Screen coordinate ranges:
  X = 0 .. 319
  Y = 0 .. 199

Memory organization (illustration):
----- BYTE 0   BYTE 8   BYTE 16    BYTE 24 ..................... BYTE 312
      BYTE 1   BYTE 9      .          .                          BYTE 313
      BYTE 2   BYTE 10     .          .                          BYTE 314
      BYTE 3   BYTE 11     .          .                          BYTE 315
      BYTE 4   BYTE 12     .          .                          BYTE 316
      BYTE 5   BYTE 13     .          .                          BYTE 317
      BYTE 6   BYTE 14     .          .                          BYTE 318
----- BYTE 7   BYTE 15     .          .                          BYTE 319

----- BYTE 320 BYTE 328 BYTE 336 BYTE 344....................... BYTE 632
      BYTE 321 BYTE 329    .          .                          BYTE 633
      BYTE 322 BYTE 330    .          .                          BYTE 634
      BYTE 323 BYTE 331    .          .                          BYTE 635
      BYTE 324 BYTE 332    .          .                          BYTE 636
      BYTE 325 BYTE 333    .          .                          BYTE 637
      BYTE 326 BYTE 334    .          .                          BYTE 638
----- BYTE 327 BYTE 335    .          .                          BYTE 639
```

```basic
' Formulas (BASIC-style notation shown in source)
ROW = INT(Y/8)
CHAR = INT(X/8)
LINE = Y AND 7
BIT = 7 - (X AND 7)
BYTE = BASE + ROW*320 + CHAR*8 + LINE

' To set a pixel:
POKE BYTE, PEEK(BYTE) OR 2^BIT
```

## References
- "bitmap_example_and_clearing_screen" — expands on BASE and clearing before plotting
- "sine_curve_bitmap_example" — example plotting using these formulas
