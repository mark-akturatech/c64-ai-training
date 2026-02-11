# $D013 — LPENX — Light Pen Horizontal Position (53283)

**Summary:** $D013 (decimal 53283) is the VIC‑II light‑pen horizontal position register (LPENX). It returns an 8‑bit value 0–160 representing every second screen dot; multiply by 2 to approximate the actual pixel X coordinate on the 320‑pixel scanline.

## Description
LPENX provides the horizontal position reported by the VIC‑II light pen hardware. Because the register is only 8 bits and the visible horizontal resolution is 320 dots, the value is quantized to every second dot: the register holds values from 0 to 160. Multiply the read value by 2 to obtain a close approximation of the light‑pen X position in pixel units.

Use cases:
- Read $D013 after a light‑pen event to obtain the horizontal coordinate (coarse).
- Multiply the returned value by 2 for an approximate 0–320 pixel X position.

(Chip: VIC‑II)

## Key Registers
- $D013 - VIC-II - LPENX: Light Pen Horizontal Position (8-bit, value 0..160; multiply by 2 for approximate pixel X)

## References
- "light_pen_overview" — General light pen behavior

## Labels
- LPENX
