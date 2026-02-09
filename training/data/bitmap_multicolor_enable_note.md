# Multicolor Bitmap Mode — Bit 4 of $D016 (VIC-II)

**Summary:** Multicolor bitmap mode is enabled by setting Bit 4 of VIC-II control register $D016 (53270); in bitmap graphics mode this produces 4 colors per 8×8 cell, at reduced horizontal resolution (160 pixels) and changes plotting rules (byte addressing and bit-pairs).

## Description
- Multicolor bitmap is a variant of the VIC-II bitmap graphics mode. It is only active while in bitmap mode and when Bit 4 of $D016 (53270) is set.
- Effect: each 8×8 character cell can use four colors (instead of two in standard bitmap mode). This is achieved by interpreting bitmap data as pairs of bits (bit-pairs) rather than single bits, halving horizontal resolution from 320 to ~160 pixels.
- Plotting rules change: bitmap bytes are interpreted as bit-pairs; addressing and pixel plotting must account for the reduced horizontal resolution and the 8×8 cell grouping.
- The multicolor bit is often referenced in related topics such as horizontal fine scrolling behavior and bitmap addressing/plotting rules.

## Source Code
```text
There is a slightly lower resolution bitmap graphics mode available
which offers up to four colors per 8 by 8 dot matrix.  To enable this
mode, you must set the multicolor bit (Bit 4 of 53270 ($D016)) while
in bitmap graphics mode.  For more information on this mode, see the
entry for the multicolor enable bit.

Note: Multicolor bitmap reduces horizontal resolution to 160 and
changes plotting rules (byte addressing and bit-pairs).
```

## Key Registers
- $D016 ($D016 / 53270) - VIC-II - Bit 4: Multicolor enable (active only in bitmap mode; interprets bitmap data as bit-pairs, producing 4 colors per 8×8 cell and reducing horizontal resolution to 160)

## References
- "scrolx_horizontal_fine_scrolling" — expands on Bit 4 of $D016 controls multicolor
- "bitmap_addressing_and_plotting" — expands on plotting rules change for multicolor mode (byte addressing and bit-pairs)