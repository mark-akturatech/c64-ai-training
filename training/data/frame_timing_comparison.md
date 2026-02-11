# C64 VIC-II PAL/NTSC Raster Timing Comparison (6567R56A, 6567R8, 6569)

**Summary:** Side-by-side timing parameters for VIC-II variants 6567R56A (early NTSC), 6567R8 (NTSC), and 6569 (PAL): system clock, dot/color clocks, cycles per raster line, total/visible raster lines, cycles per frame, frames per second, and pixels per line.

## Frame Timing Comparison
This chunk lists the primary raster/timing parameters that differ between early NTSC (6567R56A), standard NTSC (6567R8) and PAL (6569) VIC‑II chips. Key differences:
- System clock and dot/color clock frequencies differ (affecting pixel timing and color subcarrier).
- Cycles per raster line and total raster lines/frame vary, which changes cycles per frame and resulting refresh rate (frames per second).
- Visible raster lines and pixels per line show the effective visible resolution differences between NTSC and PAL chips.
- 6567R56A is rare (found only in very early NTSC C64s); 6567R8 is the standard NTSC VIC-II; 6569 is the standard PAL VIC-II.

## Source Code
```text
                            6567R56A      6567R8        6569
                            (NTSC early)  (NTSC)        (PAL)
                            ------------- ------------- -------------
System clock (Hz):          1,022,727     1,022,727     985,248
Dot clock (MHz):            8.18          8.18          7.88
Color clock (MHz):          14.31818      14.31818      17.734472
Cycles per raster line:     64            65            63
Total raster lines/frame:   262           263           312
Visible raster lines:       234           235           284
Cycles per frame:           16,768        17,095        19,656
Frames per second (Hz):     ~60.99        ~59.83        ~50.12
Pixels per line (total):    512           520           504

Note: The 6567R56A is rare and found only in very early NTSC C64s. The 6567R8
is the standard NTSC VIC-II. The 6569 is the standard PAL VIC-II.
```

## References
- "vicii_chip_variants" — expands on list of VIC-II chip models and basic specs  
- "raster_time_basics" — expands on how cycles/line and lines/frame translate to cycles per frame and refresh rate