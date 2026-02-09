# $D014 LPENY — Light Pen Vertical Position

**Summary:** $D014 (decimal 53284) LPENY is a VIC-II register that holds the light‑pen vertical position; it latches the current raster scan line number when the light pen is triggered and corresponds to the visible scan lines (0..199).

## Description
This single-byte location contains the vertical position of the light pen. When the light pen is triggered, the register is updated with the current raster scan line. Because the visible screen consists of 200 scan lines, the valid/meaningful range for this register corresponds exactly to 0..199 (visible scan lines).

## Key Registers
- $D014 - VIC-II - Light Pen Vertical Position (LPENY): latched raster scan line on light‑pen trigger; corresponds to visible lines 0..199.

## References
- "light_pen_overview" — expands on general light pen behavior