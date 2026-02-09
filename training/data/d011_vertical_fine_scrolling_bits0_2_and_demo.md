# $D011 (53265) SCROY — Vertical fine scroll & control (VIC-II)

**Summary:** $D011 / 53265 is the VIC-II SCROY (vertical fine scrolling and control) register; bits 0-2 provide vertical fine scroll (0–7 scanlines), bit 3 selects 24/25-row text, bit 4 controls screen blanking, bit 5 enables bitmap mode, bit 6 enables extended color text, and bit 7 is the high bit of the 9-bit raster compare with $D012.

## Vertical fine scroll (bits 0–2) and register overview
Bits 0–2 (value 0–7) specify a vertical fine-scroll offset in scanlines (0..7). Each text row is 8 scanlines high; changing the low three bits shifts the entire displayed character grid up/down by the specified number of scanlines to produce smooth vertical motion without moving character memory. Typical usage clears the low 3 bits then ORs in the desired offset:

- Clear low bits: PEEK(53265) AND 248  (248 = 0xF8)
- Set offset: (PEEK(53265) AND 248) OR value   (value = 0..7)

Stepping through offsets 0→7 (or 7→0) produces the visually smooth transition between character rows. When the offset wraps from 7→0 or 0→7 a coarse scroll is required: the screen memory must be shifted by one text row (40 bytes) and a new row inserted at the opposite edge. Because moving 40-byte rows quickly requires machine-language speed to maintain continuous smooth scrolling, implementations that loop in BASIC will show a pause each wrap; short BASIC demos can still demonstrate the fine-scroll effect.

Other bits in $D011 (for context):
- Bit 3: select 24-row (0) or 25-row (1) text display.
- Bit 4: screen blanking control (0 = force screen blank to background color, 1 = normal).
- Bit 5: bitmap mode enable (1 = enable).
- Bit 6: extended background color/text mode (1 = enable).
- Bit 7: high bit (bit 8) of the raster compare combined with $D012 ($D012 is low 8 bits).

Default value reported in the source: 155 decimal (binary 10011011). Interpreted:
- Bits 0–2 = 3 → vertical fine-scroll offset = 3 scanlines
- Bit 3 = 1 → 25-row display selected
- Bit 4 = 1 → blanking disabled (normal)
- Bit 5 = 0 → bitmap mode disabled
- Bit 6 = 0 → extended color text disabled
- Bit 7 = 1 → high raster-compare bit set

## Source Code
```text
Register: $D011 (53265) — SCROY (VIC-II)
Bits (7..0):
  7 - Raster-compare high bit (MSB for 9-bit raster compare with $D012)
  6 - Extended background color / text mode enable (1 = enabled)
  5 - Bitmap mode enable (1 = enabled)
  4 - Screen blanking control (0 = force blank to background color, 1 = normal)
  3 - Text rows select (0 = 24 rows, 1 = 25 rows)
  2..0 - Vertical fine scroll offset (0..7 scanlines)
Mask to clear fine-scroll bits: AND 248 (0xF8)
```

```basic
10 FOR I=1 TO 50: FOR J=0 TO 7
20   POKE 53265,(PEEK(53265) AND 248) OR J
30 NEXT J,I
40 FOR I=1 TO 50: FOR J=7 TO 0 STEP -1
50   POKE 53265,(PEEK(53265) AND 248) OR J
60 NEXT J,I
```

```basic
10 POKE 53281,0: PRINT CHR$(5); CHR$(147)
20 FOR I=1 TO 27
30   PRINT TAB(15); CHR$(145);"            "; POKE 53265, PEEK(53265) AND 248
40   WAIT 53265,128: PRINT TAB(15);"I'M FALLING"
50   FOR J=1 TO 7
60     POKE 53265,(PEEK(53265) AND 248) + J
70     FOR K=1 TO 50: NEXT K
80   NEXT J
90 NEXT I: RUN
```

Notes on the BASIC listings:
- Use POKE 53265 with (PEEK(53265) AND 248) to clear bits 0–2 before ORing the desired fine-scroll offset.
- 248 decimal = 0xF8 mask clears low three bits.

## Key Registers
- $D011 - VIC-II - Vertical fine scroll and control register (bits 0-2 = fine scroll offset 0–7; bit 7 = raster-compare high bit)

## References
- "d011_bit3_shortened_display" — expands on Bit 3: 24/25 rows
- "d011_bit4_screen_blanking" — expands on Bit 4: screen blanking & performance
- "d012_raster_compare_register" — 9-bit raster compare with $D011 bit 7