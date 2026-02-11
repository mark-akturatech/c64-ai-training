# Lookup tables (precomputed sine tables) for C-64 demos

**Summary:** Use precomputed lookup tables (sine tables, shift tables) on the C-64 to trade memory for speed; common demo techniques include sine-based motion and precomputed shifts to avoid expensive runtime computations.

## Using Tables
Lookup tables replace expensive or repetitive calculations with memory reads. Precompute values (for example, sine values or shifted sprite/bitmap data) and index them at runtime to avoid costly math on the 6510/6502 CPU. Typical uses include:
- Sine tables for smooth motion/oscillation (sprite or raster-based movement, color cycling).
- Precomputed shifts or rotated/shifted bitmaps to avoid repeated bit-manipulation or repeated ASL/LSR sequences.
- Any complex or frequently repeated calculation where lookups are cheaper than recomputation.

Advantages and trade-offs:
- Significant runtime speedups (the source notes code with many shifts can often be rewritten to run in roughly half the time).
- Increased memory usage — tables consume RAM that could otherwise hold code or graphics.
- Table choice depends on required precision and period (byte values, 8-bit signed/unsigned, or larger fixed-point entries).

Implementation notes (conceptual only):
- Store table entries in zero page or contiguous memory for fast indexed access.
- Use byte-sized tables for single-byte results; use word tables when values exceed 8 bits (account for little-endian ordering).
- Wrap indexing (modulo table length) when repeating patterns like sine waves.

## References
- "sine_editors_and_sample_basic" — expands on creating sine tables in BASIC or with table editors