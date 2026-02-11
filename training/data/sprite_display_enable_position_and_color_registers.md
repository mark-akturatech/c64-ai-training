# Sprite & Bitmap Plotting (C64): sprites ($D000-$D02E), bitmap bytes, and extended background colors

**Summary:** Steps and register addresses for displaying sprites ($D015, $D000-$D010, $D027-$D02E, $D01C, $D025-$D026), formula and BASIC example for plotting individual bitmap dots in high‑resolution bitmap mode (bitmap base, byte address calculation, bit masks), and extended background color mode with $D021–$D024 mapping to character code ranges.

**Sprite display summary**
- Enable/disable sprites with the Sprite Display Enable bits in the VIC-II control register ($D015).
- Set sprite X/Y positions in the VIC-II sprite position registers ($D000–$D010).
- Set sprite colors in $D027–$D02E (one per sprite).
- Optional: use X/Y expand bits (double width/height), sprite multicolor mode ($D01C), shared multicolor color registers ($D025–$D026), collision-detection registers, and priority (foreground/background) bits — all part of the VIC-II sprite control register set.
- For full sprite control, configure the VIC-II memory/pointer registers (e.g., $D018) to point to sprite shape data stored in RAM.

**Bitmap plotting and byte/bit calculation**
- C64 high-resolution bitmap is stored in a non-linear layout: bytes for a given X,Y dot are found by combining the bitmap base, row-group offset, scanline within the character row, and the column byte index.
- Correct byte address formula (recommended, replacing OCR-corrupted variants in the source):
  BY = BASE + 40 * (Y AND 248) + INT(X / 8) + (Y AND 7)
  - BASE = bitmap base address (e.g., 8192 if you set bitmap base accordingly)
  - 40 = bytes per 8-pixel row (320 pixels / 8 = 40 bytes)
  - (Y AND 248) = Y rounded down to the nearest multiple of 8 (character row group)
  - INT(X / 8) = column byte index (which byte in the 40-wide row)
  - (Y AND 7) = scanline within the 8-pixel high character cell
- Bit within that byte:
  - Bit index = (NOT X) AND 7  (this yields 0–7; C64 bitmap bit 7 = leftmost of the byte)
  - Mask value = 2 ^ bit_index (use a small lookup table for speed)
- To set the dot: POKE BY, PEEK(BY) OR Mask
- To clear the dot: POKE BY, PEEK(BY) AND (255 - Mask)
- Because exponentiation is slow in BASIC, precompute the 8 masks:
  FOR I = 0 TO 7: BI(I) = 2 ^ I: NEXT
  Then use BI(bit_index) instead of 2 ^ bit_index.

**Extended background color mode (ECM)**
- While in bitmap graphics mode, enable multicolor mode by setting Bit 4 of $D016 (53270) for the lower-resolution/multicolor bitmap mode.
- Bit 6 of $D016 enables extended background color mode (ECM): this allows selecting a background color per character cell (reduces number of distinct character shapes available).
- Background color registers and code ranges when ECM is enabled:
  - $D021 (53281) — Background Color Register 0 — used for display codes 0–63
  - $D022 (53282) — Background Color Register 1 — used for display codes 64–127
  - $D023 (53283) — Background Color Register 2 — used for display codes 128–191
  - $D024 (53284) — Background Color Register 3 — used for display codes 192–255
- Note: In ECM only the first 64 character shapes remain individually addressable; characters above those ranges reuse shapes but can use different background colors per ranges listed.

## Source Code
```basic
10 FOR I=0 TO 7: BI(I)=2^I: NEXT       : REM SET UP ARRAY OF POWERS OF TWO
20 BASE = 2 * 4096                     : REM bitmap base = 8192
30 POKE 53272, PEEK(53272) OR 8       : REM set bitmap base (VIC-II pointer)
40 POKE 53265, PEEK(53265) OR 32      : REM enter bitmap mode (source uses this POKE)
50 A$ = "": FOR I = 1 TO 37: A$ = A$ + "C": NEXT
60 PRINT CHR$(19);                     : REM switch to uppercase/graphics (printer control)
70 FOR I = 1 TO 27: PRINT A$; : NEXT    : REM fill text (example setup)
80 POKE 2023, PEEK(2022)               : REM set color RAM pointer (source used these addresses)
90 A$ = "": FOR I = 1 TO 27: A$ = A$ + "@": NEXT
100 FOR I = 32 TO 63 STEP 2
110   POKE 648, I: PRINT CHR$(19); A$; A$; A$; A$ : NEXT : POKE 648, 4
120 REM CLEAR HI-RES SCREEN (example setup)
130 FOR Y = 0 TO 199 STEP 0.5          : REM iterate down the screen
140   X = INT(160 + 40 * SIN(Y / 10))   : REM generate a sine wave X position
150   BY = BASE + 40 * (Y AND 248) + INT(X / 8) + (Y AND 7) : REM corrected hi-res byte address
160   BITIDX = (NOT X) AND 7
170   POKE BY, PEEK(BY) OR BI(BITIDX)   : REM set the bit for the dot
180 NEXT Y
190 GOTO 190
```

Notes about the listing:
- The source had OCR errors and inconsistent formulas (examples corrected above: BY line uses AND 248 and INT(X/8) instead of the corrupted variants).
- Original code used some magic POKEs (53272, 53265 etc.) to configure bitmap/text mode; those are preserved (see Key Registers).

## Key Registers
- $D000-$D02E - VIC-II - Sprite registers, control bits, memory/pointer registers, sprite X/Y positions (sprite data area)
- $D015 - VIC-II - Sprite Display Enable bits (enable/disable sprites)
- $D016 - VIC-II - Control (multicolor bit is Bit 4; Bit 6 enables extended background color mode per source)
- $D01C - VIC-II - Sprite multicolor mode (sprite multicolor enable)
- $D025-$D026 - VIC-II - Shared multicolor registers (multicolor 1/2)
- $D027-$D02E - VIC-II - Sprite color registers (one per sprite)
- $D021-$D024 - VIC-II - Background Color Registers 0–3 (used in ECM for character code groups)
- $D018 (within $D000-$D02E) - VIC-II - Memory pointer register (used to set bitmap/charset base; POKE 53272 referenced)

## References
- "sprite_data_format_and_bit_patterns" — expands on sprite shape data requirements and collision/visibility behavior
- "Hi-Res Graphics Made Simple" — referenced in the source (Paul F. Schatz, COMPUTE! book)

## Labels
- $D000-$D02E
- $D015
- $D016
- $D01C
- $D025-$D026
- $D027-$D02E
- $D021-$D024
- $D018
