# VIC-II: Raster, Light Pen, and Sprite-Collision Interrupts (C64 I/O Map)

**Summary:** VIC-II interrupt sources: raster-compare interrupts (used for scrolling zones, raster-split effects), light-pen interrupts with position registers at $D013–$D014 (53267–53268), and sprite collision interrupts with collision-report registers at $D01E (53278) and $D01F (53279). The VIC-II IRQ mask bits (enable/disable) control these sources.

**Raster-compare interrupts and scrolling zones**
The Raster Compare (raster interrupt) is commonly used to split the screen or create scrolling zones so portions of the display can be fine-scrolled while other parts remain static. Enable the raster-compare interrupt in the VIC-II IRQ mask; when the raster reaches the programmed scanline, the interrupt fires, and your IRQ routine can change VIC registers (e.g., character/bitmap control, scroll registers) to create mixed or segmented display areas.

**Light pen interrupt and position registers**
- **Enabling:** The VIC-II IRQ mask includes a bit that enables the light-pen interrupt (documented here as "Bit 1").
- **Trigger:** A light pen detects the bright raster beam and closes its internal switch (wired to joystick port #1), which signals the VIC-II and generates an interrupt when enabled.
- **Reading position:** When the IRQ indicates a light-pen event, read the light-pen position registers at 53267–53268 ($D013–$D014) to obtain the pen position. Some pens also provide a push-button that grounds an additional joystick line; programs can use that as a secondary confirmation input (readable from the joystick port lines).
- **Use case:** The interrupt signals that the pen is held to the screen and that the coordinates in the light-pen registers are valid for sampling.

**Sprite-foreground and sprite-sprite collision interrupts**
- **Enabling:** The VIC-II IRQ mask includes bits that enable sprite-foreground collisions (documented here as "Bit 2") and sprite-sprite collisions ("Bit 3").
- **Trigger conditions:**
  - **Sprite-foreground collision:** Occurs when any dot (pixel) of a sprite overlaps a dot of the foreground display (text or bitmap).
  - **Sprite-sprite collision:** Occurs when any dot of one sprite touches any dot of another sprite.
- **Reporting which sprites:** After an IRQ signals a collision, read the Sprite-Foreground Collision Register and the Sprite-Sprite Collision Register to determine which sprites were involved:
  - **Sprite-Sprite Collision Register:** 53278 ($D01E)
  - **Sprite-Foreground Collision Register:** 53279 ($D01F)
- **Use case:** Game programs typically enable these interrupts so collisions can be handled immediately in the IRQ routine (collision resolution, scoring, state changes).

## Source Code
```text
Bit-field definitions for $D01E (Sprite-Sprite Collision Register) and $D01F (Sprite-Foreground Collision Register):

$D01E (53278) - Sprite-Sprite Collision Register:
Bit 7: Sprite 7
Bit 6: Sprite 6
Bit 5: Sprite 5
Bit 4: Sprite 4
Bit 3: Sprite 3
Bit 2: Sprite 2
Bit 1: Sprite 1
Bit 0: Sprite 0

$D01F (53279) - Sprite-Foreground Collision Register:
Bit 7: Sprite 7
Bit 6: Sprite 6
Bit 5: Sprite 5
Bit 4: Sprite 4
Bit 3: Sprite 3
Bit 2: Sprite 2
Bit 1: Sprite 1
Bit 0: Sprite 0

Each bit corresponds to a sprite number. When a bit is set to '1', it indicates that the corresponding sprite has been involved in a collision.

VIC-II IRQ Mask Register ($D01A) bit layout:

$D01A (53274) - IRQ Mask Register:
Bit 7: Unused
Bit 6: Unused
Bit 5: Unused
Bit 4: Unused
Bit 3: Enable Light Pen Interrupt
Bit 2: Enable Sprite-Sprite Collision Interrupt
Bit 1: Enable Sprite-Foreground Collision Interrupt
Bit 0: Enable Raster Compare Interrupt

Setting a bit to '1' enables the corresponding interrupt source; setting it to '0' disables it.
```

## Key Registers
- $D000–$D02E - VIC-II - VIC-II register block (context)
- $D012 - VIC-II - Raster compare / raster counter (used for raster interrupts and fine raster timing)
- $D013–$D014 - VIC-II - Light-pen position registers (53267–53268)
- $D01E - VIC-II - Sprite-Sprite Collision Register (53278)
- $D01F - VIC-II - Sprite-Foreground Collision Register (53279)
- $D019 - VIC-II - Interrupt status (IRQ flags) — see VIC-II interrupt flag register
- $D01A - VIC-II - IRQ mask / Interrupt Enable (bits enable raster, light pen, sprite collisions)

## References
- "irqmask_register_overview" — expands on the IRQ mask bits that enable these interrupts (bits 1–3)
- "raster_compare_irq_and_raster_scan_basics" — expands on raster interrupts as a VIC-II interrupt source (bit 0)

## Labels
- D01E
- D01F
- D01A
- D013
- D014
