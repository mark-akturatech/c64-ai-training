# Bitmap (hi-res) graphics mode — VIC-II ($D011 / $D018)

**Summary:** Hi-res bitmap mode on the VIC-II is enabled by Bit 5 of $D011 and produces a 320×200, 1-bit-per-dot display; the VIC-II bitmap/base-memory mapping (bitmap, screen memory, character memory) for the active 16K bank is controlled by $D018; bitmap mode requires 8K bitmap + 1K screen memory inside the VIC bank and still uses the 1K color RAM.

**Bitmap (hi-res) mode — overview**
- **Enabling:** Bit 5 of $D011 turns on bitmap (hi-res) mode. In this mode, the VIC-II fetches an 8K bitmap area (pixel bits) instead of character patterns for the visible text/character grid.
- **Resolution & depth:** 320×200 pixels, 1 bit per pixel in hi-res bitmap. Each pixel is therefore either foreground or background color (foreground/background selection comes from screen/color memory).
- **Memory requirements:**
  - **Bitmap data:** 8 KB (holds the raw pixel bits used by the VIC-II).
  - **Screen memory:** 1 KB (used by the VIC-II to provide per‑8×8-cell information).
  - **Color RAM:** 1 KB (the separate 1K color RAM remains required; it holds color information used together with screen/mode to determine displayed colors).
- **Mapping control:** The location (within the VIC-II’s selectable 16 KB memory bank) of the bitmap and of screen/character memory is controlled by $D018 (VIC memory pointers). Use $D018 to position bitmap/screen/character tables inside the 16K window the VIC uses.
- **Multicolor variants:** The VIC-II supports multicolor bitmap modes (lower horizontal resolution, multiple bits per grouping of pixels) as an alternate bitmap mode — these produce a 160×200-style effective resolution with multiple bits per pixel group and require different interpretation of bitmap and color bytes.
- **Difference from text (character) mode:** In text mode, the VIC-II fetches character patterns from character memory (2 KB blocks) indexed by screen RAM bytes; in bitmap mode, the VIC fetches raw bitmap bytes (8 KB) to produce pixel output. Screen memory and color RAM still influence colors (so bitmap mode is not a standalone pixel-only memory — it works together with screen/color memory).
- **Fine scrolling / control interaction:** $D011 is a multifunction register — it also contains vertical fine-scroll bits, row count select (24/25), screen blanking, extended color text enable, and the high raster bit. These other bits interact with display geometry and timing and remain relevant when using bitmap mode (e.g., vertical fine scrolling still applies).

**Vertical Fine Scrolling**

Vertical fine scrolling allows smooth vertical movement of the display by shifting the screen content up or down by a specified number of scan lines (0–7). This is controlled by bits 0–2 of the $D011 register. To implement vertical fine scrolling:

1. **Set the Vertical Scroll Value:** Write the desired scroll offset (0–7) to bits 0–2 of $D011. This value determines how many scan lines the display is shifted vertically.

2. **Adjust Screen Memory:** As the display is scrolled, the top or bottom rows of the screen may move out of view. To maintain a continuous display, update the screen memory to reflect the new visible content. This involves moving the data in screen memory up or down by one row and inserting new data at the appropriate position.

3. **Handle Bad Lines:** The VIC-II has specific raster lines, known as "bad lines," where it fetches screen data. Fine scrolling affects the timing of these lines. Ensure that your program accounts for this to avoid display artifacts.

By carefully managing the vertical scroll value and updating screen memory accordingly, smooth vertical scrolling can be achieved.

**$D018 Memory Mapping**

The $D018 register controls the memory locations for screen memory and character (or bitmap) data within the current 16 KB VIC-II bank. Its bits are mapped as follows:

- **Bits 0–3 (VM13–VM10):** These bits select the starting address for screen memory. The value of these bits, multiplied by 1024, gives the offset within the 16 KB bank. For example, if bits 0–3 are set to 0001, screen memory starts at an offset of 1024 bytes within the bank.

- **Bits 4–7 (CB13–CB10):** In text mode, these bits select the starting address for character memory. In bitmap mode, they select the starting address for bitmap data. The value of these bits, multiplied by 2048, gives the offset within the 16 KB bank. For example, if bits 4–7 are set to 0010, character or bitmap data starts at an offset of 4096 bytes within the bank.

**Note:** The actual memory addresses depend on the current VIC-II bank, which is selected via the CIA #2 register at $DD00. The VIC-II can access one of four 16 KB banks:

- Bank 0: $0000–$3FFF
- Bank 1: $4000–$7FFF
- Bank 2: $8000–$BFFF
- Bank 3: $C000–$FFFF

By setting the appropriate values in $D018 and selecting the desired VIC-II bank, you can control where the VIC-II fetches screen and bitmap data.

**Memory Layout in Bitmap Mode**

In bitmap mode, the VIC-II requires:

- **Bitmap Data:** 8 KB
- **Screen Memory:** 1 KB
- **Color RAM:** 1 KB (fixed at $D800–$DBFF)

These must be placed within the selected 16 KB VIC-II bank. The placement is determined by the $D018 register and the selected bank. For example:

- **Bitmap Data:** If bits 4–7 of $D018 are set to 0010, the bitmap data starts at an offset of 4096 bytes within the bank. In Bank 0, this corresponds to $1000–$2FFF.

- **Screen Memory:** If bits 0–3 of $D018 are set to 0001, the screen memory starts at an offset of 1024 bytes within the bank. In Bank 0, this corresponds to $0400–$07FF.

**Example Configuration:**

- **VIC-II Bank:** Bank 0 ($0000–$3FFF)
- **$D018 Value:** %00100001 (bits 4–7 = 0010, bits 0–3 = 0001)
  - **Bitmap Data:** $1000–$2FFF
  - **Screen Memory:** $0400–$07FF
  - **Color RAM:** $D800–$DBFF (fixed)

By configuring $D018 and the VIC-II bank appropriately, you can control the memory layout for bitmap mode.

## Key Registers

- **$D000–$D00F:** VIC-II - Sprite 0–7 X/Y positions (SP0X–SP7Y)
- **$D010:** VIC-II - Sprite MSB X bits (MSIGX) — high (256) bits for sprites 0–7
- **$D011:** VIC-II - Vertical fine scroll & control register (SCROLY): bits 0–2 fine vertical scroll, bit 3 rows (24/25), bit 4 screen blank, bit 5 bitmap enable, bit 6 extended color text, bit 7 raster high-bit
- **$D012:** VIC-II - Raster compare low byte (referenced as raster compare at 53266)
- **$D018:** VIC-II - Memory pointers / mapping for bitmap, screen, and character within VIC 16K bank (controls where bitmap & screen tables are located)

## References

- "bitmap_pixel_addressing_and_plotting" — How to find and set individual pixels in bitmap mode
- [C64-Wiki: 53272](https://www.c64-wiki.com/wiki/53272)
- [Retrocomputing Stack Exchange: What is “character memory” to which the VIC-II memory setup register refers?](https://retrocomputing.stackexchange.com/questions/11628/what-is-character-memory-to-which-the-vic-ii-memory-setup-register-refers)
- [C64 on an FPGA: Implementing Multicolor Bitmap Mode](https://c64onfpga.blogspot.com/2019/08/implementing-multicolor-bitmap-mode.html)
- [C64-Wiki: 53265](https://www.c64-wiki.com/wiki/53265)
- [C64 Programmer's Reference Guide: Programming Graphics - Smooth scrolling](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_3/page_130.html)

## Labels
- SCROLY
- VM13
- CB13
- SP0X
- MSIGX
