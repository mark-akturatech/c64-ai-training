# BASIC: Plot a sine curve in C64 bitmap mode (bitmap addressing example)

**Summary:** BASIC example demonstrating bitmap addressing formulas and bit manipulation (CH, RO, LN, BY, BI) to plot a sine curve by POKE/PEEK into bitmap bytes; initializes the bitmap base address (BASE) and configures the VIC-II to display the bitmap.

**Description**
This BASIC program steps X across the 320 horizontal bitmap pixels (FOR X = 0 TO 319 STEP .5) and computes a Y value from a sine function. It converts pixel coordinates into the bitmap byte address and bit index:

- CH = INT(X/8) — character column (0–39 for a 320-pixel wide bitmap).
- RO = INT(Y/8) — character row (vertical character cell index).
- LN = Y AND 7 — line within the 8-pixel-high character cell (0–7).
- BY = BASE + RO*320 + 8*CH + LN — byte address in bitmap memory (BASE is the bitmap base address).
- BI = 7 - (X AND 7) — bit index inside the byte (bitmap stores leftmost pixel in bit 7).
- POKE BY, PEEK(BY) OR (2^BI) — sets the pixel by OR-ing the corresponding bit into the bitmap byte.

The program initializes the bitmap base address (BASE) and configures the VIC-II to display the bitmap by setting the appropriate registers.

## Source Code
```basic
10 BASE = 24576 : REM Set bitmap base address to $6000
20 POKE 53272, PEEK(53272) AND 240 OR 8 : REM Set bitmap pointer to $6000
30 POKE 53265, PEEK(53265) OR 32 : REM Enable bitmap mode
40 POKE 53270, PEEK(53270) AND 239 : REM Ensure multicolor mode is off
50 FOR X = 0 TO 319 STEP .5 : REM Wave will fill the screen
60 Y = INT(90 + 80 * SIN(X / 10))
70 CH = INT(X / 8)
80 RO = INT(Y / 8)
85 LN = Y AND 7
90 BY = BASE + RO * 320 + 8 * CH + LN
100 BI = 7 - (X AND 7)
110 POKE BY, PEEK(BY) OR (2 ^ BI)
120 NEXT X
130 GOTO 130
```

## Key Registers
- **$D011 (53265):** Control Register 1
  - Bit 5: Bitmap Mode (BMM) — Set to 1 to enable bitmap mode.
- **$D016 (53270):** Control Register 2
  - Bit 4: Multicolor Mode (MCM) — Set to 0 for standard bitmap mode.
- **$D018 (53272):** Memory Control Register
  - Bits 3–0: Character Memory Pointer — Set to 8 to point to $6000 for bitmap data.

## References
- "bitmap_addressing_and_bit_manipulation_formulas" — expands on addresses and bit calculations used in the example
- Commodore 64 Programmer's Reference Guide, Chapter 3: Programming Graphics

## Labels
- $D011
- $D016
- $D018
