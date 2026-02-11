# Sprite Positioning Limits (Visible Ranges) — VIC-II Sprites

**Summary:** This document details the visible X and Y coordinate ranges for unexpanded and expanded sprites in the VIC-II's text modes (40×25, 38-column, 24-row). It references sprite position registers ($D000–$D02E) and the X Most Significant Bit (MSB) register. The information corrects previous inconsistencies and clarifies the formation of the 9-bit X coordinate.

**Sprite Positioning Limits**

The following tables outline the coordinate ranges within which sprites are at least partially visible on the screen. These ranges are based on the VIC-II's display characteristics and the sprite's expansion state.

**Unexpanded Sprites:**

- **40-column × 25-row mode:**
  - X: 24 ≤ X ≤ 343
  - Y: 50 ≤ Y ≤ 249

- **38-column mode:**
  - X: 31 ≤ X ≤ 334

- **24-row mode:**
  - Y: 54 ≤ Y ≤ 245

**Expanded Sprites:**

- **40-column × 25-row mode:**
  - X: 24 ≤ X ≤ 319
  - Y: 50 ≤ Y ≤ 228

- **38-column mode:**
  - X: 31 ≤ X ≤ 310

- **24-row mode:**
  - Y: 54 ≤ Y ≤ 224

**Notes:**

- The X coordinate is a 9-bit value, formed by combining the low byte from the sprite's X position register and the corresponding bit in the X MSB register. This allows for X positions ranging from 0 to 511.
- The Y coordinate is an 8-bit value, allowing for Y positions from 0 to 255.
- The ranges are inclusive at both endpoints, meaning the sprite is visible when its coordinates are within these bounds.

## Key Registers

- **$D000–$D00F:** Sprite X and Y position registers for sprites 0–7.
- **$D010:** Sprite X MSB register; each bit corresponds to the MSB of the X coordinate for sprites 0–7.

## References

- "Sprite Vertical Positioning Limits and Example" — expands on Y range values for expanded/unexpanded sprites.
- "Sprite Horizontal Positioning and X MSB Explanation" — expands on X range constraints and MSB handling.

## Labels
- $D000-$D00F
- $D010
