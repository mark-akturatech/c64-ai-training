# Multicolor bitmap mode (VIC-II) — bit 4 of $D016 + bitmap enabled

**Summary:** Explains VIC-II multicolor bitmap behavior when bit 4 of $D016 (Control Register 2) is set along with bitmap mode: horizontal resolution becomes 160 double‑width pixels; each 2‑pixel pair chooses one of four colors (background color 0, upper/lower nybbles of Video Matrix, Color RAM nibble); includes the BY address formula, bit‑pair mask technique and BASIC code example.

## Multicolor bitmap behavior (what changes)
- Enabling bitmap mode and setting bit 4 of $D016 switches the VIC-II into multicolor bitmap: each horizontal pair of pixels is treated as a 2‑bit value (4 possible colors), so the effective horizontal resolution halves to 160 double‑width dots.
- For each 2‑pixel pair the color is selected from these 4 sources (as stated in the source):
  1. Background color register 0 (background register 0)
  2. Lower nybble of the corresponding Video Matrix (screen RAM) byte
  3. Upper nybble of the corresponding Video Matrix byte
  4. Color RAM nybble (per character cell color)
- The bitmap memory layout remains the VIC-II bitmap layout; addressing into the bitmap is performed with a BY offset calculated from X and Y (see next section).
- Bit‑pair painting in the BASIC example is done by ORing a single bit mask into a bitmap byte; the code constructs masks for bit positions 0..7 and computes which bit in the current byte corresponds to the desired pixel pair.

## Address calculation (BY formula explained)
- The BASIC example uses:
  BY = BASE + 40*(Y AND 248) + (Y AND 7) + (X AND 504)
  where BASE is the bitmap base (example: BASE = 2*4096 in the listing), X is horizontal pixel coordinate, Y is vertical pixel coordinate computed by program, and arithmetic is BASIC integer/bitwise operations.
- Interpretation of terms (per the source):
  - (Y AND 248) masks off the low 3 bits of Y (gives the character‑row index in blocks of 8 scanlines).
  - 40*(Y AND 248) converts that character‑row index into the 40‑byte‑wide row offset used by VIC bitmap layout.
  - (Y AND 7) is the row within the 8‑line character block (0..7).
  - (X AND 504) masks X to a multiple of 8 (504 decimal = 0b111111000), producing the byte‑offset across the row that contains the pixel pair. (The program maps pixel X to the proper bitmap byte by masking off low bits.)
- **[Note: Source may contain a variant/formulation difference — some descriptions show "2*X AND 504". The BASIC listing provided uses "X AND 504".]**

## Bit‑pair masks and BASIC implementation notes
- Mask table creation in the example:
  - BI(I) = 2^I for I = 0..7 (an array of bit masks for individual bit positions in a byte).
- Pixel/bit selection in the example:
  - The byte at BY is modified with POKE BY, PEEK(BY) OR (BI( index ))
  - The index is computed as ABS(7 - (X AND 7) - W) in the listing; this picks the bit position inside the byte corresponding to the current X (and W toggles to handle two passes when necessary).
- The listing demonstrates:
  - Generating Y as a function (sine wave) and computing BY per pixel.
  - For multicolor, iterations step by 2 horizontally (as necessary to treat 2‑pixel pairs).
  - How to write bitmap bytes during runtime with PEEK/POKE and mask arrays.

## Source Code
```basic
5 FOR I=0 TO 7:BI(I)=2^I:NEXT
10 FOR I=49152 TO 49278:READ A:POKE I,A:NEXT:SYS12*4096
20 PRINT CHR$(147):FOR I=0 TO 8:PRINT:NEXT
30 PRINT"THE TOP AREA IS HIGH-RES BIT MAP MODE"
40 PRINT:PRINT"THE MIDDLE AREA IS ORDINARY TEXT "
50 PRINT:PRINT"THE BOTTOM AREA IS MULTI-COLOR BIT MAP"
60 FORG=1384 TO 1423:POKE G,6:NEXT
70 FORG=1024 TO 1383:POKEG,114:POKE G+640,234:NEXT
80 A$="":FOR I=1 TO 128:A$=A$+"@":NEXT:FOR I=32 TO 63 STEP 2
90 POKE 648,I:PRINT CHR$(19)CHR$(153);A$;A$;A$;A$:NEXT:POKE 648,4
100 BASE=2*4096:BK=49267
110 H=40:C=0:FORX=0TO319:GOSUB150:NEXT
120 H=160:C=0:FORX=0TO319STEP2:GOSUB150:NEXT:C=40
125 FORX=1TO319STEP2:GOSUB150:NEXT
130 C=80:FOR X=0 TO 319 STEP2:W=0:GOSUB150:W=1:GOSUB150:NEXT
140 GOTO 140
150 Y=INT(H+20*SIN(X/10+C)):BY=BASE+40*(Y AND 248)+(Y AND 7)+(X AND 504)
160 POKE BY,PEEK(BY) OR (BI(ABS(7-(XAND7)-W))):RETURN
49152 DATA 120, 169, 127, 141, 13, 220
49158 DATA 169, 1, 141, 26, 208, 169
49164 DATA 3, 133, 251, 173, 112, 192
49170 DATA 141, 18, 208, 169, 24, 141
49176 DATA 17, 208, 173, 20, 3, 141
49182 DATA 110, 192, 173, 21, 3, 141
49188 DATA 111, 192, 169, 50, 141, 20
49194 DATA 3, 169, 192, 141, 21, 3
49200 DATA 88, 96, 173, 25, 208, 141
49206 DATA 25, 208, 41, 1, 240, 43
49212 DATA 190, 251, 16, 4, 169, 2
49218 DATA 133, 251, 166, 251, 189, 115
49224 DATA 192, 141, 33, 208, 189, 118
49230 DATA 192, 141, 17, 208, 189, 121
49236 DATA 192, 141, 22, 208, 189, 124
49242 DATA 192, 141, 24, 208, 189, 112
49248 DATA 192, 141, 18, 208, 138, 240
49254 DATA 6, 104, 168, 104, 170, 104
49260 DATA 64, 76, 49, 234
49264 DATA 49, 170, 129 :REM SCAN LINES
49267 DATA 0, 6, 0:REM BACKGROUND COLOR
49270 DATA 59, 27,59:REM CONTROL REG. 1
49273 DATA 24, 8, 8:REM CONTROL REG. 2
49276 DATA 24, 20, 24:REM MEMORY CONTROLRUN
```

## Key Registers
- $D000-$D02E - VIC-II registers (general; bitmap and control registers live here)
- $D011 - VIC-II - Control Register 1 (vertical fine scroll, raster high bits)
- $D016 - VIC-II - Control Register 2 (horizontal scroll; bit 4 = multicolor in bitmap mode)
- $D018 - VIC-II - Memory Control (bitmap/screen pointers, memory bank selection)
- $D021 - VIC-II - Background Color 0 (used as one of the four multicolor choices)
- $D800-$DBFF - Color RAM (per-character color nybble used as one of the 4 multicolor choices)

## References
- "bitmap_plotting_examples_and_basic_sample_programs" — expands on Sample code demonstrates drawing in multicolor bitmap

## Labels
- D000-D02E
- D011
- D016
- D018
- D021
- D800-DBFF
