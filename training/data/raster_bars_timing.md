# Raster bars (change $D020 / $D021 per raster line)

**Summary:** Change $D020 and/or $D021 on each raster line (VIC-II $D000-$D02E) to draw coloured raster bars; this is timing-critical — inner loop must take 63 cycles on PAL or 65 cycles on NTSC. Watch sprite DMA (sprite fetches), Bad Lines, and page-crossing cycle penalties when counting cycles.

## Raster Bars
Technique
- Raster bars are produced by writing new border/background colours to $D020 and/or $D021 once per scanline.
- The simplest reliable place to do this is in the upper or lower border (outside the text/bitmap area) — there are no VIC-II Bad Lines there, so the per-line timing is stable.

Typical loop structure (conceptual)
- Wait until the raster reaches the desired start line (use $D012 to synchronize).
- Add an initial delay so the loop starts on the exact cycle you want that line's write to occur.
- Enter a fixed-cycle loop that executes once per raster line:
  - Load a colour value from a table (indexed by an index register).
  - Increment the index register.
  - Store the colour to $D020 (and/or $D021).
  - Execute any required padding/delay instructions.
  - Test/compare the loop counter and branch back if more lines remain.
- The loop must be carefully assembled so its cycle count equals the available cycles per line (63 cycles PAL, 65 cycles NTSC).

Timing pitfalls and caveats
- Bad Lines: Inside the visible character area the VIC-II performs extra memory fetches (Bad Lines) which disturb timing. Doing raster bars in the border avoids this complexity.
- Sprite DMA (sprite fetch interference): If sprites are enabled on a given line, the VIC-II steals cycles for sprite data fetches, changing cycle availability. Avoid moving sprites over the bars (especially changing sprite Y) unless you account for the extra timing variation.
- Page-crossing penalties:
  - A branch instruction that crosses a 256-byte page boundary takes one extra cycle.
  - Indexed absolute accesses (e.g., LDA addr,X) take one extra cycle if addr + X crosses a page boundary.
  - Example from source: LDA $2080,X will take 5 cycles when X > $7F due to page crossing, otherwise 4 cycles.
- Use a monitor (or assemble with careful placement) to control exact code addresses and avoid unintended page-crossings; assemblers that relocate code can hide page boundaries.
- Alignment: you must include a setup delay before entering the per-line loop so your first write occurs on the intended raster cycle.
- Rolling effects:
  - Use separate registers for loop counting and table indexing to make colours "roll" relative to the lines.
  - Alternatively, modify the colour table each frame for different animation effects.

Synchronization
- Use $D012 (raster register) to detect a specific raster line to start your pre-delay and per-line loop (see referenced $D012 material).

## Key Registers
- $D000-$D02E - VIC-II - Raster and border registers (includes $D012 raster register and border/background colour registers $D020 and $D021)

## References
- "d012_raster_register" — waiting for specific raster lines via $D012 to start raster bars

## Labels
- D012
- D020
- D021
