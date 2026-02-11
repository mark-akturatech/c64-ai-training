# Raster Compare IRQ (VIC-II $D012 / $D011)

**Summary:** Explanation of the VIC‑II raster‑compare interrupt mechanism using the Raster Register at $D012 and the MSB in $D011 (VIC‑II). Covers how the VIC‑II tracks the NTSC 262‑line / 200‑visible‑line scan, how the two registers are used for reading the current scan line and writing the interrupt target, and how the raster‑compare status bit triggers a mid‑screen IRQ for register changes.

## Raster Compare IRQ (bit 0) — how it works
The VIC‑II maintains a hardware raster counter that tracks which video scan line (raster) is currently being drawn. On NTSC C64 hardware the full scan is 262 lines per frame, of which about 200 lines form the visible area; the frame is updated ~60 times per second.

The raster compare facility uses:
- $D012 (53266) — Raster Register (low 8 bits)
- bit 7 of $D011 (53265) — Raster Register high bit (MSB)

Together these form the raster compare value (a 9‑bit value when the MSB is used). Behavior:
- When READ, the raster register pair reports the current raster line being scanned (current raster position).
- When WRITTEN, the raster register pair stores the target scan line number to compare against during subsequent scanning; this value designates where a raster‑compare event should occur.

At the exact moment the internal raster counter equals the number written to the Raster Register, the VIC‑II sets the raster‑compare status bit (Bit 0 of the VIC status register). If the raster interrupt is enabled (the raster IRQ mask bit set), the CPU interrupt vector will be invoked immediately. This synchronous timing lets the program perform mid‑screen register changes (for example: change character set, background color, scroll, sprite pointers or graphics mode) and thus create split‑screen effects or mixed display modes by modifying VIC‑II registers at a specific raster line.

Important points and caveats preserved from the source:
- The raster counter and compare use both $D012 and bit 7 of $D011; the high bit is required to target lines beyond 0–255.
- The compare is evaluated during scanning; the status bit flips exactly when the current line equals the written target.
- Using the interrupt allows safe, frame‑synchronized, mid‑screen changes to VIC‑II registers to alter what is drawn below the compare line.

## Key Registers
- $D011-$D012 - VIC‑II - Raster register (read: current scan line; write: raster‑compare target). $D012 = low 8 bits; bit 7 of $D011 = high bit / MSB.

## References
- "irqmask_register_overview" — expands on Bit assignment for Raster Compare IRQ (bit 0)
- "installing_raster_irq_steps" — expands on Practical steps to enable and use raster interrupts
- "raster_interrupt_example_basic_and_data_listing" — example program that uses raster interrupts to split the screen
