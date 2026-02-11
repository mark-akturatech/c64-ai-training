# BASIC demo: set VIC-II background colors, enable multicolor, write Color RAM

**Summary:** Short Commodore 64 BASIC demo that writes VIC-II background color registers ($D021-$D023), sets the multicolor bit in $D016, clears the screen and prints characters, then POKEs into Color RAM ($D800) to assign per-character colors (here value 8). Addresses shown as decimal (53270, 53281, 53282, 55296) are mapped to their $Dxxx equivalents.

**Description**
This program demonstrates the minimal steps to:
- Set the three VIC-II background color registers used by multicolor character modes:
  - $D021 (53281) = background 0
  - $D022 (53282) = background 1
  - $D023 (53283) = background 2
- Enable character multicolor mode by setting bit 4 (value 16) of $D016 (53270).
- Print characters and write into Color RAM ($D800-$DBFF) so each character cell uses the color stored there.

Notes and clarifications:
- BASIC POKE addresses in the listing use decimal. Key mappings:
  - 53270 = $D016 (VIC-II control register where bit 4 enables multicolor)
  - 53281 = $D021
  - 53282 = $D022
  - 53283 = $D023
  - The computed address 13*4096+8*256 = 55296 = $D800 (Color RAM start).
- The third POKE in the original listing (line 120: `POKE 53282,8`) appears to be a typo — it likely intended `POKE 53283,8` to set background color #2. This chunk preserves that observation.
- Color RAM is 1 KB at $D800-$DBFF and stores 4-bit color values per character cell (0-15), used for per-character foreground color in text/charset modes; value 8 in the example assigns color index 8 to those cells.
- Clearing the screen is done by `PRINT CHR$(147)` (CLR/HOME).
- Enabling multicolor: `POKE 53270, PEEK(53270) OR 16` sets bit 4 of $D016 without changing other bits.

## Source Code
```basic
100 POKE 53281,1: REM set background color #0 to white
110 POKE 53282,3: REM set background color #1 to cyan
120 POKE 53282,8: REM set background color #2 to orange  : REM (likely should be 53283)
130 POKE 53270,PEEK(53270)OR16: REM turn on multicolor mode (sets bit 4 of $D016)
140 C=13*4096+8*256: REM set C to point to color memory (13*4096 + 8*256 = 55296 = $D800)
150 PRINT CHR$(147)"aaaaaaaaaa"
160 FOR L=0 TO 9
170   POKE C+L,8: REM set color RAM for each printed character to color index 8
180 NEXT
```

## Key Registers
- $D016 (53270) - VIC-II control register (bit 4 = multicolor enable; OR with $10 / decimal 16 to set)
- $D021 (53281) - VIC-II background color register 0
- $D022 (53282) - VIC-II background color register 1
- $D023 (53283) - VIC-II background color register 2
- $D800-$DBFF (55296-56295) - Color RAM - per-character color (4-bit values, 1 byte per character cell)

## References
- "multi_color_mode_bit_pairs_and_color_registers" — expands on background registers usage and multicolor bit pairs

## Labels
- D016
- D021
- D022
- D023
- D800
