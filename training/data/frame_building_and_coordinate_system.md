# VIC-II display generation — raster & sprite X precision ($D011 / $D012)

**Summary:** How the MOS 6567/6569 (VIC-II) builds the video frame line-by-line using the raster line registers ($D011/$D012) as the Y coordinate, the VIC cycle number as a coarse X coordinate, and sprite X (pixel) coordinates with 8× finer resolution than cycle numbers; character matrix 8×8, text 40×25, bitmap 320×200 or 160×200.

## Display generation and display window dimensions
The VIC-II constructs the video frame one raster line at a time. Each raster line contains a fixed number of internal clock cycles (constant for a given VIC-II type). The VIC is fundamentally character-based: character cells are 8×8 pixels, therefore one text row = 8 pixel lines. Standard display modes:

- Text mode: 40 columns × 25 rows of 8×8 characters (40×8 = 320 pixels wide, 25×8 = 200 pixels tall).
- Bitmap modes: 320×200 pixels (hi-res) or 160×200 pixels (multicolor — horizontal pixel doubling).

Vertical resolution (200 pixel lines) results from 25 character rows × 8 pixel rows per character.

## Coordinates, timing and X precision
- Y coordinate: the raster line number is used as the Y coordinate for specifying positions and times of VIC operations. The raster is reported/controlled via the VIC-II raster registers ($D011/$D012).
  - Use raster line (integer) as the vertical position when scheduling VIC memory accesses or internal events.
- X coordinate (timing): when specifying times within a raster line the VIC uses the cycle number within the line as the X coordinate (a cycle is the unit of time for internal VIC events and memory accesses).
- Pixel vs. cycle granularity:
  - One VIC cycle contains 8 pixels. Therefore cycle numbers are coarse (each cycle spans 8 horizontal pixels).
  - Sprite X coordinates and other pixel-based positions are specified in pixel units (single-pixel resolution), so they are 8× more precise than cycle numbers.
- Conversion formula (safe, integer math):
  - X_pixel = cycle_number * 8 + pixel_offset
  - pixel_offset ∈ {0..7} — the pixel within the cycle.
- Practical implication: timing expressed in cycles (for e.g. memory fetch scheduling) maps to an 8-pixel granularity on-screen; sprite placement and sprite-timing adjustments operate at pixel precision inside those cycles.

## Key Registers
- $D011 - VIC-II - Control register 1 (also contains the high bit of the raster counter used with $D012)
- $D012 - VIC-II - Raster line (low 8 bits) — used as the raster Y coordinate
- $D000-$D02E - VIC-II - Full VIC-II register range (general reference to VIC-II registers)

## References
- "display_window_and_border" — expands on visual placement of the display window, border and blanking intervals
- "rsel_csel_display_window_sizes" — expands on how RSEL/CSEL change the display window start/end positions and reported dimensions

## Labels
- $D011
- $D012
