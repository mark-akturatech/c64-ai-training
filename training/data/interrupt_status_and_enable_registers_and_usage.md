# VIC-II Interrupt Status ($D019) and Interrupt Enable ($D01A)

**Summary:** Describes the VIC-II interrupt status register at 53273 ($D019) and the interrupt enable register at 53274 ($D01A), including bit assignments (raster compare, sprite-data collision, sprite-sprite collision, light-pen, IRQ latch), write-1-to-clear latching behavior, and use for split-screen and multi-sprite display interrupts.

## Interrupt behaviour and bit meanings
The VIC-II provides a latched interrupt status register and a corresponding interrupt enable register. The status register shows which interrupt sources have occurred; each source bit is latched when set and must be cleared by writing a 1 to that same bit. Setting a bit in the enable register allows that source to actually generate an IRQ; if an enable bit is 0 the source can still be polled in the status register but will not cause an IRQ.

Status bits (1:1 relationship with enable bits) of interest:
- Bit 0 — Raster-compare interrupt (set when current raster equals stored raster compare)
- Bit 1 — Sprite-data collision (first collision only, latched until cleared)
- Bit 2 — Sprite–sprite collision (first collision only, latched until cleared)
- Bit 3 — Light-pen negative transition (one per frame)
- Bit 7 — Global IRQ latch (set when any enabled/latched interrupt requests an IRQ)

Latched behaviour and clearing:
- When a source occurs its bit in $D019 is set and latched (remains 1) until software clears it.
- To clear a latched bit you write a 1 to that bit position in the interrupt status register; writing 0 has no effect on that bit (write-1-to-clear).
- The corresponding bit in $D01A must be 1 for that source to generate a hardware IRQ line to the CPU. If the enable bit is 0 the status bit will still be set but no IRQ will fire.

Practical uses:
- Display interrupts (raster interrupts) let you change VIC-II registers mid-frame (split-screen modes): change character/bitmap source, screen mode, or other display parameters at specific raster lines.
- By changing sprite pointers/enablements during raster interrupts you can show more than 8 sprites on screen (time-multiplexing).
- BASIC is generally too slow and high-level to handle precise raster interrupts reliably; machine language (cycle-accurate handlers) is normally required for these real-time display techniques.

## Source Code
```text
INTERRUPT STATUS / ENABLE REGISTER (VIC-II)
Address: 53273 ($D019) - Interrupt Status Register
         53274 ($D01A) - Interrupt Enable Register

LATCH  BIT#   MASK   DESCRIPTION
---------------------------------------------
IRST    0     $01    Raster compare = stored raster count
IMDC    1     $02    Sprite-data collision (first only, latched)
IMMC    2     $04    Sprite-sprite collision (first only, latched)
ILP     3     $08    Light-pen negative transition (1 per frame)
...     4-6   $10-$40  (unused or other VIC-II internal bits)
IRQ     7     $80    Global IRQ latch (set when an enabled source requests IRQ)
---------------------------------------------

Notes:
- Bits are latched when set. Clear by writing a '1' to the corresponding bit in $D019.
- To receive an IRQ for a source, set the same bit to '1' in $D01A (enable register).
- Polling $D019 is allowed even if enable bit in $D01A is clear; polling will not generate IRQs.
```

## Key Registers
- $D019 - VIC-II - Interrupt Status Register (latch; write-1-to-clear)
- $D01A - VIC-II - Interrupt Enable Register (enable bits; must be set for IRQs)

## References
- "raster_register_usage_and_raster_compare" — expands on setting raster compare to generate interrupts
- "sprite_to_sprite_collision_register_and_behavior" — expands on sprite collision bits latched in status register

## Labels
- IRST
- IMDC
- IMMC
- ILP
- IRQ
