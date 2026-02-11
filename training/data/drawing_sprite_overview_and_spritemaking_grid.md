# Sprite-making grid (24×21 pixels; 63 bytes per sprite)

**Summary:** Describes the Commodore sprite grid: 24 pixels across × 21 pixels high = 504 pixels, stored as 63 bytes (3 groups of 8 columns per row). Uses the "coloring book" analogy and references the spritemaking grid figure (Figure 3-6).

**Sprite grid (24×21)**
Each sprite is a 24 × 21 pixel bitmap (504 pixels total). The common way to represent a sprite’s pixels for input into a program is to split each horizontal row of 24 pixels into three groups of 8 columns. Thus:
- 24 pixels per row = 3 × 8-pixel groups per row.
- 21 rows × 3 groups per row = 63 groups (bytes) total.

Each group is stored as one byte: one byte encodes eight horizontally adjacent pixels (one bit per pixel). Instead of entering 504 individual pixel values, you enter 63 numeric byte values (or let a program/utility generate those 63 bytes from a drawn grid). The original text uses the "coloring book" analogy: draw (color in) the tiny squares on the 24×21 grid, then convert each row’s three 8-column groups into the corresponding byte values.

The source text refers to this layout as Figure 3-6 (a blank spritemaking grid) to illustrate where to color pixels.

## Source Code
```text
+------------------------+
|                        |
|                        |
|                        |
|                        |
|                        |
|                        |
|                        |
|                        |
|                        |
|                        |
|                        |
|                        |
|                        |
|                        |
|                        |
|                        |
|                        |
|                        |
|                        |
|                        |
|                        |
+------------------------+
```
*Figure 3-6: Blank 24×21 sprite-making grid.*

## References
- "creating_sprite_step_by_step_instructions" — expands on step-by-step process for turning a drawn grid into DATA bytes (converting rows of 8 pixels into byte values).