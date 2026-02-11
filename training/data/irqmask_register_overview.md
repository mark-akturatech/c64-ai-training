# $D01A — IRQMASK (IRQ Mask Register, VIC-II)

**Summary:** $D01A (IRQMASK) is a VIC-II register that enables individual interrupt sources: raster compare, sprite vs. foreground collision, sprite vs. sprite collision, and light-pen events. Searchable terms: $D01A, IRQMASK, VIC-II, raster IRQ, sprite collision, light pen.

**Description**
$D01A is the VIC-II interrupt mask register. Each bit enables the corresponding VIC-II interrupt condition so that when the VIC-II asserts an interrupt status, the CPU IRQ line is driven only if the status bit and the corresponding mask bit are set.

- Bit 0 enables the raster-compare interrupt (the raster counter match/raster IRQ).
- Bit 1 enables an interrupt when a sprite collides with normal background/foreground graphics.
- Bit 2 enables an interrupt when two sprites collide.
- Bit 3 enables an interrupt triggered by the light pen.
- Bits 4–7 are unused/reserved and should be treated as read/write don't-care (no documented function).

When an enabled condition occurs, the VIC-II will set the corresponding bit in its IRQ status register; with the mask bit set in $D01A the VIC-II will assert the IRQ line to the CPU.

## Source Code
```text
$D01A        IRQMASK      IRQ Mask Register

                     Bit 0  - Enable Raster Compare IRQ (1 = interrupt enabled)
                     Bit 1  - Enable IRQ on sprite vs. display (foreground) collision (1 = enabled)
                     Bit 2  - Enable IRQ on sprite vs. sprite collision (1 = enabled)
                     Bit 3  - Enable light pen IRQ (1 = enabled)
                     Bits 4-7 - Not used / reserved
```

## Key Registers
- $D01A - VIC-II ($D000-$D02E) - IRQ Mask Register: enables raster, sprite/foreground collision, sprite/sprite collision, and light-pen IRQ sources

## References
- "raster_irq_and_raster_registers" — expands on raster-compare IRQ details and raster registers
- "light_pen_and_sprite_collision_irqs" — expands on light pen and sprite-collision IRQ details

## Labels
- IRQMASK
