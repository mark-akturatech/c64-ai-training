# Multicolor text mode — bit-pair color mapping and horizontal resolution tradeoff

**Summary:** Explains the VIC-II multicolor text mode tradeoff: horizontal resolution is halved so each character is a 4×8 pixel cell, still defined by 8 bytes; each PAIR of bits in a character byte selects one of four color sources (BCOL0, BCOL1, BCOL3, lower 3 bits of Color RAM). Searchable terms: VIC-II, multicolor text mode, Color RAM, $D800.

## Multicolor text character encoding
When multicolor text mode is selected the horizontal resolution of characters is halved: a character cell is treated as 4×8 "pixels" (wide by high). Characters are still defined by 8 bytes (one byte per row), but instead of each bit representing a single on/off pixel, each PAIR of bits (2 bits) in the byte encodes one of four color sources. Thus each byte encodes four horizontal color cells.

The four possible bit-pair values select these color sources:
- 00 -> BCOL0
- 01 -> BCOL1
- 10 -> BCOL3
- 11 -> lower 3 bits of Color RAM (per-character color)

Color RAM contains a 3-bit color value per screen character (0–7); in multicolor text mode the bit-pair value 11 causes the character cell to use that Color RAM entry. The BCOLn entries referenced above are the VIC-II background color registers (see references). Per-character multicolor enable/selection and other enabling details are covered in the "text_mode_multicolor_mode" reference.

## Source Code
```text
Multicolor text mapping (per 2-bit pair):

Bit pair  Binary  =>  Color source
00        0b00       BCOL0
01        0b01       BCOL1
10        0b10       BCOL3
11        0b11       lower 3 bits of COLOR RAM (per-character)

Character format:
- 8 bytes per character (one byte per row)
- Each byte: 8 bits = four 2-bit pairs -> four horizontal color cells
- Resulting visible size per character: 4 (horizontal) × 8 (vertical) pixel cells
```

## Key Registers
- $D020-$D024 - VIC-II - border and background color registers (BCOL0-BCOL3)
- $D800-$DBFF - Color RAM - per-character color (lower 3 bits used by multicolor text mode)

## References
- "text_mode_multicolor_mode" — how multicolor is enabled and per-character selection
- "extended_background_color_mode" — alternative method to gain colors by trading character codes

## Labels
- BCOL0
- BCOL1
- BCOL2
- BCOL3
