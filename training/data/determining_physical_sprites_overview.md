# Sprite Multiplexing — Determining which physical sprites to write and when

**Summary:** Sprite multiplexing decision strategies for the VIC-II: choose which physical sprite registers ($D000-$D02E) to write and when using either "write just before new sprite Y" or "write just after old sprite ends"; updates may be precalculated or performed on-the-fly inside raster IRQs.

## Overview
This node describes the two basic timing strategies used when multiplexing hardware sprites on the C64's VIC-II: deciding which physical sprite registers to update and at what raster moment to perform the writes. Both methods aim to reuse the same hardware sprite slots to display multiple logical sprites on different scanlines by updating VIC-II sprite registers during frame rastering. Updates can be prepared ahead of time (precalculated lists/tables) or handled dynamically in raster interrupt (IRQ) handlers.

## Methods
- Method 1 — write registers just before the new sprite starts:
  - Perform VIC-II sprite register writes shortly before the Y position where the next logical sprite must appear (i.e., just before its first visible scanline).
  - Commonly used when you calculate target Y positions in advance and schedule writes aligned to those upcoming scanlines.

- Method 2 — write registers just after the old sprite ends:
  - Update the physical sprite registers immediately after the previous sprite's last visible scanline has finished.
  - Useful when you trigger writes based on the actual end of a sprite's display window (for example when relying on runtime detection or when the sequence of visible sprites is discovered during rastering).

- Precalculated vs on-the-fly:
  - Precalculated: compute which physical sprite slots map to which logical sprites and the raster timings in advance; the raster IRQ simply steps through the schedule and performs writes at known times.
  - On-the-fly: make decisions inside the raster IRQ during the frame, choosing which sprite registers to overwrite based on current state; this can reduce memory for schedules but increases IRQ complexity/time pressure.

- Implementation note (conceptual): either method can be used with raster IRQs to trigger the register writes; choice depends on programmer preference, IRQ budget, and complexity of the sprite layout.

## Key Registers
- $D000-$D02E - VIC-II - all sprite registers and related VIC-II registers (sprite X/Y positions, pointers, enable/priority, etc.)

## References
- "write_registers_just_before_new_sprite" — expands on method 1: write shortly before new sprite Y
- "write_registers_just_after_old_sprite" — expands on method 2: write right after previous sprite display