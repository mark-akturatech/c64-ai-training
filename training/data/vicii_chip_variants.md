# C64 PAL/NTSC Raster Timing Reference — VIC-II (656x / 856x) Chip Variants

**Summary:** VIC-II chip variants (6567/6569/6572/6573 and 8562/8564/8565/8566/8569) with video standard (NTSC/PAL), VIC cycles per raster line, total raster lines per frame, and associated CPU clock (Hz). Searchable terms: VIC-II, raster lines, cycles/line, CPU Clock, $D012 (raster register).

## Overview
This chunk lists VIC-II (MOS 656x / 856x family) variants and their principal raster timing parameters as reported: cycles per raster line (VIC dot clocks), total raster lines per frame, and the CPU clock frequency used in those systems. Use these values when mapping raster-counter behavior (hardware raster register $D012) to timing, calculating frame durations, or comparing visible area/blanking differences between NTSC and PAL chips.

Notes:
- "Cycles/Line" is the VIC-II's internal cycle/dot count per raster line (the unit used by the chip for video timing).
- "Raster Lines" is the total number of scanlines per frame (the raster counter $D012 wraps at this count).
- "CPU Clock (Hz)" is the system CPU frequency associated with the particular chip/system combination.
- Different chip revisions and system designs produce small but important differences in cycles/line and total lines (affecting frame rate, raster interrupts, and visible coordinate offsets).

## Source Code
```text
Chip Model   | System          | Video Standard | Cycles/Line | Raster Lines | CPU Clock (Hz)
-------------|-----------------|----------------|-------------|--------------|---------------
6567R56A     | C64 (early)     | NTSC-M         | 64          | 262          | 1,022,727
6567R8       | C64, SX-64      | NTSC-M         | 65          | 263          | 1,022,727
6569         | C64, SX-64      | PAL-B          | 63          | 312          | 985,248
6572         | C64             | PAL-N (Drean)  | 65          | 312          | 1,023,440
6573         | C64             | PAL-M          | 65          | 263          | 1,022,727
8562         | C64C            | NTSC           | 65          | 263          | 1,022,727
8564         | C128            | NTSC           | 65          | 263          | 1,022,727
8565         | C64C            | PAL-B          | 63          | 312          | 985,248
8566         | C128            | PAL-B          | 63          | 312          | 985,248
8569         | C128            | PAL-N          | 65          | 312          | 1,023,440
```

## References
- "frame_timing_comparison" — expands on detailed timing differences (clocks, dots, fps) between VIC-II variants
- "display_window_coordinates" — expands on how different chip variants affect visible coordinate offsets and blanking
