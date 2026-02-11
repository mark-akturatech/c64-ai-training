# Extended Background Color Mode (Bit 6 of $D011 / 53265)

**Summary:** Extended Background Color Mode (VIC-II, $D011 bit 6) selects foreground colors from Color RAM ($D800-$DBFF) while choosing one of four background colors per character from Background Color Registers $D021-$D024. Character shapes are limited to the first 64 entries (screen code groups 0–63), with codes 64–255 reusing those shapes but selecting different background registers.

## Behavior and mapping
- In this VIC-II text mode, the foreground color for each character cell comes from Color RAM (screen color memory at $D800-$DBFF).
- The background color used for a character is chosen from one of four Background Color Registers ($D021–$D024), depending on the character's screen code value:
  1. Screen codes 0–63 use Background Color Register 0 ($D021 / 53281).
  2. Screen codes 64–127 use Background Color Register 1 ($D022 / 53282).
  3. Screen codes 128–191 use Background Color Register 2 ($D023 / 53283).
  4. Screen codes 192–255 use Background Color Register 3 ($D024 / 53284).
- Character shapes: only the first 64 character shapes are available. Codes 64–255 display the same shapes as codes 0–63 (i.e., shape_index = screen_code & 63), while the background register index is (screen_code >> 6) yielding 0–3.
- The mode is enabled by setting bit 6 of the VIC-II control register at $D011 (53265).

## Key Registers
- $D011 - VIC-II - Control register; bit 6 enables Extended Background Color Mode (extended background selection by screen code)
- $D021-$D024 - VIC-II - Background Color Registers 0–3 (background color for screen code groups 0–63, 64–127, 128–191, 192–255)
- $D800-$DBFF - Color RAM - foreground (ink) color per character cell (4 bits per cell, low nibble)

## References
- "bgcolor_registers" — expands on Background Color Registers $D021-$D024
- "d011_vertical_fine_scrolling_and_control" — expands on Control register $D011 which contains this bit

## Labels
- D011
- D021
- D022
- D023
- D024
- D800-DBFF
