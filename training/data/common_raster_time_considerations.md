# C64 PAL/NTSC Raster Timing — Practical Considerations

**Summary:** Practical raster-timing guidance for VIC-II ($D000-$D02E) based routines: SID music timing (3,000–8,000 cycles/frame), VBlank work, raster splits, bad-line jitter compensation, double-IRQ technique, and sprite multiplexing and DMA cycle-stealing considerations.

## Music / Sound Routines
- SID music players typically require ~3,000–8,000 CPU cycles per frame; schedule the player once per frame.
- Call music update during VBlank or while the raster is stable to avoid audible glitches and visual interference.
- Digi (sample) playback can need substantially more CPU time; in extreme cases disable the VIC-II (blank the display) to free maximum cycles for continuous sample output.

## Raster Effects
- Raster splits (changing VIC-II registers mid-screen) require cycle-accurate timing relative to the raster beam (see VIC-II raster counter $D012).
- Use a stable raster IRQ setup for flicker-free mid-screen register changes.
- Bad lines introduce timing jitter when the VIC-II fetches video data; routines must detect/compensate for bad-line occurrences to remain cycle-exact.
- The "double IRQ" technique (set up two IRQs per frame at known offsets) is commonly used to achieve cycle-exact timing for mid-screen effects.

## Screen Updates
- Perform screen RAM and character/tile table updates during VBlank or border time to avoid corrupting on-screen data.
- Horizontal/vertical scrolling routines benefit from the additional CPU cycles available in the border; schedule costly work there when possible.
- PAL systems have a longer VBlank interval than NTSC, providing more safe time for screen manipulation per frame.

## Sprite Multiplexing
- Hardware limitation: up to 8 sprites can appear on any single raster line.
- To show more than 8 sprites on-screen, reposition sprites on different raster lines across the frame (multiplexing); this requires precise timing for each reposition.
- Each reposition must be synchronized to the raster and account for VIC-II sprite DMA cycle stealing (sprite DMA steals CPU cycles during sprite fetches), which affects cycle budgets for time-critical code.
- Plan timing so sprite DMA windows do not collide with other cycle-critical operations (raster splits, sample output, etc.).

## Source Code
(omitted — no assembly/BASIC listings or register maps provided in source)

## Key Registers
- $D000-$D02E - VIC-II - raster counter, control, IRQ and sprite registers (includes $D012 raster counter and $D019 IRQ status/control)

## References
- "raster_time_basics" — how raster timing maps to per-frame CPU budgets and scheduling
- "sprite_dma_timing" — details on VIC-II sprite DMA cycle stealing and multiplexing timing
- "bad_lines" — analysis of bad-line behaviour and techniques to compensate jitter