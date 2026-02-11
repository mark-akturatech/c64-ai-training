# Standard character mode (MCM = BMM = ECM = 0)

**Summary:** Standard character mode (VIC-II) displays 8 sequential bytes from the character base as 8 raster lines per character; bit 0 selects the global background color in $D021 and bit 1 selects the character's 4-bit foreground color (color nybble in the video matrix). Searchable terms: VIC-II, $D021, MCM, BMM, ECM, character base, color nybble.

**Standard character mode (behavior)**
In standard character mode (MCM = BMM = ECM = 0) each character cell is formed from 8 sequential bytes read from the character base; these 8 bytes map directly to the 8 raster lines of the character cell. For each bit in those bytes:

- A 0 bit displays the global Background #0 color (VIC-II register 33 / $21 -> absolute $D021).
- A 1 bit displays the character's Foreground color taken from the 4-bit color nybble stored in the video matrix (video matrix = screen RAM).

Thus each character code has a single 4-bit foreground color (one of 16), while every character shares the same Background #0 color from $D021.

## Source Code
```text
                | CHARACTER |
 FUNCTION       |    BIT    |               COLOR DISPLAYED
----------------+-----------+----------------------------------------------
 Background     |     0     |  Background #0 color
                |           |  (register 33 ($21) -> $D021)
 Foreground     |     1     |  Color selected by 4-bit color nybble
```

**Color Code Table**
The VIC-II chip supports 16 colors, each represented by a 4-bit code:

| Color Code | Color Name  |
|------------|-------------|
| 0          | Black       |
| 1          | White       |
| 2          | Red         |
| 3          | Cyan        |
| 4          | Purple      |
| 5          | Green       |
| 6          | Blue        |
| 7          | Yellow      |
| 8          | Orange      |
| 9          | Brown       |
| 10         | Light Red   |
| 11         | Dark Gray   |
| 12         | Medium Gray |
| 13         | Light Green |
| 14         | Light Blue  |
| 15         | Light Gray  |

## Key Registers
- $D011 - VIC-II Control Register 1
  - Bit 6 (ECM): Extended Color Mode
  - Bit 5 (BMM): Bitmap Mode
- $D016 - VIC-II Control Register 2
  - Bit 4 (MCM): Multicolor Mode
- $D021 - VIC-II Background Color Register (Background #0)

## References
- "character_display_mode_and_addressing" — expands on character pointers and character base addressing used by standard mode
- "multi_color_character_mode" — contrasts multi-color character mode interpretation
- "extended_color_mode_and_constraints" — contrasts extended color mode per-character backgrounds
- "VIC-II color code table" — provides the 16-color palette and corresponding codes
- "VIC-II register map" — details control registers and their bit functions

## Labels
- BLACK
- WHITE
- RED
- CYAN
- PURPLE
- GREEN
- BLUE
- YELLOW
- ORANGE
- BROWN
- LIGHT_RED
- DARK_GRAY
- MEDIUM_GRAY
- LIGHT_GREEN
- LIGHT_BLUE
- LIGHT_GRAY
