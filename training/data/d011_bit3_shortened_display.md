# VIC-II $D011 Bit 3 — 24/25-row Text Display (shortened display for vertical fine scrolling)

**Summary:** Describes VIC-II register $D011 Bit 3, which selects between 24-row and 25-row text display modes (1 = 25 rows, 0 = 24 rows). Discusses the shortened-display behavior (border overlap), interaction with vertical fine-scrolling bits (bits 0–2 of $D011), and contrasts with horizontal fine scrolling controlled by $D016.

**Description**

Bit 3 of the VIC-II control register $D011 determines the number of visible text rows:

- **1**: Normal 25-line text display
- **0**: Shortened 24-row display

In the 24-row mode, the border extends to cover the top or bottom text row. The characters in the covered row remain in video memory and are still fetched and rendered by the VIC-II; they are simply hidden by the border. This feature is utilized for vertical fine scrolling, allowing new screen data to be positioned off-screen (covered) before becoming visible.

Vertical fine-scrolling is controlled by the three vertical fine-scroll bits (bits 0–2) in the same register ($D011). When these three bits are set to 0, the top line is blanked (covered by the border). As the vertical-scroll value increases, the blanking shifts downward one scan line at a time. When the three bits reach their maximum value (7), the bottom line is completely blanked.

This behavior contrasts with the horizontal fine-scrolling mechanism controlled by $D016 (decimal 53270). $D016 shortens the screen horizontally by one character column on either side to facilitate horizontal fine scrolling. In contrast, $D011’s shortened display (Bit 3) and its vertical fine-scroll bits allow for blanking a single vertical line at a time and shifting that blanking by scanline as described above.

## Source Code

```text
VIC-II Control Register 1 ($D011) Bit Map:

Bit 7: RST8  - Most significant bit of the raster counter
Bit 6: ECM   - Extended Color Mode (1 = enabled)
Bit 5: BMM   - Bitmap Mode (1 = enabled)
Bit 4: DEN   - Screen Disable (0 = screen blanked)
Bit 3: RSEL  - Row Select (1 = 25 rows, 0 = 24 rows)
Bit 2: YSC2  - Vertical Fine Scrolling Bit 2
Bit 1: YSC1  - Vertical Fine Scrolling Bit 1
Bit 0: YSC0  - Vertical Fine Scrolling Bit 0
```

```text
VIC-II Control Register 2 ($D016) Bit Map:

Bit 7: Unused
Bit 6: Unused
Bit 5: RES   - Reset (1 = reset)
Bit 4: MCM   - Multicolor Mode (1 = enabled)
Bit 3: CSEL  - Column Select (1 = 40 columns, 0 = 38 columns)
Bit 2: XSC2  - Horizontal Fine Scrolling Bit 2
Bit 1: XSC1  - Horizontal Fine Scrolling Bit 1
Bit 0: XSC0  - Horizontal Fine Scrolling Bit 0
```

## Key Registers

- **$D011** - VIC-II Control Register 1:
  - Bit 3 (RSEL): Selects 24-row (0) or 25-row (1) text display.
  - Bits 0–2 (YSC0–YSC2): Vertical fine-scroll bits that shift the single-line blanking.

- **$D016** - VIC-II Control Register 2:
  - Bits 0–2 (XSC0–XSC2): Horizontal fine-scroll bits.
  - Bit 3 (CSEL): Column Select (1 = 40 columns, 0 = 38 columns).
  - Bit 4 (MCM): Multicolor Mode (1 = enabled).

## References

- "d011_vertical_fine_scrolling_bits0_2_and_demo" — expands on D011 vertical fine-scrolling bits and demonstrates their use.

## Labels
- RSEL
- YSC0
- YSC1
- YSC2
- XSC0
- XSC1
- XSC2
- CSEL
