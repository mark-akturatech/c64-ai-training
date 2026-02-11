# Screen blanking via YSCRL (VIC-II)

**Summary:** Clear bit 4 of the YSCRL register ($D011) to blank the entire screen to the border color; set bit 4 to turn the screen back on. Blanking does not alter screen memory and slightly speeds execution because the VIC-II fetches no display data while blanked.

**Blanking the screen**

Clearing bit 4 of YSCRL forces the VIC-II to render the whole display area in the current border color (screen blanked). Setting bit 4 returns normal display rendering. The operation is non-destructive: screen memory and character/tile data remain unchanged while blanked. Because the VIC-II halts display fetches while the screen is blanked, programs can run marginally faster during the blanked period.

Note: YSCRL also contains fine Y-scroll bits (scroll fine control), so the register serves both blanking and vertical scroll functions.

## Source Code

To clear bit 4 of the YSCRL register ($D011) and blank the screen:

```assembly
LDA $D011
AND #%11101111  ; Clear bit 4
STA $D011
```

To set bit 4 of the YSCRL register and restore the screen:

```assembly
LDA $D011
ORA #%00010000  ; Set bit 4
STA $D011
```

In BASIC, to clear bit 4 and blank the screen:

```basic
POKE 53265, PEEK(53265) AND 239
```

To set bit 4 and restore the screen:

```basic
POKE 53265, PEEK(53265) OR 16
```

## Key Registers

- **YSCRL Register ($D011 / 53265):**

  - **Bit 7:** Vertical raster IRQ latch (V)
  - **Bit 6:** Extended background color mode (B)
  - **Bit 5:** Bitmap mode (B)
  - **Bit 4:** Screen blanking control (1 = screen on, 0 = screen blanked)
  - **Bits 3-0:** Fine Y-scroll value (0-15)

## References

- "hardware_scrolling_and_registers" — expands on YSCRL and its fine-scroll bits
- Commodore 64 Programmer's Reference Guide: Appendix G - VIC Chip Register Map
- Commodore 64 User's Guide

## Labels
- YSCRL
