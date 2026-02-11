# Color RAM and Multicolor Text Mode (C64)

**Summary:** Color RAM at $D800-$DBFF provides one nybble (4 bits) per character for per-character color selection; multicolor text mode is enabled by Bit 4 of $D016 (53270) and expands the available colors using Background Color Registers $D022-$D023 (53282-53283, VIC-II).

## Description
- Color RAM starts at 55296 ($D800) and contains one nybble (4 bits) per screen character. Each entry selects the character's color value used by the VIC-II for text/character modes.
- Normal (single-color) text mode: character bitmap bits select foreground vs. background pixels; the single nybble from Color RAM selects the character's foreground color (one of the 16 possible color values).
- Multicolor text mode (enabled by Bit 4 of $D016 / decimal 53270): the VIC-II treats horizontal bits in pairs instead of single bits, so each double-width dot uses a 2-bit value (four possibilities). This reduces horizontal resolution (effectively to four color cells across the 8-pixel-wide character) but allows four color choices per double-dot.
- In multicolor text mode the four choices for each double-dot include the character's Color RAM nybble value plus two additional background colors provided by the VIC-II background color registers ($D022 and $D023). This lets characters use extra shared colors in addition to their per-character value.
- Practical effect: multicolor text sacrifices horizontal detail (coarser pixel width) in exchange for richer, multiple-color text per character by combining per-character nybbles with VIC-II background color registers.

## Key Registers
- $D800-$DBFF - Color RAM - per-character 4-bit color values (starts at 55296)
- $D016 - VIC-II - control register; Bit 4 = multicolor text mode enable (53270)
- $D022-$D023 - VIC-II - Background Color Registers 1 and 2 (53282-53283)

## References
- "scrolx_horizontal_fine_scrolling" — expands on Register $D016 controls (multicolor bit and fine scrolling)
- "color_ram_description" — expands on Detailed Color RAM behavior and colors ($D800-$DBFF)

## Labels
- COLOR_RAM
- D016
- D022
- D023
