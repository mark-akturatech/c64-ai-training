# VIC-II (graphics chip) overview — raster-timing quirks and demo effects

**Summary:** VIC-II (the C‑64 graphics chip) contains hardware quirks and timing-sensitive behavior that demo coders use to create unique effects; raster-timed writes to registers such as $D012, $D020 and $D021 are central to these techniques.

## Overview
The VIC-II exposes behavior that can be considered bugs or useful features depending on intent. Many demo effects on the C‑64 rely on exploiting these behaviors rather than following a formal specification: precisely-timed changes to VIC registers produce visual results that cannot be replicated by higher-level routines.

Most classic demo techniques depend on tight synchronization with the raster beam and careful single-cycle-aware code placement so that writes hit the video hardware at the exact visible scanline and pixel times required.

## Raster-timing and register writes
- Raster timing is used as the primary synchronization point for visual effects. The VIC raster counter ($D012) is commonly used to detect the current scanline for synchronization (see referenced "d012_raster_register").
- Border/background changes: changing $D020 and/or $D021 at specific raster positions produces raster bars and other split-screen color effects. These writes are timing-sensitive — if a write occurs too early or too late relative to the beam, the effect will flicker or fail.
- Contrast with systems that provide a display list/copper: on systems with a hardware list (e.g., Amiga copper), per-scanline changes are simpler; on the C‑64 you must schedule CPU writes precisely to match the raster, often inside IRQs or cycle-exact raster loops.

## Key Registers
- $D012 - VIC-II - Raster line counter (used for raster timing/synchronization)
- $D020-$D021 - VIC-II - Border and background color registers (timing-sensitive writes for raster bars and split-screen color changes)

## References
- "d012_raster_register" — expands on raster timing and $D012  
- "raster_bars_timing" — expands on creating raster bars by changing $D020/$D021

## Labels
- D012
- D020
- D021
