# VIC-II $D011 bit 4 (DEN) — Display Enable

**Summary:** DEN ($D011 bit 4) enables text/bitmap display on the VIC-II; it gates Bad Line generation and the vertical border flip‑flop reset. DEN must be set for at least one cycle during raster line $30 for Bad Line Conditions to be possible; clearing DEN prevents Bad Lines and forces the screen to show the border color only.

## Display Enable (DEN)
DEN is the VIC-II's display enable control (register $D011, bit 4). Its effects are:

- Enables text/bitmap graphics when set; normally set in typical operation.
- Bad Line gating: A Bad Line Condition (which allows character matrix fetches and CPU C‑ and G‑bus accesses) can only occur if DEN has been logic-1 for at least one VIC cycle somewhere on raster line $30. If DEN is never set during that raster line, Bad Line Conditions will not occur.
- Vertical border reset: The DEN bit drives the reset input of the VIC-II vertical border flip‑flop. Clearing DEN deactivates that reset input, so the upper/lower border is not turned off (the screen remains showing border area).

Practical consequences (behavioral summary):
- Clearing DEN normally prevents Bad Lines (so VIC DMA for character rows is suppressed) and causes the visible screen area to display the configured border color only.
- Re‑asserting DEN at the required time (at least one cycle during raster $30) is required to re‑enable Bad Line processing and regular text/bitmap display.

## Key Registers
- $D011 - VIC-II - DEN (Display Enable) bit 4 — enables text/bitmap display; required at least one cycle in raster line $30 for Bad Line Conditions; clearing disables Bad Lines and deactivates vertical border flip‑flop reset.

## References
- "bad_lines" — expands on DEN's role in allowing Bad Line Conditions (must be set at least once in raster line $30)
- "hyperscreen" — expands on using DEN to influence border/Bad Line behavior for effects

## Labels
- DEN
