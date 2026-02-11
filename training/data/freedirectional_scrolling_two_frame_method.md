# Freedirectional scrolling (Cadaver)

**Summary:** Freedirectional scrolling technique for the C64 that animates hardware scroll registers and splits screen/color memory updates across two alternating frame types; mentions doublebuffering, hidden-screen memory shifts, and allows speeds up to 4 pixels/frame without centering the hardware scroll register when idle.

**Method**

This method alternates two frame types to support smoother, freer-direction movement (up to 4 pixels/frame) without forcing the hardware fine-scroll to be re-centered when idle.

- **Frame type A (movement + precalc)**
  - Add the current scrolling speed to the hardware fine-scroll values.
  - When applying to the hardware scroll, clamp the per-axis fine-scroll to the 0–7 range (do not wrap on the hardware write this frame).
  - Also precalculate the hardware fine-scroll values that will be needed for the following frame by applying the same speed again — this precalc step allows wrapping (i.e., the precalculated value may wrap around 0–7).
  - If the precalculated values do not wrap, no memory shifting is required and the second-frame work can be skipped (only hardware fine-scroll updates were needed).
  - If the precalculated values do wrap, mark that a memory shift is required (to bring new tile/char data into view).

- **Frame type B (memory shifts + swap)**
  - Perform the color-memory shift required by the wrap (color RAM must be adjusted to match shifted screen contents).
  - Shift the visible screen data in the hidden (offscreen) doublebuffer page and draw the new incoming column/row(s) where the wrap occurred.
  - Swap the doublebuffered screen pages.
  - Finally, write the precalculated (wrapped) hardware fine-scroll values into the VIC-II so the display uses them after the swap.

**Notes:**

- Because the algorithm only requires shifting memory when the precalc indicates a wrap, screen shifts happen less frequently than per-pixel movement; however, the two-frame splitting (fine-scroll change vs. memory/color shift + page swap) increases CPU work overall.
- This approach is simpler than full 8-directional scrolling schemes that try to keep the hardware scroll centered, and it supports freer movement directions and variable speeds (the author mentions speeds up to 4 pixels/frame).
- Implementation depends on doublebuffered display pages and use of a hidden screen for safe shifting and drawing before swapping.

## Key Registers

- **Vertical Fine Scroll and Control Register ($D011 / 53265):**
  - **Bits 0–2:** Vertical fine scroll offset (0–7).
  - **Bit 3:** Selects 24-row (0) or 25-row (1) text display.
  - **Bit 4:** Screen blanking control (0 = blank screen).
  - **Bit 5:** Bitmap mode enable (1 = enable).
  - **Bit 6:** Extended color mode enable (1 = enable).
  - **Bit 7:** Most significant bit of raster line for interrupt comparison.

- **Horizontal Fine Scroll and Control Register ($D016 / 53270):**
  - **Bits 0–2:** Horizontal fine scroll offset (0–7).
  - **Bit 3:** Selects 38-column (0) or 40-column (1) text display.
  - **Bit 4:** Multicolor mode enable (1 = enable).

## References

- "scrolling_overview_doublebuffering" — expands on doublebuffering usage
- "screen_memory_shifting_doublebuffered_copying_direction_handling" — expands on how to perform the hidden-screen shifts

## Labels
- D011
- D016
