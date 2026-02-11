# Multicolor Character Mode — bit-pair color mapping (VIC-II)

**Summary:** Explains how the VIC-II multicolor character mode groups character bits into horizontal bit-pairs and maps each pair to one of four color sources (Background #0 $D021, Background #1 $D022, Background #2 $D023, or color RAM lower 3 bits). Includes an example bit pattern (letter 'A') and the bit-pair → color-source lookup.

## Multicolor bit-pair behavior
In VIC-II multicolor character mode, character bitmap bits are interpreted in horizontal pairs (two adjacent bits form one pair). Each pair selects one of four color sources:

- 00 → Background #0 (screen color)
- 01 → Background #1
- 10 → Background #2
- 11 → the character color stored in color RAM (lower 3 bits)

The mode effectively reduces horizontal resolution (each visible pixel is two bitmap bits wide) and produces 4-color per-cell combinations by selecting one of the above sources for each bit-pair. See the example below (ASCII art + bit patterns) for how a letter's bitmap maps AA/BB/CC areas to Background #1, Background #2, and the character color.

## Source Code
```text
Example: letter 'A' (normal/high-resolution bit pattern shown, then multicolor pairing)

NORMAL/HIGH-RESOLUTION IMAGE    BIT PATTERN
    **                          00011000
   ****                         00111100
  **  **                        01100110
  ******                        01111110
  **  **                        01100110
  **  **                        01100110
  **  **                        01100110
                                00000000

MULTICOLOR VIEW (bit pairs shown as AA/BB/CC)
AABB      00011000
CCCC      00111100
AABBAABB  01100110
AACCCCBB  01111110
AABBAABB  01100110
AABBAABB  01100110
AABBAABB  01100110
          00000000

In the image area above:
- AA regions are drawn in Background #1 color
- BB regions use Background #2 color
- CC regions use the character color (from color RAM lower 3 bits)

Bit-pair → color-source lookup:
+----------+--------------------------------------+---------------------+
| BIT PAIR |          COLOR REGISTER              |       LOCATION      |
+----------+--------------------------------------+---------------------+
|    00    | Background #0 color (screen color)   |   53281 ($D021)     |
|    01    | Background #1 color                  |   53282 ($D022)     |
|    10    | Background #2 color                  |   53283 ($D023)     |
|    11    | Color specified by the lower 3 bits  |   color RAM         |
|          | in color memory                      |                     |
+----------+--------------------------------------+---------------------+
```

## Key Registers
- $D021-$D023 - VIC-II - Background colors: Background #0 (screen color) $D021, Background #1 $D022, Background #2 $D023
- $D800-$DBFF - Color RAM - per-character color (lower 3 bits used when a bit-pair = 11)

## References
- "multi_color_character_mode_intro_and_enable_disable" — expands on how to enable/disable multicolor character mode
- "multicolor_bitmap_color_sources" — expands on how the same bit-pair rules apply to multicolor bitmaps