# IRQ loaders

**Summary:** IRQ loaders perform disk I/O in the program main loop while leaving interrupt routines (e.g. raster IRQs on the VIC-II, raster register $D012) untouched so demos can continue drawing scrollers, raster bars and sprites; typical loader entry/return mnemonics: JSR/RTS.

## Overview
An IRQ loader is a demo loader that performs file transfers from the disk drive in the main program loop instead of inside or by disabling interrupt service routines. Because the demo’s IRQs (for example raster effects driven by the VIC-II raster register $D012) remain active, visual effects such as scrollers, rasterbars and sprites continue to run while data is loaded in the background.

Key characteristics:
- Loads while interrupts remain enabled — demo routines continue to execute.
- Effective use requires available raster time (more free raster time → faster transfers).
- Drive activity is still visible externally (drive motor noise, LED activity), so the load can be noticeable to observers despite uninterrupted visuals.
- Loader compatibility varies between drive models/firmware; some fast or nonstandard drives may require adapted code.

## Typical structure
Most IRQ loaders share a two-part structure:
- Init routine: sets up the drive and any transfer state. This routine is often safe to overwrite after initialization to save RAM.
- Loader routine: performs the actual I/O in the main loop and must be retained (not overwritten) until the final transfer is complete.

Some loaders additionally:
- Support on-the-fly decrunching so the program can use decompressed data immediately after loading (no separate decrunch step required).
- Document entry points, registers/zero page locations used, and required drive commands; follow that documentation exactly for compatibility.

## Implementation notes
- Do not disable or replace IRQ handlers used for the demo’s realtime effects while the loader is running; the loader’s design is specifically to avoid disturbing those handlers.
- Maximize available raster time for better throughput (optimize visual routines for shorter IRQ/scanline tasks).
- Test on target drives — behaviors and speed differ across Drive 1541 revisions and compatibles.
- Ensure the loader’s preserved routine(s) and any required vectors/zero-page pointers are documented and protected until the final overwritable code is in place.

## References
- "how_to_implement_interrupts_example" — expands on interrupts needed for IRQ loaders, implementation details and example IRQ setups
