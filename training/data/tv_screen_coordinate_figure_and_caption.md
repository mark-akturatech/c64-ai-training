# Sprite positioning: TV screen X/Y coordinate grid (Figure 3-4)

**Summary:** ASCII TV-screen diagram showing the Commodore 64 sprite X (horizontal) and Y (vertical) coordinate grid; notes that a sprite must have both X and Y set to be displayed. Mentions BASIC POKE usage (POKE V for X, POKE V+1 for Y) and a related sprite bitmap memory range (832..894).

## Sprite coordinate grid
The display is represented as an X/Y coordinate grid: X is the horizontal axis, Y is the vertical axis. The included figure shows a sample sprite location on that grid and states explicitly that a sprite must have both its X-position (horizontal) and Y-position (vertical) set to appear on the screen.

This node is a visual reference (ASCII figure) illustrating sprite placement relative to the coordinate axes; detailed register addresses and bitmap memory layout are covered in the referenced chunks.

## Source Code
```text
                                  TV SCREEN
            +---------------------------------------------------+
            |        ^                                          |
            |        |                                          |
            |<-------+---- X POSITION = HORIZONTAL ------------>|
            |        |                                          |
            |        |                                          |
            |        |                                          |
            |        |                                          |
            |        |                                          |
            |        |                          +-+             |
            |        |                          | |             |
            |        |                          +-+             |
            |        |                          /               |
            |        |                         /                |
            |        |                        /                 |
            |        |                       /                  |
            +-------------------------------/-------------------+
                                           /
    A sprite located here must have both its X-position (horizontal) and
    Y-position (vertical) set so it can be displayed on the screen.

  Figure 3-4. The display screen is divided into a grid of X and Y coor-
  dinates.
```

## References
- "sprite_positioning_x_and_y_registers" — expands on visual aid and explains POKE V (X) and POKE V+1 (Y)
- "sprite_bitmap_memory_blocks_and_manual_editing" — expands on sprite bitmap memory (832..894) and manual bitmap editing
