# Temporary index and PAL/NTSC flag ($02A5-$02A6)

**Summary:** Two KERNAL workspace bytes at $02A5 and $02A6: $02A5 holds a temporary index to the next 40-column line used for screen scrolling; $02A6 is a PAL/NTSC flag set at power-on by a raster interrupt test (raster line 311) and used to select IRQ timer prescaler values so the system IRQ fires once per 1/60 second on both standards.

## Description
$02A5 — Temporary index to the next 40-column line
- Used by screen-scrolling routines to point to the next 40-column line during text scrolling operations. Holds an index (temporary workspace) used while adjusting the screen buffer.

$02A6 — PAL/NTSC detection flag
- On power-up the system programs a raster interrupt at scan line 311 and checks whether the interrupt occurs.
- NTSC screens have 262 raster lines per frame, so the interrupt at line 311 will not occur on NTSC; it will occur on PAL displays (which have more scan lines).
- The test result is stored here: 0 = NTSC, 1 = PAL.
- The flag is read by routines that set the IRQ timer prescaler so the periodic IRQ interval equals 1/60 second on both standards (the PAL system 02 clock runs slightly slower than the NTSC version, so prescaler values differ).

## Key Registers
- $02A5-$02A6 - System RAM / KERNAL workspace - $02A5: temporary 40-column-line index for screen scrolling; $02A6: PAL/NTSC detection flag (0 = NTSC, 1 = PAL)

## References
- "baudoftime_prescaler" — prescaler and system-clock adjustments for PAL vs NTSC timing
