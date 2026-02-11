# $D012 — Raster Compare Register (VIC-II)

**Summary:** Writing to $D012 (VIC-II) sets the Raster Compare value used for raster interrupts; the raster compare is 9-bit — the low 8 bits live in $D012 and the 9th (MSB) is Bit 7 of $D011. Forgetting the high bit causes 256-line errors and missed interrupts.

## Raster compare and raster-interrupt behavior
- Writing to $D012 programs the raster line number that the VIC-II will compare against during display. When the raster interrupt is enabled, the VIC-II asserts a maskable interrupt each time the electron beam reaches that scan line.
- Using the raster-compare interrupt is preferable to busy-polling the raster register: polling requires continuous reads of the current raster, whereas the interrupt method invokes your routine when the match occurs.
- The raster compare is nine bits wide. $D012 contains only the low 8 bits; the 9th bit (bit 8 of the raster value) is stored as Bit 7 of $D011 (Control Register 1). You must set and read that bit when working with lines >= 256.
- Common pitfall: assuming the high bit of the raster defaults to 0 can produce results off by 256. Example from source: early programs assumed $D011 bit 7 = 0; a later Kernal initialized that bit to 1, so code intending to set raster 150 ended up comparing against 406 (150 + 256) and no interrupt occurred because scan line numbers do not reach that value.

## Key Registers
- $D012 - VIC-II - Raster Compare Register (low 8 bits)
- $D011 - VIC-II - Control Register 1 — Bit 7 is the high (9th) bit of the raster compare
- $D01A - VIC-II - Interrupt Mask Register — enables/disables raster interrupt (see for enabling raster IRQ and vectors)

## References
- "d01a_irqmask_and_raster_interrupts" — expands on enabling raster interrupts and using vectors

## Labels
- D012
- D011
- D01A
