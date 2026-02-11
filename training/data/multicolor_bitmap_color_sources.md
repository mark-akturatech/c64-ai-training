# Multicolor bitmap 2-bit color mapping (VIC-II $D011 / $D016)

**Summary:** Describes how each 2-bit pair in multicolor bitmap mode maps to color sources (background, screen memory upper/lower nybbles, explicit color nybble) and how to disable multicolor bitmap mode by clearing bit 5 of $D011 and bit 4 of $D016 (VIC-II registers).

## Description
In the VIC-II multicolor bitmap mode each displayed "dot" is formed by 2 bits (horizontal dots are two hardware pixels wide). Each 2-bit value selects one of four color sources for that dot:

- 00 — Background color #0 (the screen background color)
- 01 — Upper 4 bits of the corresponding screen memory byte
- 10 — Lower 4 bits of the corresponding screen memory byte
- 11 — Color nybble (explicit 4-bit color value)

(“nybble” = 4 bits). The text uses “screen memory” for the byte in screen/character memory that provides the per-cell color nybbles.

To turn MULTI-COLOR BITMAP MODE OFF, clear bit 5 of $D011 and bit 4 of $D016. The BASIC example below performs those clears with POKE/PEEK and AND masks.

## Source Code
```basic
' Turn multicolor bitmap mode OFF (BASIC)
POKE 53265, PEEK(53265) AND 223   ' 223 = $DF, clears bit 5 of $D011
POKE 53270, PEEK(53270) AND 239   ' 239 = $EF, clears bit 4 of $D016
```

Color-source mapping table (reference):
```text
BITS    COLOR INFORMATION COMES FROM
00      Background color #0 (screen color)
01      Upper 4 bits of screen memory
10      Lower 4 bits of screen memory
11      Color nybble (4-bit value)
```

## Key Registers
- $D011 - VIC-II - Control register (bit 5 selects multicolor bitmap; clear to disable)
- $D016 - VIC-II - Control register (bit 4 selects multicolor bitmap; clear to disable)

## References
- "multicolor_bitmap_enable_disable" — expands on how to enable/disable multicolor bitmap mode

## Labels
- $D011
- $D016
