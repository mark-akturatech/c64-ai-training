# VIC-II: RSEL ($D011) and CSEL ($D016) — alternate display window heights and widths

**Summary:** Describes VIC‑II register bits RSEL (in $D011) and CSEL (in $D016) which select alternate display window heights (24 vs 25 text lines / 192 vs 200 pixels) and widths (38 vs 40 columns / 304 vs 320 pixels), plus the corresponding first/last raster lines and X coordinates and the border intrusion behavior.

## Description
The VIC‑II supports two display window heights and two display window widths selectable by single bits:

- RSEL (a bit in $D011) selects the vertical display window:
  - RSEL = 0 → 24 text lines / 192 pixels tall
  - RSEL = 1 → 25 text lines / 200 pixels tall
  - Corresponding first/last raster lines and hex values are listed below.

- CSEL (a bit in $D016) selects the horizontal display window:
  - CSEL = 0 → 38 characters / 304 pixels wide
  - CSEL = 1 → 40 characters / 320 pixels wide
  - Corresponding first/last X coordinates and hex values are listed below.

Important behavioral notes (from source):
- RSEL/CSEL do not move the display window or change its resolution — they adjust the starting and ending positions where the border is displayed.
- The underlying character matrix remains constant at 40 × 25 characters regardless of CSEL/RSEL.
- Border intrusion when the smaller window is selected (RSEL=0 or CSEL=0):
  - If RSEL = 0, the top and bottom border each extend 4 pixels into the display window.
  - If CSEL = 0, the left border is extended 7 pixels into the display area and the right border 9 pixels.
- Use the tables below for exact raster/X coordinate start and end values (decimal and hex).

For expanded details about visual effects and timing implications, see the cross‑references at the end.

## Source Code
```text
Display window height (RSEL in $D011)
RSEL | Display window height   | First line | Last line
-----+-------------------------+------------+-----------
  0  | 24 text lines/192 px   | 55 ($37)   | 246 ($F6)
  1  | 25 text lines/200 px   | 51 ($33)   | 250 ($FA)

Display window width (CSEL in $D016)
CSEL | Display window width    | First X coo. | Last X coo.
-----+-------------------------+--------------+-------------
  0  | 38 characters/304 px   | 31 ($1F)     | 334 ($14E)
  1  | 40 characters/320 px   | 24 ($18)     | 343 ($157)

Border intrusion behavior when selecting the smaller window:
- If RSEL = 0: upper and lower border are each extended by 4 pixels into the display window.
- If CSEL = 0: left border extended by 7 pixels; right border extended by 9 pixels.

Other notes:
- The position of the display window and its resolution do not change; RSEL/CSEL only switch the starting and ending position of the border display.
- The video character matrix remains 40×25 characters regardless of RSEL/CSEL.
```

## Key Registers
- $D011 - VIC-II - RSEL bit: selects 24 vs 25 text lines / 192 vs 200 pixels (first/last raster lines listed in table)
- $D016 - VIC-II - CSEL bit: selects 38 vs 40 columns / 304 vs 320 pixels (first/last X coordinates listed in table)

## References
- "display_window_and_border" — expands on visual effect of border and display column that RSEL/CSEL alter
- "soft_scrolling_and_vic_timing" — expands on recommended X/YSCROLL settings to keep graphics aligned with chosen RSEL/CSEL and detailed VIC timing

## Labels
- RSEL
- CSEL
