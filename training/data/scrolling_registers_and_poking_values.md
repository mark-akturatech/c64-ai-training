# Commodore 64 — VIC-II fine-scroll registers ($D011, $D016)

**Summary:** Describes VIC-II fine X and Y scroll bits (bits 2–0 of $D016 and $D011), required display modes (38-column for X, 24-row for Y), covered-area placement rules for inserting new text when scrolling left/right/up/down, and BASIC POKE/PEEK examples (POKE 53270, POKE 53265).

## Scroll bits and usage
- Fine scroll fields:
  - X fine scroll: bits 2–0 of VIC-II control register at 53270 ($D016). Values 0..7 select the X sub-column position.
  - Y fine scroll: bits 2–0 of VIC-II control register at 53265 ($D011). Values 0..7 select the Y sub-row position.
- When writing these registers, preserve the other bits (e.g., screen enable, mode bits). Use a mask that clears bits 2–0 then add the desired 0..7 value.
- Typical mask used in examples: AND 248 (decimal) — this clears bits 2..0 (248 = 0b11111000).

## Display-mode requirements and covered-area placement
- Horizontal (X) scrolling:
  - VIC-II must be in 38-column mode so there is space for incoming character data to appear offscreen and scroll into view (screen memory still contains 40 columns, but only 38 visible).
  - When scrolling LEFT, place new data on the RIGHT side (so it scrolls into view from the right).
  - When scrolling RIGHT, place new data on the LEFT side.
  - There are covered areas on both left and right sides of the visible window to host the incoming data while fine-scrolling.
- Vertical (Y) scrolling:
  - VIC-II must be in 24-row mode.
  - When scrolling UP, put the new data in the LAST row (bottom) so it scrolls upward into view.
  - When scrolling DOWN, put the new data in the FIRST row (top).
  - Unlike X scrolling which has covered areas on both sides, Y scrolling provides only one covered row at a time.
  - Example behavior noted: Y register = 0 covers the first line (ready for new data); Y register = 7 covers the last row.

## Source Code
```basic
10 REM Fine-scroll X example (decimal addresses)
20 X = 3  : REM X from 0..7
30 POKE 53270,(PEEK(53270) AND 248)+X

40 REM Fine-scroll Y example (decimal addresses)
50 Y = 5  : REM Y from 0..7
60 POKE 53265,(PEEK(53265) AND 248)+Y
```

```text
Register bit maps (focus on bits 2..0)

$D011 (53265) VIC-II control register:
  bit7 .. bit3 | bit2 bit1 bit0
  other fields  |  Y-scroll (0..7)

$D016 (53270) VIC-II control register:
  bit7 .. bit3 | bit2 bit1 bit0
  other fields  |  X-scroll (0..7)
```

## Key Registers
- $D011 - VIC-II - fine Y scroll (bits 2–0); preserve other bits when writing
- $D016 - VIC-II - fine X scroll (bits 2–0); preserve other bits when writing

## References
- "smooth_scrolling_overview_and_steps" — full smooth scrolling procedure (expanded steps)

## Labels
- D011
- D016
