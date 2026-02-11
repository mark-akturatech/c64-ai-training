# Multicolor Text vs Multicolor Bitmap & Sprite Overview

**Summary:** Multicolor text and multicolor bitmap are VIC-II video modes that trade off horizontal resolution for additional colors. Sprites are an independent VIC-II graphics system with separate handling for positions, shapes, and colors.

**Multicolor Modes**

**Multicolor Text Mode:**

- Characters are displayed from the character ROM/CHARS memory but rendered in a multicolor pixel mode.
- Each character cell uses four colors total: three colors shared across all characters and one color selectable per character.

**Multicolor Bitmap Mode:**

- The bitmap screen offers four colors per cell.
- Within each 8×8-dot block, three of those colors can be selected individually per 8×8 area, allowing more local color choices than multicolor text.
- Tradeoff: both multicolor modes double the horizontal pixel width of each multicolor pixel (reducing horizontal resolution from 320 to 160 pixels) in exchange for the additional colors.

**Sprite System (Overview)**

- Sprites are a separate graphics system inside the VIC-II; their character shapes, colors, and screen positions are derived and displayed independently of the Video Matrix and Character Dot-Data addresses.
- Sprites can be moved and animated quickly to arbitrary screen positions, making them ideal for games and animated graphics.
- Each sprite is 24×21 pixels in size and can be displayed in single-color or multicolor mode.
- In single-color mode, each sprite pixel is 1 bit, allowing for a resolution of 24×21 pixels.
- In multicolor mode, each sprite pixel is 2 bits, reducing the horizontal resolution to 12×21 pixels but allowing for up to three colors plus transparency.
- Sprite data is stored in memory as 64 bytes per sprite, with each byte representing a row of 3 bytes (24 bits) for single-color mode or 3 bytes (12 pixels) for multicolor mode.
- Sprite pointers are located in the last 8 bytes of the screen memory and point to the sprite data blocks.
- Sprites can be expanded horizontally and/or vertically by setting the appropriate bits in the VIC-II registers.
- Each sprite has its own color register, and in multicolor mode, two additional shared color registers are used.

## Key Registers

- **$D016**: VIC-II Control Register 2
  - Bit 4 (MCM): Multicolor Mode Control Bit
    - 0: Standard character mode
    - 1: Multicolor character mode
  - Bits 0-2 (XSCROLL): Horizontal Fine Scroll
    - Controls the fine scrolling of the screen in the horizontal direction.

## References

- "sprite_overview_and_data_pointers" — expands on sprite shapes, sizes, pointers
- "scrolx_horizontal_fine_scrolling" — expands on multicolor bit lives in $D016 and horizontal fine-scrolling details

## Labels
- D016
