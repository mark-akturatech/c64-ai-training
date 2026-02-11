# VIC-II Linecrunch: Aborting a Bad Line Mid-Way to Compress Text Lines

**Summary:** Technique for the MOS 6567/6569 (VIC-II) where the Bad Line Condition is negated before cycle 14 to abort an in-progress Bad Line; effects involve RC (row counter) not being reset, VCBASE being loaded from VC at cycle 58 (effectively +40 when VC was incremented during the line), vertical “crunching” of text lines, and fast vertical scrolling without moving matrix memory (wraps at 1024).

**Linecrunch — Behavior and Effects**

**Description:**
- Linecrunch is achieved by negating the VIC-II Bad Line Condition inside a Bad Line that has already begun, specifically before cycle 14 of that raster line.
- Because the line is already in the graphics/display state when aborted:
  - The graphics character data for that line is displayed.
  - The internal row counter (RC) is not reset to 0; it remains at its current value (commonly 7 if it was the last subline of a character row).
- At cycle 58 of that raster line, the VIC-II sequencer enters the idle state and loads VCBASE from the current VC. If VC has been incremented during the line (because the line was in display state and g-accesses occurred), VCBASE will be loaded with a value that is effectively increased by the number of g-access increments (for a text mode row, this amounts to +40).
- The RC does not overflow—it stays at 7 in the described case—so the effect is that the display advances to the next text row while only showing the last raster subline of the original line. In other words, a full text line is reduced to its last raster line on-screen.

**Consequences and Uses:**
- Crunching a single text line reduces that text line to one raster line (the last subline), advancing VCBASE by 40 so the next matrix row is shown immediately.
- Repeating the procedure every raster line:
  - RC stays at 7 each raster line; no character-memory (c-) accesses (no g-accesses that would normally occur next frame).
  - VCBASE is incremented by 40 every raster line.
  - VCBASE will eventually exceed the 1000-byte visible matrix region and cause the VIC to display the final normally-invisible 24 bytes of the 1K matrix (this area includes sprite pointer bytes).
  - When VCBASE reaches 1024, it wraps back to 0.
- Use-case: very fast vertical scrolling (upwards) of screen contents without physically moving bytes in screen RAM (matrix). This resembles scrolling-down behavior obtained with FLD but operates by manipulating Bad Lines and VC/VCBASE instead.
- Visual caveats: crunched lines accumulate at the top edge of the screen and appear awkward; one workaround is to switch to an invalid graphics mode to blank those lines.

**Mechanics Summary (Cycle- and Register-Related):**
- Abort timing: negate Bad Line Condition before cycle 14 of an already-begun Bad Line.
- Sequencer load: at cycle 58, the sequencer idles and VCBASE := VC.
- Typical numeric effects: VCBASE increases by 40 per crunched line (40 columns in text matrix); VCBASE wraps at 1024 addresses.
- RC behavior: RC is not reset when aborting—it can remain at 7 and thus avoid c-accesses/character fetches.

**Limitations and Side Effects:**
- Crunched lines pile up visually at the top border.
- Manipulation requires precise control of Bad Line Condition (commonly via YSCROLL and matrix alignment).
- The effect relies on internal VIC registers RC, VC, and VCBASE (internal, not memory-mapped) and exact raster/cycle timing.

## Source Code

**Detailed Timing Diagram of VIC-II Cycles:**

The following ASCII diagram illustrates the timing of a raster line in the VIC-II, highlighting cycles 14 and 58, which are critical in the Linecrunch technique.

```text
Cycle:    1   2   3   ...  14  ...  58  ...  63
          |   |   |        |        |        |
ø0:    __/‾\_/‾\_/‾\_/‾\_/‾\_/‾\_/‾\_/‾\_/‾\_/‾\_
        |   |   |   |   |   |   |   |   |   |   |
        |   |   |   |   |   |   |   |   |   |   |
        |   |   |   |   |   |   |   |   |   |   |
        |   |   |   |   |   |   |   |   |   |   |
        |   |   |   |   |   |   |   |   |   |   |
        |   |   |   |   |   |   |   |   |   |   |
        |   |   |   |   |   |   |   |   |   |   |
        |   |   |   |   |   |   |   |   |   |   |
        |   |   |   |   |   |   |   |   |   |   |
        |   |   |   |   |   |   |   |   |   |   |
        |   |   |   |   |   |   |   |   |   |   |
        |   |   |   |   |   |   |   |   |   |   |
        |   |   |   |   |   |   |   |   |   |   |
        |   |   |   |   |   |   |   |   |   |   |
        |   |   |   |   |   |   |   |   |   |   |
        |   |   |   |   |   |   |   |   |   |   |
        |   |   |   |   |   |   |   |   |   |   |
        |   |   |   |   |   |   |   |   |   |   |
        |   |   |   |   |   |   |   |   |   |   |
        |   |   |   |   |   |   |   |   |   |   |
        |   |   |   |   |   |   |   |   |   |   |
        |   |   |   |   |   |   |   |   |   |   |
        |   |   |   |   |   |   |   |   |   |   |
        |   |   |   |   |   |   |   |   |   |   |
        |   |   |   |   |   |   |   |   |   |   |
        |   |   |   |   |   |   |   |   |   |   |
        |   |   |   |   |   |   |   |   |   |   |
        |   |   |   |   |   |   |   |   |   |   |
        |   |   |   |   |   |   |   |   |   |   |
```

In this diagram:
- Cycle 14 is the point before which the Bad Line Condition must be negated to abort the Bad Line.
- Cycle 58 is when the VIC-II sequencer enters the idle state and loads VCBASE from the current VC.

**Method for Negating the Bad Line Condition:**

To negate the Bad Line Condition, adjust the YSCROLL bits in register $D011 to ensure that the current raster line does not satisfy the Bad Line Condition. This requires precise timing to modify $D011 before cycle 14 of the raster line.

Example code sequence:

```assembly
; Assume A contains the desired YSCROLL value (0-7)
lda $d011
and #%11111000       ; Clear YSCROLL bits
ora A                ; Set new YSCROLL value
sta $d011            ; Update $D011 before cycle 14
```

This sequence should be executed with cycle precision to ensure it occurs before cycle 14 of the target raster line.

**Invalid Graphics Modes for Blanking Piled-Up Crunched Lines:**

Switching to an invalid graphics mode can blank the crunched lines. The VIC-II has several invalid modes that result in a black screen:

- **Mode 5:** ECM=1, BMM=0, MCM=1
- **Mode 6:** ECM=1, BMM=1, MCM=0
- **Mode 7:** ECM=1, BMM=1, MCM=1

Setting these bit combinations in registers $D011 and $D016 will result in a blank display, effectively hiding the crunched lines.

## Key Registers

- **$D011** - VIC-II Control Register 1 (contains YSCROLL / fine vertical scroll bits used to influence Bad Line alignment)
- **$D016** - VIC-II

## Labels
- D011
- D016
