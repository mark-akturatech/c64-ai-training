# VIC-II: Doubled text lines when a Bad Line is asserted between cycles 54–57

**Summary:** Describes the VIC-II (MOS 6567/6569) behavior where asserting a Bad Line Condition during cycles 54–57 of the last raster line of a text character row causes the internal Row Counter (RC) to be incremented again (overflowing to 0) and the previous text line to be displayed twice, with no new video matrix fetch.

## Doubled text lines (behavior)
The normal text-line display completes after 8 raster lines: when RC = 7, the VIC-II sequencer transitions to the idle state in cycle 58 of that last raster line. If a Bad Line Condition is asserted during cycles 54–57 of that same last raster line, the sequencer remains in the display state instead of going idle. As a result the internal Row Counter (RC) is incremented once more and overflows to 0.

Because the RC overflow occurs while the sequencer stays in display mode, the next raster line starts displaying the previous character row again. No new video matrix data is fetched for that new raster line, so the previous text line is shown twice (duplicated on screen).

Key technical points preserved:
- Timing window: Bad Line asserted between cycles 54–57 of the last raster line.
- Normal termination: sequencer would go idle in cycle 58 when RC = 7.
- Effect: sequencer remains in display state, RC is incremented and overflows to 0.
- Consequence: no new video matrix reads; previous text line is displayed again.

## References
- "bad_lines" — timing window where asserting Bad Line extends display of previous text line