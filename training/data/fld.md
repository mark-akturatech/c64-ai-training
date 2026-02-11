# Flexible Line Distance (FLD) — controlling text-line start with YSCROLL

**Summary:** Flexible Line Distance (FLD) utilizes the YSCROLL bits in the VIC-II control register ($D011) to manipulate the occurrence of Bad Lines, allowing precise control over the vertical positioning and spacing of text lines on the screen without altering display memory.

**Flexible Line Distance (FLD)**

The VIC-II initiates the display of each text line upon encountering a Bad Line. By adjusting the YSCROLL value in register $D011, you can influence the Bad Line condition, thereby controlling the raster lines on which Bad Lines occur. This technique enables:

- **Arbitrary Vertical Positioning:** By permitting Bad Lines on selected raster lines, text lines can be displayed at specific vertical positions.
- **Increased Vertical Spacing:** Delaying the next Bad Line allows for greater spacing between text lines, resulting in fewer text lines displayed with idle raster lines in between.
- **Coarse Vertical Scrolling:** Delaying only the first Bad Line shifts the entire text display downward without modifying display memory, facilitating large vertical shifts.

**Example:** Allowing Bad Lines only at raster lines $50, $78, and $A0 results in three text lines displayed at those positions, with the sequencer remaining idle on the lines between.

**Caveats:**

- **Precise Timing Required:** FLD relies on exact control of the Bad Line condition. Understanding the Bad Line condition and its timing is crucial for effective implementation.
- **Vertical Control Only:** FLD affects vertical positioning; horizontal repositioning requires different techniques.

## Source Code

```text
Timing Diagram: Raster Timing and Row-Counter Interaction for YSCROLL Changes

Raster Line:  |  0  |  1  |  2  |  3  |  4  |  5  |  6  |  7  |  8  |  9  | 10  | 11  | 12  | 13  | 14  | 15  | 16  | 17  | 18  | 19  | 20  | 21  | 22  | 23  | 24  | 25  | 26  | 27  | 28  | 29  | 30  | 31  | 32  | 33  | 34  | 35  | 36  | 37  | 38  | 39  |
YSCROLL Value:|  0  |  1  |  2  |  3  |  4  |  5  |  6  |  7  |  0  |  1  |  2  |  3  |  4  |  5  |  6  |  7  |  0  |  1  |  2  |  3  |  4  |  5  |  6  |  7  |  0  |  1  |  2  |  3  |  4  |  5  |  6  |  7  |  0  |  1  |  2  |  3  |  4  |  5  |  6  |  7  |
Bad Line:     |     |     |     |     |     |     |     |  *  |     |     |     |     |     |     |     |  *  |     |     |     |     |     |     |     |  *  |     |     |     |     |     |     |     |  *  |     |     |     |     |     |     |     |  *  |
```

*Note: '*' indicates a Bad Line occurrence.*

## Key Registers

- **$D011**: VIC-II Control Register 1
  - **Bits 0-2 (YSCROLL):** Fine vertical scroll; determines the vertical offset of the screen.
  - **Bit 3 (RSEL):** Selects screen height.
  - **Bit 4 (DEN):** Display enable; controls screen blanking.
  - **Bit 5 (BMM):** Bitmap mode enable.
  - **Bit 6 (ECM):** Extended color mode enable.
  - **Bit 7 (RST8):** Most significant bit of raster line.

## References

- "bad_lines" — expands on FLD and the method of controlling Bad Line occurrence via YSCROLL
- "dma_delay" — covers other techniques to reposition display timing (horizontal) that complement FLD

## Labels
- D011
- YSCROLL
- RSEL
- DEN
- BMM
- ECM
- RST8
