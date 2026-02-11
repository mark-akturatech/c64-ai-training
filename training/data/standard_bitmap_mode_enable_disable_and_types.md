# VIC-II Standard (hi-res) Bitmap Mode (320x200)

**Summary:** Standard (high-resolution) bitmap mode on the C64 (VIC-II) provides 320x200 resolution with 2 colors per 8x8 cell and uses an 8K bitmap area; it is enabled/disabled by setting/clearing bit 5 of VIC-II control register $D011 (decimal 53265).

**Description**
Standard (high-resolution) bitmap mode:
- **Resolution:** 320 horizontal × 200 vertical pixels.
- **Color granularity:** 2 selectable colors per 8×8 cell (each 8×8 block shares the same two colors).
- **Memory:** The screen bitmap occupies an 8K section of RAM mapped into VIC-II addressable space (the bitmap image data itself is stored in that 8K area).
- **Behavior:** In bitmap mode, you control each pixel (dot) directly (on/off for a given color plane), rather than using character glyph bitmaps alone.

**Mode selection:**
- Standard bitmap mode is selected by setting bit 5 of the VIC-II control register at decimal 53265 ($D011).
- Standard bitmap mode is turned off by clearing bit 5 of $D011.

**Memory configuration:**
- **VIC-II memory bank selection:** The VIC-II can access one of four 16 KB memory banks. The active bank is selected via bits 0 and 1 of the CIA-2 Port A register at $DD00 (decimal 56576). The mapping is as follows:
  - %00: Bank 3 ($C000–$FFFF)
  - %01: Bank 2 ($8000–$BFFF)
  - %10: Bank 1 ($4000–$7FFF)
  - %11: Bank 0 ($0000–$3FFF)
- **Bitmap base address:** Within the selected 16 KB bank, the 8 KB bitmap can reside in either the lower or upper half:
  - Bit 3 of the VIC-II Memory Control Register at $D018 (decimal 53272) determines the bitmap's position:
    - 0: Bitmap at the lower 8 KB of the bank.
    - 1: Bitmap at the upper 8 KB of the bank.
- **Screen (color) memory:** The screen memory, which defines the colors for each 8×8 cell, is also set via $D018:
  - Bits 4–7 specify the starting address of the 1 KB screen memory within the 16 KB bank, in 1 KB increments. For example, setting these bits to %0001 positions screen memory at an offset of 1 KB from the start of the bank.

**Color memory usage:**
- In standard bitmap mode, each 8×8 pixel block (cell) has two colors:
  - **Foreground color:** Defined by the lower 4 bits (bits 0–3) of the corresponding screen memory byte.
  - **Background color:** Defined by the upper 4 bits (bits 4–7) of the corresponding screen memory byte.
- The color RAM at $D800–$DBFF is not used in this mode.

**Memory layout example:**
- **VIC-II bank:** Bank 1 ($4000–$7FFF).
- **Bitmap base address:** Upper 8 KB of the bank ($6000–$7FFF).
- **Screen memory:** Located at $4400–$47FF (1 KB starting at offset 1 KB within the bank).

## Source Code
```basic
10 REM Enable standard (hi-res) bitmap mode
20 POKE 53265, PEEK(53265) OR 32

30 REM Disable standard (hi-res) bitmap mode
40 POKE 53265, PEEK(53265) AND 223
```

## Key Registers
- **$D011 (53265):** VIC-II Control Register 1; bit 5 enables/disables standard (hi-res) bitmap mode (set = ON, clear = OFF).
- **$D018 (53272):** VIC-II Memory Control Register; bits 3–7 configure bitmap and screen memory locations.
- **$DD00 (56576):** CIA-2 Port A; bits 0 and 1 select the VIC-II memory bank.

## References
- "bit_mapped_graphics_intro_and_drawbacks" — expands on bitmap tradeoffs
- "bitmap_mode_how_it_works_and_color_memory_usage" — expands on how colors are sourced in bitmap mode

## Labels
- D011
- D018
- DD00
