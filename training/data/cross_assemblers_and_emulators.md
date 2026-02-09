# Cross Assemblers and Emulators (C-64)

**Summary:** Use cross assemblers (Amiga/PC) to assemble C‑64 machine code and transfer it to the real machine; testing in VICE is convenient but always verify on real hardware because some VIC‑II behaviors (raster timing $D012, $D020 border bug, sprite quirks) are imperfectly emulated.

## Cross Assemblers and Emulators
Cross assemblers run on other platforms (Amiga, PC, etc.) to produce C‑64 machine code which you then transfer to the C‑64 and execute. Emulators such as VICE are useful for rapid iteration and debugging, but they do not exactly match all VIC‑II hardware behavior. Notable mismatches that can affect demos and timing-critical code include:
- VIC‑II raster/timing differences (see $D012) — emulators may differ in when raster effects take effect.
- The $D020 bug (border-color latch behavior) — not all emulators reproduce the original hardware quirk.
- Sprite handling edge cases and sprite-sprite / sprite-background interaction differences.

Because demos often rely on precise raster timing and undocumented VIC‑II behavior, always test on real hardware before release.

## Source Code
(omitted — no code or tables provided in source)

## Key Registers
- $D012 - VIC‑II - Raster line register (raster timing/position)
- $D020 - VIC‑II - Border color register (affected by known border-color latch bug)

## References
- "d012_raster_register" — expands on hardware raster behavior differences in emulators