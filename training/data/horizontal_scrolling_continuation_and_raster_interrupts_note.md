# Fine and Coarse Scrolling (wrap 0↔7) — VIC-II Horizontal Scroll Bits and Raster Isolation

**Summary:** Explains VIC-II fine (3-bit) horizontal scrolling in $D016 (decimal 53270), the necessity of coarse scrolling when the fine-scroll value wraps from 7 to 0, and the use of raster interrupts to confine scrolling to specific screen regions.

**Fine and Coarse Scrolling**

The VIC-II provides three horizontal fine-scroll bits (0–7) that shift the display by individual pixel columns. After the display has moved over seven dots (fine-scroll = 7), the fine-scroll value wraps back to 0; to continue the apparent smooth motion, you must perform a coarse scroll at that wrap point. A coarse scroll is done by shifting each byte of display data on every affected scan line one character position (overwriting the last character and inserting a new byte at the opposite end).

Because shifting entire character rows requires moving many bytes each frame, only machine-language code can do this fast enough to maintain smooth motion. The provided BASIC listing demonstrates the combined fine+coarse effect but is only illustrative (too slow for production-quality smooth scrolling).

Changing the three horizontal fine-scroll bits affects the whole screen. To scroll only a portion (a scroll zone), use raster interrupts (see $D01A) to:

- Set up a raster interrupt at the start of the zone.
- Change the fine-scroll bits while that zone is being drawn.
- Restore the scroll bits when the zone has passed.

This isolates changes to the intended region; without raster timing, changing the scroll bits alters the entire display.

## Source Code

```basic
10 POKE 53281,0:PRINT CHR$(5)CHR$(147):FOR I=1 TO 5:PRINT CHR$(17):NEXT
20 FOR I=1 TO 30
30 PRINT TAB(I-1)CHR$(145)SPC(10)CHR$(145)
40 WAIT 53265,128:POKE 53270,PEEK(53270)AND 248:PRINT TAB(I)"AWAY WE GO"
50 FOR J=1 TO 7
60 POKE 53270,(PEEK(53270)AND 248)+J
70 FOR K=1 TO 30-I
80 NEXT K,J,I:RUN
```

Notes:

- The listing demonstrates toggling the three horizontal fine-scroll bits via `POKE 53270` (decimal, $D016) and uses `WAIT 53265,128` to synchronize; it is an illustrative BASIC demo and not optimized for smooth raster-timed scrolling.

## Key Registers

- **$D016 (53270)**: VIC-II Control Register 2
  - **Bits 0–2**: Horizontal fine-scroll value (0–7)
  - **Bit 3**: Column select (0 = 40 columns, 1 = 38 columns)
  - **Bit 4**: Multicolor mode enable (0 = standard, 1 = multicolor)
  - **Bits 5–7**: Unused

- **$D011 (53265)**: VIC-II Control Register 1
  - **Bit 7**: Raster compare bit 8
  - **Bit 6**: Extended background color mode enable
  - **Bit 5**: Bitmap mode enable
  - **Bit 4**: Screen enable
  - **Bit 3**: Row select (0 = 24 rows, 1 = 25 rows)
  - **Bits 0–2**: Vertical fine-scroll value (0–7)

- **$D01A (53274)**: VIC-II Interrupt Enable Register
  - **Bit 0**: Raster interrupt enable
  - **Bit 1**: Sprite-background collision interrupt enable
  - **Bit 2**: Sprite-sprite collision interrupt enable
  - **Bit 3**: Light pen interrupt enable
  - **Bits 4–7**: Unused

## References

- "d01a_irqmask_and_raster_interrupts" — Use raster interrupts to limit scroll zone

## Labels
- D016
- D011
- D01A
