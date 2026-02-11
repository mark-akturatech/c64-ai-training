# Opening the Side Border

**Summary:** Technique to open the C64 side border by manipulating VIC-II control register $D016 on each raster line (requires stable raster timing). Use DEC $D016 / INC $D016 per line; use $D021 as a visual timing probe next to the right border.

## Opening the Side Border
If you have a stable raster, you can open the side border the same way the top/bottom borders are opened, but applied per raster line. Instead of changing $D011 once per frame, perform the change to $D016 on every raster line where the side border should be opened.

The minimal sequence is to decrement then increment the VIC-II register: DEC $D016 followed by INC $D016 (performed at the correct cycle within the raster line). To verify you're timing the operation next to the right border, toggle $D021 (background color register) instead of $D016 as a visible probe.

This effect depends on very stable, cycle-exact raster timing (see stable_raster_interrupts for details).

## Key Registers
- $D000-$D02E - VIC-II - VIC-II register range (control registers used for border/scrolling manipulation)
- $D011 - VIC-II - control register (vertical fine scroll / raster high bits)
- $D016 - VIC-II - control register (horizontal fine scroll / memory/control used to open side border per line)
- $D021 - VIC-II - background color register (use as visible timing probe)

## References
- "stable_raster_interrupts" — expands on the need for stable raster timing and interrupt setup required for per-line effects
