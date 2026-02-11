# VIC-II Visible Display Window — RSEL ($D011) and CSEL ($D016) (PAL/NTSC, 6567/6569)

**Summary:** RSEL in $D011 selects the vertical display window (24 vs 25 text rows / 192 vs 200 pixels). CSEL in $D016 selects the horizontal display window (38 vs 40 columns / 304 vs 320 pixels). Lists visible-first/last raster/X coordinates and vertical-blank ranges for VIC-II variants 6567R56A, 6567R8 and 6569.

## Display window coordinates and chip differences
The VIC-II visible area is determined by two configuration bits: RSEL (vertical rows) in $D011 and CSEL (horizontal columns) in $D016. Changing these bits shifts the first/last visible raster lines and pixel X coordinates; different physical VIC-II chip variants (6567R56A, 6567R8, 6569) have small fixed offsets that change the chip-reported "first visible X" and vertical-blank line numbers.

Vertical display window (raster lines):
- RSEL = 0 → 24 rows: first visible raster line 55 ($37), last visible line 246 ($F6), total height 192 pixels.
- RSEL = 1 → 25 rows: first visible raster line 51 ($33), last visible line 250 ($FA), total height 200 pixels.

Horizontal display window (pixel X coordinates):
- CSEL = 0 → 38 columns: first visible pixel X = 31 ($1F), last visible pixel X = 334 ($14E), width 304 pixels.
- CSEL = 1 → 40 columns: first visible pixel X = 24 ($18), last visible pixel X = 343 ($157), width 320 pixels.

Chip-variant offsets (first/last visible X) and vertical-blank lines differ by VIC-II model; the PAL 6569’s vertical blank wraps across the raster line counter boundary.

## Source Code
```text
Vertical Display Window (raster lines):
                    RSEL=0 (24 rows)     RSEL=1 (25 rows)
  First line:       55 ($37)             51 ($33)
  Last line:        246 ($F6)            250 ($FA)
  Height (pixels):  192                  200

Horizontal Display Window (X coordinates):
                    CSEL=0 (38 cols)     CSEL=1 (40 cols)
  First pixel:      31 ($1F)            24 ($18)
  Last pixel:       334 ($14E)          343 ($157)
  Width (pixels):   304                 320

First/Last Visible Coordinates by Chip Variant:
                    6567R56A    6567R8      6569
  First vis. X:     488/$1E8   489/$1E9    480/$1E0
  Last vis. X:      388/$184   396/$18C    380/$17C

Vertical Blanking:
                    6567R56A    6567R8      6569
  First VBlank:     line 13     line 13     line 300
  Last VBlank:      line 40     line 40     line 15

Note: The PAL 6569 wraps its vertical blank across the line counter boundary
(lines 300-311, then 0-15).
```

## Key Registers
- $D011 - VIC-II - RSEL: selects vertical display window (24 vs 25 text rows / 192 vs 200 pixel height)
- $D016 - VIC-II - CSEL: selects horizontal display window (38 vs 40 columns / 304 vs 320 pixel width)

## References
- "vicii_chip_variants" — expands on which VIC-II chip affects visible X coordinate offsets and blanking
- "frame_timing_comparison" — expands on relationship between total raster lines and visible window

## Labels
- D011
- D016
- RSEL
- CSEL
