# VIC-II ECM text mode (ECM=1, BMM=0, MCM=0)

**Summary:** VIC-II ECM text mode (ECM/BMM/MCM = 1/0/0) — per-character background selection using the upper two bits of the character pointer; reduces character set from 256 to 64. g-access forces bits 9/10 low; g-data: 8 pixels where '0' selects one of four background registers ($D021–$D024) and '1' uses color bits from c-data.

## ECM text mode (ECM/BMM/MCM = 1/0/0)
This mode is identical to standard text mode except that each character can select one of four background colors via the upper two bits of its character pointer. Because those two bits are used for background selection, the available character set is reduced from 256 characters to 64 characters (upper two bits no longer select character shape).

Behavioral summary:
- Character RAM (c-data) supplies:
  - A 4-bit color for "1" pixels (bits 11..8).
  - A 2-bit background selection (bits 7..6) selecting one of four background color registers.
  - Remaining bits (D5..D0) as character row/column or pointer bits per the standard layout.
- Graphic RAM (g-data) supplies 8 pixels per fetched byte (bits 7..0). For each pixel:
  - If the pixel bit = 1: the pixel color is taken from c-data bits 11..8.
  - If the pixel bit = 0: the pixel color is one of four background colors selected by c-data bits 7..6:
    - 00 → background color 0 ($D021)
    - 01 → background color 1 ($D022)
    - 10 → background color 2 ($D023)
    - 11 → background color 3 ($D024)
- g-access addressing in ECM text mode forces address bits 10 and 9 to zero (these bits are shown as 0 in the g-access address map), limiting how character graphics are fetched compared with other modes.

Do not confuse these per-character background register selections with normal single-background text modes: ECM changes how background colors are selected per character but does not change the fundamental pixel-fetching mechanism beyond the forced address bits noted above.

## Source Code
```text
c-access

 Addresses

 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+
 | 13 | 12 | 11 | 10 |  9 |  8 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |  0 |
 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+
 |VM13|VM12|VM11|VM10| VC9| VC8| VC7| VC6| VC5| VC4| VC3| VC2| VC1| VC0|
 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+

 Data

 +----+----+----+----+----+----+----+----+----+----+----+----+
 | 11 | 10 |  9 |  8 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |  0 |
 +----+----+----+----+----+----+----+----+----+----+----+----+
 |     Color of      |Back.col.| D5 | D4 | D3 | D2 | D1 | D0 |
 |    "1" pixels     |selection|    |    |    |    |    |    |
 +-------------------+---------+----+----+----+----+----+----+
```

```text
g-access

 Addresses

 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+
 | 13 | 12 | 11 | 10 |  9 |  8 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |  0 |
 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+
 |CB13|CB12|CB11|  0 |  0 | D5 | D4 | D3 | D2 | D1 | D0 | RC2| RC1| RC0|
 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+

 Data

 +----+----+----+----+----+----+----+----+
 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |  0 |
 +----+----+----+----+----+----+----+----+
 |         8 pixels (1 bit/pixel)        |
 |                                       |
 | "0": Depending on bits 6/7 of c-data  |
 |      00: Background color 0 ($d021)   |
 |      01: Background color 1 ($d022)   |
 |      10: Background color 2 ($d023)   |
 |      11: Background color 3 ($d024)   |
 | "1": Color from bits 8-11 of c-data   |
 +---------------------------------------+
```

## Key Registers
- $D021-$D024 - VIC-II - Background color registers selected by c-data bits 7..6 in ECM text mode (background color 0..3)

## References
- "standard_text_mode" — expands on comparison: ECM changes background selection, not pixel fetching