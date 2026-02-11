# Minimal C64 Datasette Loader — disable VIC-II screen and interrupts

**Summary:** Example 6502 snippet that disables interrupts (SEI) and clears the screen enable bit (bit 4) in VIC-II register $D011 to stop screen updates (avoiding VIC-II cycle stealing), then polls the VIC-II raster register $D012, waiting for a new screen frame (raster line 0) before proceeding. Searchable terms: $D011, $D012, VIC-II, SEI, screen enable bit, cycle stealing.

**Description**
This minimal loader sequence prevents the VIC-II from stealing CPU cycles during time-critical tape I/O by:
- Disabling IRQ/NMI-driven interrupts with SEI to prevent any interrupt handler from preempting the loader.
- Clearing bit 4 in $D011 (the screen enable bit) to disable screen updates that cause the VIC-II to take cycles from the CPU.
- Waiting for the raster ($D012) to wrap to zero (start of a new frame) before continuing, ensuring the screen-disable takes effect cleanly on a frame boundary.

Behavior summary (as implemented by the code):
- `sei` — disable interrupts globally.
- `lda $d011` / `and #$EF` (equivalent to `and #$FF - $10`) — clear bit 4 in $D011 to stop the VIC-II’s screen-update activity.
- `sta $d011` — write back to the VIC-II control register.
- Poll $D012 in a loop (`bne` back to loop) until it reads zero, indicating the raster low byte has wrapped to 0 (new frame).

This approach reduces VIC-II cycle stealing (and associated timing jitter) while the loader performs tight timing operations for tape bit decoding.

## Source Code
```asm
sei
lda $d011
and #$ef        ; disable screen (clear bit 4)
sta $d011
m2: lda $d012
    bne m2      ; wait for new screen (raster low byte = 0)
```

## Key Registers
- $D011 - VIC-II Control Register 1:
  - Bit 7: Most significant bit of the raster counter
  - Bit 6: Extended Color Mode (ECM)
  - Bit 5: Bitmap Mode (BMM)
  - Bit 4: Screen Enable (DEN) — 0: screen disabled, 1: screen enabled
  - Bit 3: Row Select (RSEL)
  - Bits 2-0: Vertical Fine Scrolling (YSCROLL)
- $D012 - VIC-II Raster Counter (low 8 bits) — polled until zero to detect new frame

## References
- "restore_screen_and_turn_off_motor" — restores the screen and handles motor shutdown at end of loading
- [C64-Wiki: 53265 ($D011)](https://www.c64-wiki.com/wiki/53265)
- [C64 Programmer's Reference Guide: Screen Blanking](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_3/page_150.html)
- [C64-Wiki: Cassette Port](https://www.c64-wiki.com/wiki/Cassette_Port)

## Labels
- $D011
- $D012
