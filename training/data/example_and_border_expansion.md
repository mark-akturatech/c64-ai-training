# YSCRL / XSCRL Fine Scroll and Border Expansion (VIC-II)

**Summary:** This document provides an example assembly sequence for setting the VIC-II vertical fine scroll (YSCRL) without disturbing upper bits, using LDA/AND/ORA/STA with mask #$F8. It also details VIC-II border expansion options: 38-column mode via clearing bit 3 of XSCRL and vertical border expansion via bit 3 of YSCRL.

**Fine-Scroll-Safe Update Routine**

To change only the lower 3 bits (fine-scroll bits) of a VIC-II scroll register without affecting the upper bits, follow this pattern:

1. Read the register.
2. Mask off the lower 3 bits (preserve the upper bits).
3. OR in the desired fine-scroll value (0–7).
4. Write back the result.

This method ensures that control bits in the upper portion of the register (such as screen base or border/column mode bits) remain unchanged while updating the pixel-level scroll.

**Example Effects:**

- Increasing YSCRL from 0 to 7 scrolls the screen down by up to 7 pixels (vertical fine scroll).
- Increasing XSCRL from 0 to 7 scrolls the screen right by up to 7 pixels (horizontal fine scroll).

**Border Expansion (Buffering) for Scrolling**

For smooth hardware scrolling, hidden buffer areas are beneficial for preparing new graphics. The VIC-II provides two border/column-expansion controls:

- **38-Column Mode (Horizontal Expansion):** Clear bit 3 of the XSCRL register to enable 38-column mode. This hides one character column at both the left and right edges, providing a hidden buffer column on each side. Set bit 3 to return to normal 40-column mode.

- **Vertical Border Expansion:** Clear bit 3 of the YSCRL register while the vertical fine-scroll value is 3 to expand the top and bottom borders, covering halves of the top and bottom character rows, thus providing vertical buffer space. Set bit 3 to return to normal 25-row mode.

## Source Code

```asm
; Set vertical fine-scroll (YSCRL) to 7 without disturbing upper bits
LDA $D011       ; Load current value of Control Register 1 (YSCRL)
AND #$F8        ; Mask out lower 3 bits (clear bits 0-2)
ORA #$07        ; OR in scroll value 7 (set bits 0-2)
STA $D011       ; Store the new value back to Control Register 1

; Notes:
; - XSCRL fine-scroll bits 0-2 work the same for horizontal scrolling.
; - Clear bit 3 of XSCRL ($D016) to enter 38-column mode (hidden buffer columns left and right).
; - Clear bit 3 of YSCRL ($D011) when vertical fine-scroll = 3 to expand top and bottom borders.
```

## Key Registers

- **$D011 (Control Register 1):** Contains YSCRL (bits 0-2) and vertical border expansion control (bit 3).
- **$D016 (Control Register 2):** Contains XSCRL (bits 0-2) and 38-column mode control (bit 3).

## References

- "hardware_scrolling_and_registers" — expands on masking lower 3 bits before OR'ing new fine-scroll value.

## Labels
- YSCRL
- XSCRL
