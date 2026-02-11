# Open Top and Bottom Border (VIC-II $D011 bit 3)

**Summary:** Toggle bit 3 of VIC-II register $D011 on the last visible text raster ($F8/$F9/$FA) to open the top and bottom border; set the bit back a few lines later to restore normal frames. Terms: $D011, VIC-II, raster $F8/$F9/$FA, $3FFF (VIC page end), sprites-in-border.

## How it works
Set the screen to display 25 text lines by setting bit 3 of $D011. On the final visible text raster line (commonly $F8, $F9 or $FA) clear bit 3. The VIC-II will believe the screen is already in the state that would normally disable the border, and therefore it will not re-enable the upper and lower border — effectively opening them. After a short delay (wait a couple of raster lines), set bit 3 again so the VIC will behave the same way on the next frame.

Important behavior and caveats:
- Sprites can be shown in the opened upper/lower border (and in an opened side border). Normal background graphics (character/tile graphics) cannot be drawn there.
- The last byte in the VIC memory page is also rendered in the border area (in black). On the default VIC memory page this is $3FFF; for other page settings it can be $7FFF, $BFFF, or $FFFF. If that byte is nonzero while your background colour is not black, garbage patterns may appear in the border; this can be used as an effect if desired.
- Timing is crucial: clear bit 3 on the last visible text raster; do not set it back immediately — wait a few raster lines, otherwise the trick will fail for the current frame.
- Conceptually identical techniques allow opening side borders, but side-border opening requires per-line (cycle-accurate) timing.

## Key Registers
- $D011 - VIC-II - Control register: bit 3 selects 25-line screen (set = 25 lines; clear = 24 lines). Use this bit toggle on the last visible text raster to open top/bottom borders.

## References
- "opening_side_border" — expands on side border opening; requires per-line timing and similar concepts

## Labels
- D011
