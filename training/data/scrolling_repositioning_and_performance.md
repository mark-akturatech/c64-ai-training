# Fine (sub-character) scrolling behavior and screen-repositioning

**Summary:** Describes VIC-II fine vertical scrolling behavior controlled by the YSCRL register (bit 3 affects 25/24-row mode), the need to shift character-screen memory and color RAM when fine-scroll reaches its limit, and the off-screen buffer technique using TXBAS/GRABAS to avoid visible breaks during scrolling.

**Vertical fine-scroll / YSCRL behavior**
- The VIC-II vertical fine-scroll is controlled by the YSCRL register; bit 3 of YSCRL selects between the normal 25-row mode and the "7-bit" shifted mode that affects border coverage.
- Clearing bit 3 of YSCRL while the vertical scroll value is 3 causes half of the top row and half of the bottom row to be covered by the border (reduced visible rows). Setting bit 3 returns the VIC to normal 25-row display.
- Specific border coverage examples from the source:
  - Vertical scroll = 0 → the top line is entirely covered by the border.
  - Vertical scroll = 3 with bit 3 CLEAR → half of top and half of bottom rows are covered by the border.
  - Vertical scroll = 7 → the bottom line of the screen is entirely covered by the border.

**Handling fine-scroll wrap (when fine scroll reaches its maximum)**
- When fine scrolling in X or Y reaches its maximum value, you must shift each character cell on the screen one character in the scroll direction and then reset the fine-scroll registers to their minimum values to continue using hardware fine scroll.
- Both screen memory (character codes) and color RAM entries must be shifted together; failing to move color RAM in sync produces incorrect colors after the shift.
- The character-move routine must be extremely fast to avoid visual tearing: ideally it should complete within one screen update (1/60 second). If it is too slow, adjacent areas will show partially-updated graphics.

**Off-screen buffer technique (avoid single-frame mass move)**
- Instead of trying to reposition the live display area during a single frame, copy the scrolled screen image into a separate off-screen memory area while the current area is still displayed. Complete the copy before the fine-scroll register reaches its limit.
- Once the prepositioned area is ready, switch the VIC-II to read from that memory area using the appropriate macro (TXBAS or GRABAS). This switch is fast and avoids visible breaks.
- The macro that you will use depends on the current graphics mode:
  - **TXBAS**: Used for text (character) modes.
  - **GRABAS**: Used for bitmap graphics modes.

**Performance considerations**
- If you only need to scroll a subset of the screen (e.g., one window, status lines fixed), copying fewer character cells reduces the time required and lowers the risk of tearing.
- If your full-screen shift routine cannot run within 1/60 s, the off-screen-prep-and-switch method is the recommended alternative.

## Source Code
```text
Graphics Memory Byte Organization Table:

In bitmap modes, the screen memory is organized as follows:

- **Bitmap Data**: 8,000 bytes starting at the base address.
  - Each byte represents 8 horizontal pixels.
  - The bitmap is arranged in 25 rows of 40 bytes each.
  - Each row consists of 8 scan lines, totaling 200 scan lines.

- **Screen Memory (Color Information)**: 1,000 bytes immediately following the bitmap data.
  - Each byte corresponds to an 8x8 pixel block (character cell).
  - In standard bitmap mode:
    - The high nibble (bits 4-7) defines the foreground color.
    - The low nibble (bits 0-3) is unused.
  - In multicolor bitmap mode:
    - The high nibble defines the color for bits set to '1' in the bitmap.
    - The low nibble defines the color for bits set to '0' in the bitmap.

- **Color RAM**: 1,000 bytes located at $D800-$DBFF.
  - Each byte defines the background color for the corresponding character cell.
  - Only the lower 4 bits (nibble) are used, allowing for 16 colors.

This organization allows for efficient manipulation of bitmap graphics and color attributes on the Commodore 64.
```

## Key Registers
- **YSCRL ($D011)**: Vertical fine-scroll register.
  - Bit 3: Selects between 25-row mode (set) and 24-row mode (clear).
  - Bits 0-2: Vertical fine-scroll value (0-7).

## References
- Commodore 64 Programmer's Reference Guide: Programming Graphics - Overview
- Commodore 64 Programmer's Reference Guide: Programming Graphics - Bit Mapped Graphics
- Commodore 64 Programmer's Reference Guide: Programming Graphics - Sprites

## Labels
- YSCRL
