# COMMODORE 64 — Screen and Color Memory Maps

**Summary:** Screen memory is at $0400-$07E7 (decimal 1024–2023) and color memory at $D800-$DBE7 (decimal 55296–56295). Layout is 40 columns × 25 rows (1000 bytes); color codes 0–15 are listed (only 0–7 usable in multicolor character mode); example: POKE 55296,2 sets the upper‑left character to red.

## Layout and addressing
- The character screen is a 40 × 25 grid (columns 0–39, rows 0–24), occupying 1000 bytes.
- Screen memory addresses increase left-to-right across a row, then continue at the start of the next row.
- Top-left screen character: decimal 1024 ($0400). Bottom-right: decimal 2023 ($07E7).
- Color RAM (one byte per character cell) is a separate 1000‑byte block aligned to the same 40×25 layout; top‑left color RAM: decimal 55296 ($D800). Bottom‑right color RAM: decimal 56295 ($DBE7).
- Address formula (decimal): address = 1024 + row*40 + column (row 0–24, column 0–39).
- Color values: 0–15 (names below). Note: only colors 0–7 are usable in multicolor character mode.

## Source Code
```text
SCREEN MEMORY MAP (decimal addresses)

                                   COLUMN                             1063
        0             10             20             30            39 /
       +------------------------------------------------------------/
  1024 |                                                            |  0
  1064 |                                                            |
  1104 |                                                            |
  1144 |                                                            |
  1184 |                                                            |
  1224 |                                                            |
  1264 |                                                            |
  1304 |                                                            |
  1344 |                                                            |
  1384 |                                                            |
  1424 |                                                            | 10
  1464 |                                                            |
  1504 |                                                            |   ROW
  1544 |                                                            |
  1584 |                                                            |
  1624 |                                                            |
  1664 |                                                            |
  1704 |                                                            |
  1744 |                                                            |
  1784 |                                                            |
  1824 |                                                            | 20
  1864 |                                                            |
  1904 |                                                            |
  1944 |                                                            |
  1984 |                                                            | 24
       +------------------------------------------------------------\
                                                                     \
                                                                      2023
```

```text
COLOR CODES (decimal value → name)

  0  BLACK       4  PURPLE      8  ORANGE      12  GRAY 2
  1  WHITE       5  GREEN       9  BROWN       13  LIGHT GREEN
  2  RED         6  BLUE       10  LIGHT RED   14  LIGHT BLUE
  3  CYAN        7  YELLOW     11  GRAY 1      15  GRAY 3
```

```text
COLOR MEMORY MAP (decimal addresses)

                                   COLUMN                             55335
        0             10             20             30            39 /
       +------------------------------------------------------------/
  55296|                                                            |  0
  55336|                                                            |
  55376|                                                            |
  55416|                                                            |
  55456|                                                            |
  55496|                                                            |
  55536|                                                            |
  55576|                                                            |
  55616|                                                            |
  55656|                                                            |
  55696|                                                            | 10
  55736|                                                            |
  55776|                                                            |   ROW
  55816|                                                            |
  55856|                                                            |
  55896|                                                            |
  55936|                                                            |
  55976|                                                            |
  56016|                                                            |
  56056|                                                            |
  56096|                                                            | 20
  56136|                                                            |
  56176|                                                            |
  56216|                                                            |
  56256|                                                            | 24
       +------------------------------------------------------------\
                                                                     56295
```

```basic
10 REM Example: set upper-left character color to RED
20 POKE 55296,2
```

## Key Registers
- $0400-$07E7 - RAM - Screen (character) memory, 40×25, 1000 bytes (top-left $0400 decimal 1024, bottom-right $07E7 decimal 2023)
- $D800-$DBE7 - Color RAM - 40×25, 1000 bytes (top-left $D800 decimal 55296, bottom-right $DBE7 decimal 56295); values 0–15, only 0–7 usable in multicolor character mode

## References
- "appendix_b_screen_display_codes" — expands on where to POKE character codes to display specific characters

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
- GRAY_1
- GRAY_2
- LIGHT_GREEN
- LIGHT_BLUE
- GRAY_3
