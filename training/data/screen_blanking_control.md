# VIC-II Screen Blanking via $D011 (53265) — Bit 4

**Summary:** VIC-II control register $D011 (53265) bit 4 controls screen blanking: set (1) = normal display, clear (0) = entire screen shows the border color. Use POKE/PEEK to toggle (AND 239 / OR 16). Turning the screen off slightly speeds the CPU.

## Description
Bit 4 of the VIC-II control register at address $D011 (decimal 53265) is the screen-blanking control. When bit 4 = 1 the display is normal; when bit 4 = 0 the VIC-II outputs the border color for the whole screen (no video data is lost—graphics and memory remain unchanged, simply not shown).

The typical idiom preserves the other bits in $D011 by reading the register with PEEK, modifying only bit 4, and writing it back with POKE:
- Clear bit 4 (blank screen): AND with 239 (decimal) which is 0xEF (clears mask 0x10)
- Set bit 4 (restore screen): OR with 16 (decimal) which is 0x10 (sets mask 0x10)

Note: disabling the screen reduces VIC-II activity and slightly increases available CPU time; programs will run marginally faster while the screen is blanked.

## Source Code
```basic
POKE 53265,PEEK(53265)AND 239
POKE 53265,PEEK(53265)OR 16
```

## Key Registers
- $D011 - VIC-II - Control register (bit 4 / mask $10 = screen blank; 1 = display on, 0 = blank to border)

## References
- "raster_register_usage_and_raster_compare" — expands on screen blanking and changing display during raster operations

## Labels
- D011
