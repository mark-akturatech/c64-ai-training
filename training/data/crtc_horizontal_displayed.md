# MACHINE - CRTC Register R1: Horizontal Displayed

**Summary:** CRTC register R1 (8-bit) — "Horizontal Displayed": number of displayed character positions per horizontal line (character columns). Searchable terms: R1, Horizontal Displayed, CRTC, 8-bit, character positions.

**Description**
This 8-bit register holds the count of displayed character positions (columns) on each horizontal scanline. The value is interpreted as a number of character cells (not individual pixels) and directly controls the width of the active display area in character units.

- **Size:** 8 bits — valid numeric range 0–255 (character positions).
- **Units:** Character positions/columns (not pixels).
- **Functional role:** Determines the active displayed columns per horizontal line; it works together with the horizontal total register to define the visible area and horizontal timing.

**Register Index:** 1

**Bit-Level Semantics:** All 8 bits (D7–D0) represent the number of displayed character positions. There are no reserved bits or special meanings assigned to individual bits.

**Power-On/Reset Default Value:** The default value of R1 varies depending on the system implementation. For example, in the Amstrad CPC, the default value is 40. ([cantrell.org.uk](https://www.cantrell.org.uk/david/tech/cpc/cpc-firmware/crtc.htm?utm_source=openai))

**Example Typical Values and Resulting Pixel Widths:**
- If each character is 8 pixels wide:
  - R1 = 40 → 320 pixels (40 characters × 8 pixels/character)
  - R1 = 80 → 640 pixels (80 characters × 8 pixels/character)

**Interaction with Horizontal Total, Sync Positions, and Borders:**
- **Horizontal Total (R0):** Defines the total number of character positions per line, including both displayed and non-displayed (blanking) periods. R1 must be less than or equal to R0.
- **Horizontal Sync Position (R2):** Specifies the character position where the horizontal sync pulse begins. It should be set after the displayed characters (R1) and before the end of the horizontal total (R0).
- **Horizontal Sync Width (R3):** Determines the duration of the horizontal sync pulse.

**Read/Write Behavior Details:**
- **Write-Only:** R1 is a write-only register; reading from it is not supported.
- **Side Effects:** Writing to R1 immediately affects the number of displayed character positions per line. Care must be taken to ensure that R1 is set appropriately in relation to R0 and R2 to maintain proper display timing.

**Machine-Specific Notes:**
- **Amstrad CPC:** The CRTC registers are accessed via I/O ports. To select a register, the register number is output to port &BCxx, and then the data is output to port &BDxx. ([cantrell.org.uk](https://www.cantrell.org.uk/david/tech/cpc/cpc-firmware/crtc.htm?utm_source=openai))

## References
- "crtc_horizontal_total" — horizontal total vs displayed relationship
- ([cantrell.org.uk](https://www.cantrell.org.uk/david/tech/cpc/cpc-firmware/crtc.htm?utm_source=openai))

## Labels
- CRTC_R1
- HORIZONTAL_DISPLAYED
