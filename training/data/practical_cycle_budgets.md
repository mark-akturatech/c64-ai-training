# C64 PAL/NTSC Raster Timing — CPU Cycle Budgets (6569 / 6567R8)

**Summary:** Practical per-frame CPU cycle budgets for the VIC-II (6569 PAL / 6567R8 NTSC) including visible-area breakdown, bad-line cost, border/VBlank lines, and totals — searchable terms: VIC-II, cycles/frame, bad lines, VBlank, ($D012 raster register).

## Practical Cycle Budgets

These are approximate CPU cycles available per frame for program logic on a Commodore 64 (VIC-II driven). Numbers are the source's reported totals and visible/border breakdowns; bad lines are the lines where VIC-II performs memory refresh (reducing available CPU cycles).

PAL (6569)
- Reported total cycles/frame: 19,656
- Visible area: 200 lines
  - Normal lines: 175 × 63 cycles = 11,025
  - Bad lines: 25 × 23 cycles = 575
- Border / VBlank area: 112 × 63 cycles = 7,056
- TOTAL available (no sprites): ≈ 18,656
  - Note: some cycles are lost to VIC-II refresh accesses (bad-line and other refresh activity)

NTSC (6567R8)
- Reported total cycles/frame: 17,095
- Visible area: 200 lines
  - Normal lines: 175 × 65 cycles = 11,375
  - Bad lines: 25 × 23 cycles = 575
- Border / VBlank area: 63 × 65 cycles = 4,095
- TOTAL available (no sprites): ≈ 16,045

Key observations (from source)
- PAL provides ≈ 2,600 more CPU cycles per frame than NTSC (useful for heavier per-frame work).
- PAL has significantly more vertical-blank time (112 VBlank lines vs 63), useful for screen updates and music players.
- NTSC gives 2 more cycles per raster line (65 vs 63), but fewer VBlank lines overall.
- Bad lines cost a fixed low-cycle budget (23 cycles each in these counts) and reduce visible-area CPU time.

## References
- "frame_timing_comparison" — expands on cycles-per-frame and line counts
- "bad_lines" — expands on VIC-II bad-line behavior and its effect on available cycles
