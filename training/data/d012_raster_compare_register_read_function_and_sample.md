# $D012 — RASTE (Raster Compare Register)

**Summary:** $D012 (VIC-II) returns the current raster scan line when read and sets the raster-compare value when written; used for mid-screen timing and raster IRQs (NTSC 0–261, PAL 0–311). High-order raster bit is stored in $D011 bit 7 (see references).

## Description
When read, $D012 reports which raster (horizontal) scan line the VIC-II electron beam is currently scanning. Reading this register lets programs synchronize screen updates to avoid visible tearing or to perform timed mid-screen effects.

When written, $D012 sets the low 8 bits of the raster line to compare against the current raster; matching this value (with the high bit in $D011 as needed) can be used as a raster interrupt source (IRQ mask at $D01A — see references).

Timing and counts:
- NTSC: raster lines numbered 0–261 (262 total); screen updated ~60 Hz.
- PAL: raster lines numbered 0–311 (312 total).
- Visible display lines are a subset (commonly lines 50–249 for NTSC); other lines are off-screen or border.

Typical uses:
- Wait for the beam to be off-screen (read until value past visible area) before performing large screen updates.
- Change colors or screen pointers at a precise raster line to create split-screen effects (example below shows dividing the screen to display all foreground/background text color combinations).

Note: the VIC-II has a 9th raster bit in $D011 bit 7 to extend the raster compare beyond 255 lines (see referenced chunk).

## Source Code
```basic
40 FOR I=49152 TO 49188:READ A:POKE I,A:NEXT:POKE 53280,11
50 PRINT CHR$(147):FOR I=1024 TO I+1000:POKE I,160:POKE I+54272,11:NEXT I
60 FOR I=0 TO 15:FOR J=0 TO 15
70 P=1196+(48*I)+J:POKE P,J+I:POKE P+54272,J:NEXT J,I
80 PRINT TAB(15)CHR$(5)"COLOR CHART":FOR I=1 TO 19:PRINT:NEXT
85 PRINT "THIS CHART SHOWS ALL COMBINATIONS OF   "
86 PRINT "FOREGROUND AND BACKGROUND COLORS.      "
87 PRINT "FOREGROUND INCREASES FROM LEFT TO RIGHT"
88 PRINT "BACKGROUND INCREASES FROM TOP TO BOTTOM"
90 SYS 12*4096
100 DATA 169,90,133,251,169,0,141,33,208,162,15,120,173,17,208,48
105 DATA 251,173,18,208
110 DATA 197,251,208,249,238,33,208,24,105,8,133,251,202,16,233,48,219
```

## Key Registers
- $D012 - VIC-II - Raster Compare register: read = current raster scan line (NTSC 0–261, PAL 0–311); write = low 8 bits of raster line to compare for raster IRQ

## References
- "d011_bit7_raster_compare_high_bit_and_blank_waiting" — covers $D011 bit 7 (high-order raster bit) and blank-waiting behavior
- "d01a_irqmask_and_raster_interrupts" — covers IRQ mask at $D01A and using raster compare as interrupt source

## Labels
- $D012
