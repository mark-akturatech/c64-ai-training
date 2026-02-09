# $D016 Bit 4 — VIC-II Multicolor Mode (text and bitmap behavior)

**Summary:** Describes VIC-II $D016 (Control Register 1) bit 4 (multicolor enable) behavior in text (character) and bitmap modes, mappings of bit-pairs to color sources, the impact on horizontal resolution (160 double-wide dots), and plotting math for multicolor bitmap pixels. Mentions related registers $D021, $D022-$D023, and Color RAM at $D800.

**Behavior and effects**

- When $D016 bit 4 = 0: normal (single-bit) horizontal resolution; each data bit controls one dot.
- When $D016 bit 4 = 1: multicolor mode enabled. Effect depends on whether bitmap mode is also enabled.

**Text (character) multicolor mode (bitmap disabled):**

- Characters whose color nybble < $8 (0–7) display normally: one background color and one foreground color.
- Characters whose color nybble >= $8 use multicolor rendering: each pair of graphics bits (bit-pair) selects one of four color sources, reducing horizontal resolution (pairs create double-width dots).
- The available color sources in multicolor character mode:
  - Background color (Background Color Register 0 — $D021)
  - Background Control Register 1 ($D022)
  - Background Control Register 2 ($D023)
  - Color RAM nybble (lower 3 bits used for color index)
- A bit-pair pattern of 11 uses the Color RAM nybble (lower three bits); patterns 01 and 10 select the colors from $D022 and $D023 respectively.

**Bitmap multicolor mode (bitmap enabled):**

- With both multicolor and bitmap enabled, VIC-II uses bit-pairs for each dot, producing a multicolor bitmap mode with effective horizontal resolution of 160 double-width dots (320->160).
- Up to three individually selectable colors per 4x8 cell are possible (plus the global background).
- Color source mapping for each bit-pair in multicolor bitmap mode:
  - 00 -> Background Color Register 0 ($D021)
  - 01 -> Upper four bits of the Video Matrix (upper nybble of the corresponding Video Matrix byte)
  - 10 -> Lower four bits of the Video Matrix (lower nybble of the same Video Matrix byte)
  - 11 -> Color RAM nybble (Color RAM at $D800)
- The use of bit-pairs changes plotting: treat horizontal X (0–159) as targeting bit-pair indices by first converting X into bit-index (multiply by 2), then locate the byte as in normal bitmap addressing (see Source Code for formulas).

**Caveats:**

- Standard character ROM glyphs are not designed for multicolor character mode; custom four-color characters are normally required to take advantage of this mode (see character ROM / $D000 character generator details).
- Color RAM supplies only nybbles (normally stored in low 4 bits); when used as a color source some implementations reference lower 3 bits for text multicolor foreground selection.

## Source Code

```basic
10 REM Example: enable multicolor (sets bit 4 of $D016) and show a string
20 POKE 53270, PEEK(53270) OR 16
30 PRINT CHR$(149);"THIS IS MULTICOLOR MODE"
```

```text
Multicolor bitmap color-source mapping (per bit-pair):
  00 = Background Color Register 0 (53281, $D021)
  01 = Upper four bits of Video Matrix (video matrix byte >> 4)
  10 = Lower four bits of Video Matrix (video matrix byte & $0F)
  11 = Color RAM nybble (Color RAM starts at 55296, $D800)

Address notes:
  $D016 = 53270 decimal = VIC-II Control Register 1 (bit 4 = multicolor enable)
  $D021 = 53281 decimal = Background Color Register 0
  $D022 = 53282 decimal = Background Control Register 1
  $D023 = 53283 decimal = Background Control Register 2
  Color RAM area starts at 55296 decimal = $D800 (1 KB)
```

```text
Multicolor bitmap plotting (standard formulas):

Given:
  X = horizontal pixel index in multicolor bitmap (0..159)
  row = vertical bitmap row index (0..199)
  bitmap_base = start of bitmap (e.g. $2000 or as configured via VIC-II)

Compute:
  bit_index = X * 2                ; convert 160-space X into 0..318 bit indices
  byte_offset_in_row = bit_index >> 3   ; same as floor((X*2)/8)  -> equals X >> 2
  byte_index = bitmap_base + row*40 + byte_offset_in_row

Within the byte:
  pair_number = X & 3              ; 0..3 within byte => which bit-pair
  shift = 6 - (pair_number * 2)    ; bit-pair occupies bits (shift .. shift+1)
  color_pair_value = (BYTE >> shift) & $03  ; 2-bit value selecting 4 color sources
```

## Key Registers

- $D016 - VIC-II - Control Register 1 (bit 4 = multicolor enable)
- $D021-$D023 - VIC-II - Background Color Register 0 ($D021) and Background Control Registers 1-2 ($D022-$D023)
- $D800-$DBFF - Color RAM - per-character/bitmap nybbles used as one of the multicolor sources

## References

- "color_ram_description" — expands on Color RAM usage in multicolor modes
- "bitmap_multicolor_plotting" — expands on How to plot in multicolor bitmap mode (bit pairs)