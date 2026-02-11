# Chaining raster IRQs by changing $0314/$0315 and $D012

**Summary:** Describes two approaches to get multiple raster interrupts per frame on the C64: (1) single raster IRQ + polling $D012, and (2) chaining IRQs by writing new handler addresses into $0314/$0315 and new raster lines into $D012 from inside each IRQ handler; includes the exact registers involved ($0314/$0315, $D012) and the swap technique for alternating handlers.

## Using more than one interrupt per frame
Two practical ways to produce multiple raster-driven events in one frame:

- Single IRQ + polling $D012
  - Set up one raster IRQ at some line (e.g. $20). Inside the main loop (or inside the IRQ), poll $D012 until it reaches the next desired line (e.g. $E0).
  - Simple, but wastes usable raster time if the main loop needs CPU time (polling ties up CPU/raster time between the two effects).

- Chained IRQs (preferred for demos)
  - Install one IRQ handler address in the IRQ vector ($0314/$0315) and set $D012 to the first raster line (e.g. $20). When that IRQ fires, the handler does its work and, before returning, writes the next handler address into $0314/$0315 and writes the next raster line into $D012 (e.g. $E0). When the VIC reaches that line the next IRQ fires and runs the second handler.
  - The second handler likewise restores the vector and $D012 to the first handler/line before returning, creating an alternating chain of IRQs within each frame.
  - This lets multiple IRQs occur each frame without polling and without blocking main-loop work.

Step-by-step (conceptual):
1. Put address of intraster into IRQ vector ($0314/$0315).
2. Write desired raster line (e.g. #$20) to $D012 to arm the VIC interrupt.
3. When intraster runs, do the effect, then:
   - write address of intscroll into $0314/$0315
   - write raster line #$E0 to $D012
   - return from interrupt
4. When intscroll runs, do its effect, then:
   - write address of intraster back into $0314/$0315
   - write raster line #$20 to $D012
   - return from interrupt
5. Optionally change the value written to $D012 each frame (increment/decrement) to move raster bars up/down.

Notes and behavior specifics preserved from source:
- The technique relies on modifying the IRQ vector and the VIC raster-compare register inside IRQ handlers so subsequent IRQs occur at different scanlines.
- This avoids continuous software polling of $D012 in the main loop (which consumes raster time).
- The source suggests testing by making each handler perform an obvious, verifiable change (e.g. change background color), and by varying $D012 per frame to animate vertical movement.

## Key Registers
- $0314-$0315 - System RAM - IRQ vector (low byte / high byte) — holds address loaded for the IRQ handler executed on interrupt
- $D012 - VIC-II - Raster line compare / raster interrupt line register (write to arm IRQ at a given scanline)

## References
- "stable_raster_interrupts" — expands on the need for stable raster timing when scheduling many in-line IRQs
