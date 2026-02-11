# VIC-II $D016 — Horizontal scroll bits (bits 0–2), Bit 3 38/40 columns, Bit 4 multicolor

**Summary:** Details for VIC-II control register $D016 (decimal 53270): three horizontal scroll bits (affect entire screen), Bit 3 (cover first/last columns → 38/40 column cosmetic change), Bit 4 (multicolor text/bitmap selection), multicolor bitmap plotting formula, and BASIC examples including a POKE example to enable multicolor.

**Description**
This chunk documents the behavior of the three horizontal scroll bits and Bits 3 and 4 in VIC-II control register $D016 (decimal 53270):

- **Horizontal scroll bits (bits 0–2):** Changing these three bits changes horizontal coarse scrolling for the entire screen; to scroll only a portion of the screen you must use raster interrupts (example: raster compare register $D01A / decimal 53274) to establish a scroll zone and update the scroll bits only while that zone is being drawn.

- **Bit 3:** When set to 1, the normal 40-column display is enabled; when cleared to 0, the VIC-II display is cosmetically reduced to 38 columns by covering the first and last columns with border, preventing viewers from seeing characters inserted at line ends during coarse scrolling. This is purely cosmetic — not required for scrolling to work.

- **Bit 4 (multicolor select):** Behavior depends on bitmap/text mode:
  - In **text mode** with Bit 4 = 1 (multicolor text): Characters whose color nybble < 8 are displayed normally (single-color). Characters whose color nybble ≥ 8 become multicolor: each dot of the character can be one of four colors. Two colors come from Background Color Registers 1 and 2 ($D022–$D023, decimal 53282–53283) in addition to colors from Color RAM (at $D800 / decimal 55296). Horizontal resolution is reduced: pairs of bits select colors for double-width dots. Bit-pair patterns select:
    - 11 = color from lower three bits of Color RAM nybble
    - 01 = Background Color Register 1
    - 10 = Background Color Register 2
  - In **bitmap mode** with Bit 4 = 1 (multicolor bitmap): Pairs of bits are used to set each dot in a 4×8 cell to one of four colors; horizontal resolution reduces to 160 double-wide dots. Unlike multicolor text mode, multicolor bitmap allows up to three different colors individually selected in a 4×8 area. The dot source for each bit-pair:
    - 00 = Background Color Register 0 ($D021 / decimal 53281)
    - 01 = Upper four bits of Video Matrix
    - 10 = Lower four bits of Video Matrix
    - 11 = Color RAM nybble (area at $D800 / decimal 55296)

- **Byte addressing and plotting in multicolor bitmap:** Horizontal dot X ranges 0–159 (160 positions). Because each plotted pixel is represented by a pair of bits (double-wide), the byte BY containing the bit-pair for dot (X,Y) is computed as:

  BY = BASE + (Y AND 248) * 40 + (Y AND 7) + (2 * X AND 504)

  Where:
  - X = horizontal position (0–159)
  - Y = vertical position
  - BASE = base address of bitmap area (example: 2*4096 = 8192)

- **Bit-mask array and POKE statement to set a bit-pair:**
  - CA(0)=1 : CA(1)=4 : CA(2)=16 : CA(3)=64
  - To turn on a color CO (0–3) at position X in byte BY:

    BI = (NOT X AND 3)
    POKE BY, PEEK(BY) AND (NOT 3*CA(BI)) OR (CO*CA(BI))

- **Example POKE to enable multicolor (one-line example shown in source):**
  - POKE 53270, PEEK(53270) OR 16 : PRINT CHR$(149) "THIS IS MULTICOLOR MODE"

- **Note:** The standard character ROM glyphs are not designed for multicolor text; custom multicolor character sets are needed to make good use of multicolor text. See the alternate entry for $D000 (53248) — Character Generator ROM — for character definitions.

## Source Code
```basic
10 CA(0)=1:CA(1)=4:CA(2)=16:CA(3)=64:REM ARRAY FOR BIT PAIRS
20 BASE=2*4096:POKE53272,PEEK(53272)OR8:REM PUT BIT MAP AT 8192
30 POKE53265,PEEK(53265)OR32:POKE53270,PEEK(53270)OR16:REM MULTI-COLOR BIT MAP
40 A$="":FOR I=1 TO 37:A$=A$+"C":NEXT:PRINT CHR$(19);
50 FOR I=1 TO 27:PRINT A$;:NEXT:POKE 2023,PEEK(2022): REM SET COLOR MAP
60 A$="":FOR I=1 TO 128:A$=A$+"@":NEXT:FOR I=32 TO 63 STEP 2
70 FOR K=1 TO 30-I
80 NEXT K,J,I:RUN

POKE 53270,PEEK(53270)OR16:PRINT CHR$(149)"THIS IS MULTICOLOR MODE"
```

## Key Registers
- $D016 (53270) - VIC-II - Control register (three horizontal scroll bits; Bit 3 = cover first/last columns → 38/40 columns; Bit 4 = multicolor select)
- $D01A (53274) - VIC-II - Raster compare / raster interrupt (used to create scroll zones via raster interrupts)
- $D021 (53281) - VIC-II - Background Color Register 0 (multicolor bitmap source for bit-pair 00)
- $D022–$D023 (53282–53283) - VIC-II - Background Control Registers 1 and 2 (colors used by multicolor text/bitmap for patterns 01 and 10)
- $D000 (53248) - VIC-II / Character ROM area - Character Generator ROM (alternate entry referenced for custom characters)
- $D800 (55296) - Color RAM (nybbles used as one source for multicolor pixels)

## References
- "vertical_fine_scrolling_and_control_register_$D011" — expands on related vertical fine-scrolling bits and behavior

## Labels
- $D016
- $D01A
- $D021
- $D022
- $D023
- $D000
- $D800
