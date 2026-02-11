# Sprite Multiplexing — General (True)

**Summary:** General (true) sprite multiplexing for the C64/VIC‑II: sort virtual sprites by Y, remap virtual→physical sprites, and rewrite VIC‑II sprite registers in raster IRQs (see $D010 and VIC‑II sprite registers). Techniques: Y-sorting, raster IRQ register updates, off-screen reset, optional rejection of >8-per-line and double-buffered sorted tables.

## Overview
True sprite multiplexing lets a program present more than 8 logical ("virtual") sprites by reusing the VIC‑II's 8 physical hardware sprites during a frame. The method depends on top-to-bottom (increasing Y) sorting of sprites so raster interrupts can safely reprogram sprite registers as the beam moves down the screen.

Hardware constraints and caveats:
- The VIC‑II cannot display more than 8 sprites on any single raster line; attempting to show more leads to lost sprites or visual corruption.
- Rewriting sprite registers while the sprite graphics are being fetched/displayed may produce visible glitches if sprites are tightly packed vertically.
- Raster IRQ timing and the cost of writing registers are critical; precalculation and careful placement of IRQs are recommended.

## Algorithm / Required steps
1. Maintain a list of virtual sprites containing at least X, Y, enabled flag, pointer to bitmap, and any meta (e.g. X MSB, priority).
2. Sort that list by increasing Y (top of screen first). (Sorting routine responsibility.)
3. Map virtual sprites to physical sprite slots (0–7) in sorted order so that as the raster progresses the IRQs reuse freed physical sprites. Mapping can be done in the sort routine or in the IRQ handlers.
4. Install raster IRQs at appropriate Y positions (raster interrupt = raster scanline interrupt) to:
   - Write sprite registers (X/Y/ptr/enable/flags) for the next set of sprites that should appear below the current beam position.
   - Update $D010 / raster compare as needed to schedule the next IRQ quickly.
5. After a sprite has been displayed (or when preparing for the next frame), reset unused or finished virtual sprites to an off‑screen Y (commonly 255) so they won't appear early on the next frame. (Can be omitted if first 8 registers are written well before display begins.)
6. During a frame, ensure no more than 8 sprites share any raster line; otherwise graphics will be wrong.

## Optional / recommended enhancements
- Cull sprites outside the visible X/Y range early (main program or sorter).
- Detect and reject virtual sprites that would produce >8 sprites on a single raster line (do this in the sorter or at IRQ time) to avoid visual corruption.
- Precompute raster IRQ positions and which physical sprite numbers will be rewritten in each IRQ to minimize runtime work.
- Precompute $D010 values used to set the raster compare (writes to $D010 are on the critical path for fast IRQ handling).
- Double-buffer the sorted sprite table: while the current frame is being displayed and IRQs read the active sorted table, the main program builds the next frame’s sorted table in a second buffer, then swap pointers at frame start.

## Key Registers
- $D000-$D02E - VIC‑II - sprite registers, raster compare and control registers (sprite X/Y positions, sprite pointers, enable/priority bits, raster IRQ registers)
- $D010 - VIC‑II - control/raster MSB and interrupt control (used when precalculating/setting raster compare)

## References
- "sprite_arrays_and_terms" — expands on arrays used for sorting and sprite properties
- "mapping_virtual_to_physical_sprites" — explains how virtual sprites are assigned to physical sprites
- "doublebuffering_sorted_sprite_tables" — expands on double‑buffering sorted arrays so sorting can run while display IRQs execute
