# Multi-color Bit Map Mode (BMM = 1, MCM = 1)

**Summary:** VIC‑II multi-color bitmap mode (set MCM along with BMM) uses the same bitmap memory access as standard bitmap mode but interprets dot data as 2-bit pairs selecting colors (00..11). Key terms: VIC‑II, $D016, $D021, DB11-DB8, video matrix pointer, 160×200 resolution.

**Description**
Multi-color bitmap mode is enabled by setting both the BMM (Bitmap Mode) bit and the MCM (Multi-Color Mode) bit. Memory access and layout are the same as standard bitmap mode; the difference is how each dot is interpreted.

Each byte of bitmap dot data is read as 4 pairs of bits. Each 2-bit pair selects a display color according to:

- 00 = Background #0 color (register 33 / $21)
- 01 = Upper nybble of the video matrix pointer
- 10 = Lower nybble of the video matrix pointer
- 11 = Video matrix color nybble (DB11–DB8)

Notes and consequences:
- The color nybble (bits DB11–DB8 of the video matrix entry) is used in multi-color bitmap mode.
- Because two bits select one dot color, horizontal dot width is doubled compared to standard bitmap rendering, yielding an effective resolution of 160×200 (horizontal dots doubled).
- Within each 8×8 character block, up to three independently selected colors (from the video matrix nybbles) plus the background color can appear.

## Source Code
```text
BIT PAIR | DISPLAY COLOR
-------- + --------------------------------------------------------
  00     | Background #0 color (register 33 ($21))
  01     | Upper nybble of video matrix pointer
  10     | Lower nybble of video matrix pointer
  11     | Video matrix color nybble (DB11-DB8)

Notes:
- Uses same memory access sequences as standard bitmap mode.
- Horizontal dot is doubled -> 160H * 200V resolution.
- Color nybble (DB11-DB8) is used for multi-color bitmap mode.
```

## Key Registers
- $D011 - VIC-II Control Register 1: Bit 5 (BMM) enables bitmap mode.
- $D016 - VIC-II Control Register 2: Bit 4 (MCM) enables multi-color mode.
- $D021 - VIC-II Background Color Register (Background #0) used by multi-color bitmap mode.

## References
- "standard_bitmap_mode_behavior" — Comparison of bit-to-color selection when MCM is off
- "bitmap_mode_and_display_base_addressing" — Bitmap memory layout and display base addressing used by both bitmap modes

## Labels
- $D011
- $D016
- $D021
