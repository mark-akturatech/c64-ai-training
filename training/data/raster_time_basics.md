# C64 PAL/NTSC Raster Timing — Definition of "raster time" and basic frame calculations

**Summary:** Defines "raster time" (duration to render one byte / 8 pixels) for the VIC-II and gives example frame calculations for PAL and NTSC (cycles × lines → cycles/frame → approximate Hz). Searchable terms: VIC-II, $D012, raster time, cycles per line, PAL (312 lines), NTSC (263 lines).

## Raster time definition
"Raster time" in this context is the duration the VIC-II takes to render one byte of graphic data (8 pixels) onto the screen. It can be expressed as a number of CPU cycles (cycles per raster line) or as raster lines (lines per frame × cycles per line → cycles per frame). The term is used when budgeting CPU/VIC activity per scanline or per frame.

Each raster line comprises:
- the visible pixel area (screenable pixels), and
- horizontal blanking (left/right borders and the line retrace).

Each frame comprises:
- the visible raster lines, plus
- vertical blanking (top/bottom borders and frame retrace).

## Example frame calculations
PAL example (common C64 PAL timing example given):
- cycles per raster line: 63
- raster lines per frame: 312
- cycles per frame = 63 × 312 = 19,656 cycles
- resulting frame rate ≈ 50.12 Hz (as given)

NTSC example (common C64 NTSC timing example given):
- cycles per raster line: 65
- raster lines per frame: 263
- cycles per frame = 65 × 263 = 17,095 cycles
- resulting frame rate ≈ 59.83 Hz (as given)

Notes:
- The cycles-per-line values above are the units used in these example calculations; they represent the VIC-II/CPU cycles that define the raster timing for each scanline, including visible and horizontal-blank portions.
- Total raster lines include both visible lines and vertical-blanking lines; altering visible vs. blanking counts changes the cycles-per-frame and therefore the frame rate.

## Key Registers
- $D000-$D02E - VIC-II - VIC-II register block (includes control, IRQ, raster, sprite, and timing registers)
- $D012 - VIC-II - Raster counter / current raster line (raster compare and IRQ use)

## References
- "frame_timing_comparison" — expands on numerical timing values (cycles, lines, Hz) used in the calculations  
- "bad_lines" — expands on how bad line behavior affects available raster/CPU cycles

## Labels
- D012
