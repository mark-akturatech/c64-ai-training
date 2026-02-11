# VIC-II Multi-Color Character Mode (Character Multicolor)

**Summary:** How to enable/disable VIC-II multi-color character mode via $D016 (53270) and how per-character multi-color is selected via color RAM at $D800 (55296); includes POKE/PEEK examples and the rule that color RAM values <8 = hi-res, >=8 = multicolor.

**Description**
Multi-color character mode lets each character-dot be one of four colors (background #0, background #1, background #2, or the character's color) at the cost of horizontal resolution: multi-color dots are twice as wide as high-resolution dots. This mode is controlled on two levels:

- **Global enable (VIC-II control):** Bit 4 of the VIC-II control register at decimal 53270 ($D016) turns multi-color character mode on or off for the VIC chip as a whole.
- **Per-character selection (Color RAM):** Each character cell uses color RAM (starts at decimal 55296 / $D800) to select its color and to choose whether that cell is displayed in high-resolution or multi-color character mode. Specifically:
  - If the byte stored in color RAM for a screen position is 0–7 (bit 3 = 0), that character cell is displayed in standard high-resolution character mode (single foreground color with background).
  - If the byte stored in color RAM for a screen position is 8–15 (bit 3 = 1), that character cell is displayed in multi-color character mode (each dot may select from four colors).

The tradeoff: horizontal pixel resolution is halved in multi-color mode (each multi-color pixel occupies two hi-res pixel widths), but you gain up to four colors per character-dot area, which helps avoid color-clash where differently colored lines cross.

**Background Colors:**
In multi-color character mode, the four possible colors for each pixel are determined as follows:

- **Bit Pair 00:** Background Color 0, set by register at $D021 (53281).
- **Bit Pair 01:** Background Color 1, set by register at $D022 (53282).
- **Bit Pair 10:** Background Color 2, set by register at $D023 (53283).
- **Bit Pair 11:** Foreground color, set by the lower 4 bits of the corresponding color RAM byte at $D800–$DBFF (55296–56295).

This mapping allows each character cell to utilize a unique foreground color while sharing common background colors across the screen.

## Source Code
```basic
REM Enable global multi-color character mode (VIC-II bit 4 set)
POKE 53270, PEEK(53270) OR 16

REM Disable global multi-color character mode (VIC-II bit 4 clear)
POKE 53270, PEEK(53270) AND 239

REM Color RAM starts at decimal 55296 ($D800).
REM To set a character cell at screen-index N (0-based) into multicolor:
POKE 55296+N, 8      : REM set bit 3 (value 8..15 => multicolor)

REM To set a character cell into high-resolution colors:
POKE 55296+N, 2      : REM clear bit 3 (value 0..7 => hi-res)
```

```text
Reference addresses and thresholds (decimal / hex):
- VIC-II control register (decimal 53270) = $D016 : bit 4 = character multicolor global enable
- Color RAM start (decimal 55296) = $D800 : one byte per character cell
  - Color RAM value 0-7  => hi-res character cell (bit 3 = 0)
  - Color RAM value 8-15 => multi-color character cell (bit 3 = 1)
- Background Color 0 register (decimal 53281) = $D021
- Background Color 1 register (decimal 53282) = $D022
- Background Color 2 register (decimal 53283) = $D023
```

## Key Registers
- $D016 - VIC-II - control register; bit 4 enables/disables multi-color character mode globally
- $D800-$DBFF - Color RAM - per-character color byte; bit 3 (values >=8) selects multi-color for that character cell
- $D021 - Background Color 0 register
- $D022 - Background Color 1 register
- $D023 - Background Color 2 register

## References
- "multi_color_mode_bit_pairs_and_color_registers" — expands on how bit pairs map to colors
- "multicolor_bitmap_enable_disable" — expands on multi-color bitmapped mode and related registers

## Labels
- VIC_CTRL
- COLOR_RAM
- BGCOL0
- BGCOL1
- BGCOL2
