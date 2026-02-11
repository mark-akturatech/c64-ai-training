# $02A6 — PAL/NTSC Flag (C64 RAM Map)

**Summary:** $02A6 is a system RAM flag set at power-on by a raster interrupt test (scan line 311); 0 = NTSC, 1 = PAL. The flag is used to select CIA timer prescaler values so the system IRQ fires every 1/60 second (accounts for slight clock difference between PAL and NTSC).

## Description
At power-up the machine programs a raster interrupt for scan line 311 and checks whether the interrupt occurs. NTSC displays only reach ~262 raster lines per frame, so an interrupt at line 311 will not occur on NTSC hardware; PAL displays do, so the interrupt will occur on PAL hardware.

The result is stored at memory location $02A6:
- 0 = NTSC detected (interrupt did not occur)
- 1 = PAL detected (interrupt occurred)

This flag is consulted by routines that set the CIA timer prescaler values to generate a periodic IRQ approximately every 1/60 second. Because the PAL system clock (system 02) runs slightly slower than the NTSC clock, the prescaler values must be adjusted when $02A6 indicates PAL.

## Key Registers
- $02A6 - System RAM - PAL/NTSC flag set by raster test at power-on; 0 = NTSC, 1 = PAL; used to select CIA timer prescaler for 1/60s IRQ

## References
- "rs232_baud_prescaler" — expands on CLOCK differences and prescaler calculations for NTSC vs PAL