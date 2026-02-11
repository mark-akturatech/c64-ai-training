# MOS 6567/6569 VIC-II: Soft-scrolling with XSCROLL/YSCROLL and timing/dimension table

**Summary:** Describes per-pixel soft-scrolling using XSCROLL/YSCROLL (bits 0–2 of $D011/$D016), required alignment values for common display window sizes (25×40 and 24×38), and a complete timing/dimension table for VIC-II variants 6567R56A, 6567R8 and 6569 including lines, cycles, visible pixels and X-coordinate reference points.

## Soft scrolling (XSCROLL / YSCROLL)
XSCROLL/YSCROLL allow fine (per-pixel) offset of the graphics inside the fixed display window in single-pixel steps from 0..7 to the right and bottom; the display window position itself is unchanged. Use the two registers' low 3 bits to set the fine horizontal/vertical offset.

To keep character/bitmap graphics aligned with the display window for the common display sizes:
- For 25 lines / 40 columns: X/YSCROLL must be 0 and 3 (as specified in the source).
- For 24 lines / 38 columns: X/YSCROLL must both be 7 (as specified in the source).

**[Note: Source may contain an error — the source text maps XSCROLL/YSCROLL to $D011/$D016 respectively. Canonical VIC-II documentation typically lists XSCROLL = bits 0–2 of $D016 (horizontal fine scroll) and YSCROLL = bits 0–2 of $D011 (vertical fine scroll).]**

## VIC-II variants: timing and coordinate explanation
The following tables list for each VIC variant:
- video system,
- total raster lines,
- visible lines,
- cycles per line,
- visible pixels per line,
- first/last vertical blank (vblank) lines,
- the X coordinate chosen as the raster-line reference point ("First X coo. of a line"),
- the first and last visible X coordinates on a raster line.

Why the "first visible X" can numerically come after the "last visible X": the reference point used to mark the beginning of a raster line is the moment the raster IRQ is generated — this does not coincide with X coordinate 0. Within a line X coordinates increase up to $1FF (on 6569 the maximum is $1F7), then wrap to 0. Because of that wrap and the chosen IRQ-based reference point, the numeric order can appear reversed in tables even though it represents continuous positions on the line. See "frame_building_and_coordinate_system" for more on raster-line/cycle/X-coordinate timing.

## Source Code
```text
          | Video  | # of  | Visible | Cycles/ |  Visible
   Type   | system | lines |  lines  |  line   | pixels/line
 ---------+--------+-------+---------+---------+------------
 6567R56A | NTSC-M |  262  |   234   |   64    |    411
  6567R8  | NTSC-M |  263  |   235   |   65    |    418
   6569   |  PAL-B |  312  |   284   |   63    |    403

          | First  |  Last  |              |   First    |   Last
          | vblank | vblank | First X coo. |  visible   |  visible
   Type   |  line  |  line  |  of a line   |   X coo.   |   X coo.
 ---------+--------+--------+--------------+------------+-----------
 6567R56A |   13   |   40   |  412 ($19C)  | 488 ($1E8) | 388 ($184)
  6567R8  |   13   |   40   |  412 ($19C)  | 489 ($1E9) | 396 ($18C)
   6569   |  300   |   15   |  404 ($194)  | 480 ($1E0) | 380 ($17C)
```

## Key Registers
- $D011 - VIC-II - bits 0–2: XSCROLL (per source text; commonly documented as YSCROLL).  
- $D016 - VIC-II - bits 0–2: YSCROLL (per source text; commonly documented as XSCROLL).

**[Note: Source may contain an error — XSCROLL and YSCROLL mapping to $D011/$D016 appears swapped versus common references (canonical mapping: XSCROLL = bits 0–2 of $D016, YSCROLL = bits 0–2 of $D011).]**

## References
- "frame_building_and_coordinate_system" — expands on use of raster line and cycle/X coordinate when specifying VIC memory access timing  
- "rsel_csel_display_window_sizes" — expands on relationship between chosen display window size and necessary scroll alignment values

## Labels
- XSCROLL
- YSCROLL
