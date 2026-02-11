# Multicolor Bitmapped Mode

**Summary:** Multicolor bitmap mode on the C64 is enabled by setting VIC-II bitmap mode and then setting bit 5 of YSCROLL ($D011); background comes from BCOLO ($D021), two colors come from the upper/lower nibbles of character ROM/RAM, and the fourth from color RAM. Effective bitmap resolution is 160x200 (horizontal halved); macros referenced: MULTON / MULTOF.

## Multicolor bitmapped mode — description
To use multicolor bitmap mode you must:
- First enable VIC-II bitmap graphics (bitmap mode must be active).
- Then set bit 5 of the YSCROLL register (YSCRL, $D011) to turn on multicolor. Clear bit 5 to turn it off. The macros MULTON and MULTOF are referenced by the source for toggling this bit.

Behavior and color sources:
- Each byte in bitmap memory is interpreted as four 2-bit pairs. Each 2-bit value (00..11) selects which of four color sources provides the color for that 2-pixel group.
- The four color sources used in multicolor bitmap mode are:
  - BCOLO ($D021) — the background color (used for bit pair 00).
  - Upper nibble of the character RAM entry for that character (one color).
  - Lower nibble of the character RAM entry for that character (second color).
  - Color RAM (C64 color RAM — one nybble per character cell) — used for bit pair 11.
- Because each byte encodes 4 two-pixel groups, horizontal resolution is effectively halved: the bitmap appears at 160×200 pixels (width reduced from 320 to 160).

Caveat: bitmap mode itself must be enabled first (VIC-II bitmap setup and pointers); this chunk does not include the bitmap-enable steps.

## Source Code
```text
Bit pair -> Color source mapping (per byte in bitmap memory)

Bit Pair  Color source
00        BCOLO ($D021)            ; background color
01        Upper nibble of character RAM
10        Lower nibble of character RAM
11        Color RAM                 ; color RAM (one nybble per screen cell)
```

## Key Registers
- $D011 - VIC-II - YSCROLL / control; bit 5 = multicolor enable when in bitmap mode
- $D021 - VIC-II - BCOLO (background color) used as the '00' color in multicolor bitmap mode

## References
- "bitmapped_graphics_overview" — expands on resolution and color tradeoffs
- "color_ram_nibble_storage" — expands on use of color RAM as one of the color sources

## Labels
- YSCROLL
- BCOLO
