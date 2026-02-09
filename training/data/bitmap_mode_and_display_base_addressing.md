# Bit map mode (BMM = 1) — 320×200 bitmap addressing

**Summary:** Describes VIC-II (6566/6567) bitmap mode where each memory bit maps to one displayed dot (320×200). Explains BMM enable (register 17 / $D011), use of the VIDEO MATRIX as color bytes, and formation of the 8KB DISPLAY BASE address via CB13 ($D018) and the VIDEO MATRIX COUNTER (VC9..VC0) plus the 3-bit raster counter (RC2..RC0).

## Bit map mode
In bitmap mode the VIC-II fetches display data so that each memory bit corresponds to one displayed dot, yielding a 320 (horizontal) × 200 (vertical) dot resolution. Enable bitmap mode by setting the BMM bit in VIC register 17 (offset $11 — absolute $D011). The VIDEO MATRIX still exists and is read as before, but its bytes are interpreted as color bytes rather than character pointers.

The VIDEO MATRIX COUNTER (VC outputs) is reused as part of the address to fetch bitmap dot bytes from the 8 KB DISPLAY BASE. The DISPLAY BASE is formed from:
- CB13: the high bit of the display base (from VIC register 24 / $D018), and
- VC9..VC0: the video matrix counter outputs (ten bits), and
- RC2..RC0: the 3-bit raster-line counter (pixel row within an 8-pixel-high character cell).

Because the video matrix counter steps through the same 40 screen columns for eight raster lines (the raster counter counts 0..7), memory is arranged so that each group of eight sequential memory bytes produces an 8×8 dot block on screen. The raster counter increments once per horizontal video line; the video matrix counter advances to the next 40-column set every eighth raster line.

## Source Code
```text
DISPLAY BASE address bit assignment (A13..A00):

 A13 | A12 | A11 | A10 | A09 | A08 | A07 | A06 | A05 | A04 | A03 | A02 | A01 | A00
-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----
 CB13| VC9 | VC8 | VC7 | VC6 | VC5 | VC4 | VC3 | VC2 | VC1 | VC0 | RC2 | RC1 | RC0

Notes:
- CB13 is provided by VIC register 24 ($18 / absolute $D018).
- VC9..VC0 are the 10-bit VIDEO MATRIX COUNTER outputs.
- RC2..RC0 are the 3-bit raster line counter (0..7), selecting the row within an 8-pixel-high block.
- The DISPLAY BASE size is 8000 bytes (8 KB).
```

## Key Registers
- $D011 - VIC-II - Register 17 (BMM bit): bitmap mode enable.
- $D018 - VIC-II - Register 24 (CB13 and display base/control bits): provides CB13 (A13 high bit) used to form the 8 KB DISPLAY BASE.

## References
- "character_display_mode_and_addressing" — how the video matrix counter is re-used in bitmap vs character mode  
- "standard_bitmap_mode_behavior" — standard bitmap color selection rules  
- "multi_color_bitmap_mode" — multi-color bitmap interpretation and nybble usage