# Stable raster interrupts (jitter problem and solutions)

**Summary:** IRQ latency on the C64 depends on the instruction in progress (NOP, indexed memory ops, etc.), causing raster jitter; techniques to obtain a stable raster include double interrupts, syncing with VIC-II sprite fetch timing, and forcing or syncing with a Bad Line (register $D011 / VIC-II behavior).

## Overview
When an IRQ is acknowledged the CPU finishes the current instruction before jumping to the interrupt handler, so the effective IRQ latency varies with instruction length (example numbers from source: NOP = 2 cycles; some indexed memory instructions ≈ 7 cycles). That variability causes visible jitter when doing per-line changes (background colour, split-screen effects, etc.). Stable raster timing is required for precise effects such as horizontal splits (mid-line colour changes), border opening, and certain high-precision multiplexing; many other effects (top/bottom border changes, basic sprite multiplexing, FLI viewing) can still be done without perfectly stable IRQ timing.

## Why IRQs jitter
- The CPU completes the currently-executing instruction before taking the IRQ, so the delay is instruction-dependent.
- Different instructions have different cycle lengths (short instructions like NOP vs. longer memory-indexed loads/stores).
- On Bad Lines (VIC forced memory fetch), timing can shift by a full raster line, making jitter worse.

## Techniques for stable raster interrupts
Each technique aims to remove or fix the variable per-instruction delay so the IRQ entry point aligns with a stable cycle boundary.

- Double interrupts
  - Use two IRQs in sequence. The first IRQ prepares the CPU state so the second IRQ will occur while a short predictable instruction (typically a NOP) is executing.
  - By aligning the second IRQ to execute during a NOP, jitter is reduced to one cycle; then a carefully-timed branch or short instruction sequence removes the remaining one-cycle uncertainty.
  - This is a popular method among demo coders. (High-level description only; no listing provided in source.)

- Sync with sprite (sprite fetch timing)
  - Exploits VIC-II sprite data fetch behavior: enabling a sprite causes the VIC to do memory fetches for sprite data at fixed times.
  - If you execute a memory-manipulating instruction that will be stalled by the VIC's sprite fetch, the instruction will complete at a fixed offset relative to the sprite fetch completion — producing a stable timing point.
  - Practically this means turning on at least one sprite and performing an operation (for example, an INC at the right moment) so the instruction end is synchronized to the sprite fetch schedule.
  - The author prefers this method as "clean and nice" and less hassle than double-IRQ schemes.

- Triggering a Bad Line
  - Force a Bad Line (for example by altering $D011 at the correct time) which forces VIC memory fetches and yields a stable interrupt entry point.
  - Simple and effective, but may have undesirable side effects (visual garbage, timing side-effects with character memory).
  - This method underlies some FLI viewers and can be used to get stable timing for FLI-style effects.

- Syncing with a Bad Line
  - Variants exist where an INC or other operation is precisely timed relative to a Bad Line to get a stable interrupt; reported in the wild (e.g., Crossbow/Crest), but the source author didn't personally use it.
  - May combine advantages of forced VIC behavior with CPU instruction alignment.

## Author's preference
The author prefers syncing with a sprite fetch because it gives stable, clean timing without the complexity of double interrupts; forcing a Bad Line works but can introduce visual side-effects; a Bad-Line-sync method is also effective but less documented in the source.

## Key Registers
- $D000-$D02E - VIC-II - raster, control and sprite-related registers (VIC-II register block)
- $D011 - VIC-II - control register 1 (used in examples to trigger Bad Line / affect raster behavior)

## References
- "sprite_multiplexer" — expands on using sprite fetch timing for synchronization
- "fld_flexible_line_distance" — expands on Bad Line manipulation techniques
