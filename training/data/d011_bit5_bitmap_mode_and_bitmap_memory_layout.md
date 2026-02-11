# D011 Bit 5 — Enable Bitmap Graphics (VIC-II, 320×200)

**Summary:** Sets $D011 bit 5 to enable VIC-II bitmap graphics (320×200, 64,000 dots). Bitmap uses an 8 KB display area and a separate 1 KB bitmap color map (Color RAM at $D800 is only 4-bit nybbles and cannot be used); bitmap and color base addresses are selected by the VIC Memory Control Register ($D018 / 53272).

## Bitmap mode overview
Setting bit 5 of the VIC-II control register $D011 enables bitmap mode. In bitmap mode the screen is 320 pixels wide by 200 pixels high (64,000 bits). Each pixel is one bit in display memory: a 1 shows the foreground color, a 0 shows the background color.

Unlike many systems that map display bytes sequentially left-to-right/top-to-bottom, the VIC-II bitmap is laid out in a character-like interleaved order: the first byte controls the top-left vertical column of eight dots, the next byte controls the eight dots below that, and so on for eight bytes (forming an 8×8 cell); the ninth byte controls the column immediately to the right of the first byte. This makes the bitmap address layout equivalent to an array of 1000 character cells (40×25 of 8×8 blocks) where display bytes are arranged like character dot data.

## Bitmap memory layout (8 KB) and byte grouping
- The bitmap display area occupies 8192 bytes (8 KB). Only ~8000 bytes are actually used to form the visible 320×200 image, but the VIC-II requires an 8 KB block.
- The display memory is effectively grouped into 8-byte columns forming 8×8 pixel cells. Each byte in a column represents 8 vertical pixels.
- Because of the interleaved (character-like) ordering, converting an (X,Y) pixel to the bitmap byte requires taking into account the 8×8 cell layout and VIC-II memory bank base (see referenced "bitmap_addressing_and_plotting" for practical formulas).

## Color memory for bitmap mode (1 KB)
- Bitmap foreground/background colors are stored in a separate 1 KB color map (1000 bytes used).
- Each byte of the bitmap color map contains two 4-bit nybbles: one 4-bit nibble selects the foreground color for its corresponding 8×8 block, the other 4-bit nibble selects the background color for that block.
- The C64’s hardware Color RAM at $D800 (55296) provides only one 4-bit nybble per screen cell and is wired as 4-bit only — it cannot hold both foreground and background nybbles simultaneously and thus cannot be used as the bitmap color map for full bitmap mode.

## VIC-II memory bank placement and default example
- VIC-II can address a 16 KB window of the system memory map; the 8 KB bitmap and 1 KB color map must be placed within VIC-II-visible RAM halves appropriately: the 8 KB bitmap must be in one half of the 16 KB VIC-II window and the 1 KB color map must be in the opposite half.
- If the default VIC-II bank (first 16 KB) is used, recommended placements from the original documentation:
  - Character ROM appears in the first half of that 16 KB at $1000-$1FFF (4096–8191), so bitmap display data must be placed in the second half: $2000-$3FFF (8192–16383).
  - The color map can be placed at the default text display color memory area: $0400-$07FF (1024–2047).
- Placement of both bitmap base and color base addresses (which half of the 16 KB) is controlled by the VIC Memory Control Register ($D018 / 53272). Selecting a different VIC-II bank (other 16 KB) can be desirable because bitmap consumes much memory; see bank-selection notes in the VIC-II memory-control documentation.

## Key Registers
- $D011 - VIC-II - Bitmap enable: bit 5 enables 320×200 bitmap graphics
- $D018 - VIC-II - VIC Memory Control Register (controls bitmap & color base addresses) 
- $D800 - Color RAM - 4-bit per-character color nybbles (cannot store 8-bit color map needed for bitmap foreground/background)

## References
- "vmcsb_vic_memory_control_register" — expands on controlling bitmap & color base addresses ($D018)
- "bitmap_addressing_and_plotting" — practical formulas for finding a bitmap byte for a given X,Y

## Labels
- $D011
- $D018
- $D800
