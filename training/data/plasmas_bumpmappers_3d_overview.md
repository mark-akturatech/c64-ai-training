# Plasmas, Bumpmappers and 3D Effects — C‑64 Demo Techniques (overview)

**Summary:** Overview of common high‑level demo effects (plasmas, bumpmappers, 3D/vector) and C‑64 display/plotting techniques: 8x8 character colour changes, bitmap $55/$AA 8x8 mixing, half‑FLI 4x4 (forces Bad Line every 4th raster) to get an 80x50 effect, and a 16x16 character‑area optimization for fast plotters.

## Description
- Plasmas, bumpmappers and basic 3D/vector effects are algorithmically platform‑independent — if you can compute them elsewhere, you can compute them on the C‑64. The main work is mapping the computed pixel/colour output onto the C‑64 display resources (character mode or bitmap) within tight CPU/timing constraints.
- 8x8 character approach: simplest method is to run the effect at character granularity and change character colours (or redefined character bitmaps) per frame. This gives cheap output but is visibly blocky at 8x8.
- 8x8 bitmap trick: fill bitmap memory with repeating patterns such as $55 and $AA to produce a two‑colour mix inside each 8x8 cell (useful to approximate more detail without redefining many characters).
- 4x4 resolution / half‑FLI: using a half‑FLI technique you can force a VIC‑II Bad Line every 4th raster line to achieve an 80x50 "chunky" effect (4x4 pixels per chunk). Implementation typically requires carefully crafted character data and two screen RAMs to toggle character interpretations per line. The result is coarse but widely used in demos.
  - Note: half‑FLI refers to forcing Bad Lines periodically (VIC‑II raster Bad Line).
- Bitmap vector graphics: true vector/3D demos rely on plotting pixels and drawing lines into the bitmap. The algorithmic needs are simple (plot pixel, draw line), but performance depends heavily on optimized inner loops (integer math, Bresenham variants, unrolled loops, timing alignment with raster).
- Plotter optimization trick: reserve a 16x16 character region where each character index maps linearly to Y coordinates (first column contains char indices 0..15, second column 16..31, etc.), yielding linear Y indexing (0..127) and simplifying address arithmetic for plotting. The advantage: the whole area fits in a single character set so lookups are fast. You can enlarge the drawable area by switching character sets mid‑screen, but that complicates the plotter routine and raster timing.

## References
- "bitmap_screen_layout" — expands on bitmap layout considerations for plotters and addressing schemes
