# VIC-II hardware fine scrolling — $D011 (YSCRL) and $D016 (XSCRL)

**Summary:** VIC-II hardware fine scrolling allows smooth X/Y motion over an 8-pixel range using the lower 3 bits of $D011 (YSCRL) and $D016 (XSCRL). Because those registers contain other VIC control bits, changes require a read‑modify‑write that masks out the lower three bits and ORs in the new 0–7 pixel value.

## Scrolling
The VIC-II can perform fine (pixel‑level) scrolling within an 8‑pixel range in X and/or Y, offloading pixel‑level movement from the CPU. Use the low 3 bits of the two VIC registers to set the scroll offset (0–7 pixels) independently for vertical and horizontal scrolling.

- Y fine scroll: lower 3 bits of $D011 (YSCRL).
- X fine scroll: lower 3 bits of $D016 (XSCRL).

Both registers also contain other control bits used by the VIC-II, so you must perform a read‑modify‑write when updating the fine scroll value: clear (mask to 0) the lower three bits, OR in the desired 0–7 value, then store the result back. Example RMW sequence (illustrative single‑instruction style):

- Read, mask, OR, write: `LDA $D011` → `AND #$F8` → `ORA #<0-7>` → `STA $D011`

Do the same for $D016 when changing horizontal fine scroll. Because other control bits may be affected, avoid writing a raw immediate byte to these registers without preserving the upper bits.

## Key Registers
- $D011 - VIC-II - Y fine scroll (bits 0–2); register also holds other VIC-II control flags (read‑modify‑write required)
- $D016 - VIC-II - X fine scroll (bits 0–2); register also holds other VIC-II control flags (read‑modify‑write required)

## References
- "example_and_border_expansion" — expands on example code to safely modify YSCRL/XSCRL fine scroll bits  
- "scrolling_repositioning_and_performance" — expands on when to shift screen memory and swap display base

## Labels
- YSCRL
- XSCRL
