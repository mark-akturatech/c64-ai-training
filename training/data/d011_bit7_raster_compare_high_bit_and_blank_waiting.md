# VIC-II $D011 bit 7 — High bit of the Raster Compare ($D012)

**Summary:** Describes $D011 bit 7 (VIC-II) which serves as the high-order (ninth) bit of the raster compare value held in $D012, how to test it in machine code using the Negative flag (BPL/BMI), and the recommendation to move sprites during vertical blank to avoid wobble.

## Description
$D011 bit 7 is physically located in the VIC-II control register at $D011 but functions as the high-order extra bit for the raster-compare value whose low 8 bits are in $D012. Together they form the full raster compare value used to trigger raster-based interrupts or synchronization.

Because bit 7 is the sign bit when the $D011 byte is loaded into the accumulator, machine-language code can test it using the Negative flag (BPL/BMI). A common tight loop polls $D011 and branches until the bit indicates the raster is in the off-screen (vertical blank) region, providing a cheap and reliable method to delay changes to the graphics hardware until the display is not being drawn.

Sprites should be repositioned while the raster is off-screen; moving them while their scan lines are being drawn can cause visible wobble.

**[Note: Source numbering is ambiguous — this bit provides the high (ninth) bit of the 9-bit raster-compare value. Some documents label it "bit 8" (zero-based) while others use one-based numbering; the practical effect is that it extends $D012 with a single high bit.]**

## Source Code
```asm
; Typical tight poll loop (assembly)
LOOP    LDA $D011
        BPL LOOP
; Continue once bit7 of $D011 indicates vertical blank (negative flag set/clear as appropriate)
```

```basic
10 WAIT 53265,128  : REM BASIC equivalent, generally slower than machine code
```

```text
; Minimal reference map (for retrieval)
$D011 - VIC-II register (bit fields)
  Bit 7: High-order bit for raster compare (extends $D012)
  Bits 0-6: other VIC-II control/status bits (see full VIC-II docs)

$D012 - VIC-II Raster Compare (low 8 bits)
  Holds low 8 bits of raster scanline number to compare against current raster.
  Combined with $D011 bit 7 to form a 9-bit raster compare value.
```

## Key Registers
- $D011-$D012 - VIC-II - Raster status and raster-compare (bit 7 of $D011 is the high bit extending $D012)

## References
- "d012_raster_compare_register" — expands on how this high bit forms the 9th bit of the raster compare value

## Labels
- D011
- D012
