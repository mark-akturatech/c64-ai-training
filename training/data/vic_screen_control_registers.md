# VIC-II Screen Control Registers $D011-$D018

**Summary:** VIC-II screen control registers $D011-$D018 manage vertical and horizontal fine scrolling, raster position ($D012), sprite enablement and height ($D015/$D017), light-pen coordinates ($D013/$D014), and memory setup pointers for character, bitmap, and screen memory. These registers are integral to raster interrupts, fine scrolling, and screen/bitmap layout configurations.

**Description**

This section details the VIC-II screen-control registers and their specific functions:

- **$D011 — Screen Control Register 1**
  - **Bit 7 (RST8):** Most significant bit of the 9-bit raster counter.
  - **Bit 6 (ECM):** Extended color mode; enables four background colors per character when set.
  - **Bit 5 (BMM):** Bitmap mode; switches between text and bitmap display modes.
  - **Bit 4 (DEN):** Display enable; turns the screen display on or off.
  - **Bit 3 (RSEL):** Row select; chooses between 24 or 25 visible character rows.
  - **Bits 2-0 (YSCROLL):** Vertical fine scrolling; sets the number of pixels to scroll vertically.

- **$D012 — Raster Line**
  - **Bits 7-0:** Lower 8 bits of the current raster line. Combined with bit 7 of $D011 for the full 9-bit raster line value.

- **$D013 — Light Pen X (Read-Only)**
  - **Bits 7-0:** Light pen X-coordinate; provides the horizontal position latched by the light pen hardware.

- **$D014 — Light Pen Y (Read-Only)**
  - **Bits 7-0:** Light pen Y-coordinate; provides the vertical position latched by the light pen hardware.

- **$D015 — Sprite Enable**
  - **Bits 7-0:** Each bit corresponds to a sprite (0–7); setting a bit enables the corresponding sprite.

- **$D016 — Screen Control Register 2**
  - **Bit 4 (MCM):** Multicolor mode; enables multicolor mode for characters and sprites.
  - **Bit 3 (CSEL):** Column select; chooses between 38 or 40 visible columns.
  - **Bits 2-0 (XSCROLL):** Horizontal fine scrolling; sets the number of pixels to scroll horizontally.

- **$D017 — Sprite Height**
  - **Bits 7-0:** Each bit corresponds to a sprite (0–7); setting a bit doubles the height of the corresponding sprite.

- **$D018 — Memory Setup**
  - **Bits 7-4 (VM13-VM10):** Screen memory pointer; selects the base address for screen memory.
  - **Bits 3-1 (CB13-CB11):** Character memory pointer; selects the base address for character memory.
  - **Bit 0:** Unused.

## Source Code

```text
Register summary:

$D011   Screen Control 1
        Bit 7: RST8 - Raster Counter MSB
        Bit 6: ECM - Extended Color Mode
        Bit 5: BMM - Bitmap Mode
        Bit 4: DEN - Display Enable
        Bit 3: RSEL - Row Select
        Bits 2-0: YSCROLL - Vertical Fine Scroll

$D012   Raster Line
        Bits 7-0: Raster Line LSB

$D013   Light Pen X
        Bits 7-0: Light Pen X-Coordinate

$D014   Light Pen Y
        Bits 7-0: Light Pen Y-Coordinate

$D015   Sprite Enable
        Bits 7-0: Sprite Enable (0–7)

$D016   Screen Control 2
        Bit 4: MCM - Multicolor Mode
        Bit 3: CSEL - Column Select
        Bits 2-0: XSCROLL - Horizontal Fine Scroll

$D017   Sprite Height
        Bits 7-0: Sprite Height (0–7)

$D018   Memory Setup
        Bits 7-4: VM13-VM10 - Screen Memory Pointer
        Bits 3-1: CB13-CB11 - Character Memory Pointer
        Bit 0: Unused
```

## Key Registers

- **$D011-$D018**: VIC-II screen control registers managing fine scrolling, raster positioning, sprite configurations, light-pen coordinates, and memory pointers.

## References

- "vic_sprite_registers" — Details on sprite X/Y and MSB bits at $D000/$D010.
- "vic_interrupt_registers" — Information on raster and collision IRQs at $D019-$D01A.

## Labels
- D011
- D012
- D013
- D014
- D015
- D016
- D017
- D018
