# Detecting PAL vs NTSC by VIC-II Raster Counter

**Summary:** Software detection uses the VIC-II raster counter ($D012) plus the 9th bit in $D011 (VIC-II) to form a 9-bit raster line value; compare that to known maxima (PAL $137, NTSC $106/$105) to distinguish PAL vs NTSC.

## Detection method
Read the VIC-II raster counter and observe its maximum value during a frame:
- Read $D012 for the low 8 bits of the raster line.
- Read bit 7 of $D011 for the 9th (high) bit and combine with $D012 to form a 9-bit raster line number.
- Wait until the counter reaches its maximum value for the current video system; the maximum identifies the system:

Maximum raster line values:
- PAL: 311 (decimal) = $137
- NTSC (6567R8): 262 (decimal) = $106
- NTSC (6567R56A): 261 (decimal) = $105

The method is: sample/monitor the raster value across a frame and detect which of the above maxima is reached.

## Why detection is important
Knowing PAL vs NTSC lets software:
- Adjust music/player timing (50 Hz vs 60 Hz) and tempo routines.
- Adapt raster effects and interrupt placement to correct line counts.
- Ensure smooth horizontal/vertical scroll routines across different frame heights.
- Set correct CIA-based timer values (CIA timers driven by system frame timing).

## Key Registers
- $D012 - VIC-II - Raster counter (low 8 bits)
- $D011 - VIC-II - Control register (bit 7 = high/9th raster bit)

## References
- "frame_timing_comparison" — expected maximum raster counts and frame rates per system  
- "display_window_coordinates" — visible area and blanking differences between PAL and NTSC

## Labels
- D012
- D011
