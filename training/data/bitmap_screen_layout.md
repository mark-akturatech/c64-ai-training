# C-64 Bitmap Memory Layout (charset-like vertical-chunk order)

**Summary:** Explains the C-64 bitmap memory ordering used by the VIC-II: bitmap bytes are arranged like charset character cells (vertical-chunk order) rather than a single linear pixel row; example base $2000 is used to show byte ordering which affects plotting and indexing.

## Bitmap ordering and consequences
- A C-64 bitmap is organized per 8-pixel-high character cell (as in the charset) rather than as a simple left-to-right linear pixel stream.
- The first bitmap byte (example address $2000) is the top-left byte of the screen. The next byte ($2001 in the example) is the byte directly below it (the next vertical scanline within the same 8-pixel character cell).
- Bytes continue downwards through that character cell for 8 bytes (one byte per scanline). After the 8th byte (the bottom scanline of that cell), the next byte belongs to the cell immediately to the right (the top scanline of that next 8-pixel-high cell).
- In layout terms: memory is ordered column-major within each 8-pixel cell, then advances across the 40 columns of the character grid; after filling 40 cells across, the next bytes continue on the next character-row down (the next group of 8 scanlines).
- Practical consequence: plotting single pixels or horizontal spans is non-linear in memory — a horizontal run of pixels may be spread across many non-contiguous bytes. Efficient bitmap effects and plotters must account for this vertical-chunk addressing scheme.

## Source Code
(omitted — no assembly/BASIC listings or register tables in the source)

## Key Registers
(omitted — this chunk documents bitmap layout, not specific C64 I/O registers)

## References
- "bitmap_graphics_koala_example" — practical example using Koala bitmap layout