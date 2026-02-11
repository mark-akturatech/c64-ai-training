# Sprite Multiplexing Techniques (Cadaver / Lasse Oorni)

**Summary:** Tips for reverse-engineering Commodore 64 sprite multiplexers: search ML monitor byte sequences and IRQ vicinity for sprite-register writes and indexed memory accesses to locate the sprite order array and sortroutine; relevant terms: $D000, VIC-II, IRQ, sprite order array, indexed memory access.

## Overview
When reversing sprite multiplexers, look for machine-code patterns that indicate writes to VIC-II sprite registers (search byte sequences such as $01 $D0 or other sprite-register write sequences in an ML monitor). Multiplexer code is frequently located near the IRQ/raster handler.

A reliable heuristic: in the sprite display interrupt code you will often find one indexed memory access whose result is not written to a sprite I/O register but instead is used solely as an index (in X or Y) for subsequent accesses into other sprite-related arrays. That memory area is likely the sprite order array (the indirection that controls which hardware sprite slot is assigned to which logical sprite). Tracing references to that array (who reads/writes it) typically leads you to the sortroutine that arranges active sprites for each raster line.

Common patterns and pointers:
- Search near IRQ/raster handler addresses — multiplexer setup and per-scanline routines are often adjacent to the IRQ vector or raster entry/exit code.
- Look for repeated STA/STA.writes to VIC-II addresses (sprite Y/X, enable bits, pointers) — these indicate per-line sprite updating.
- Find indexed loads (LDA [addr,X] / LDX / LDY used as index) where the loaded byte is used only to index other sprite tables — this is likely the order/indirection array.
- Once the order array is found, locate all cross-references to it; one of those references is usually the sortroutine (continuous insertion sort and similar algorithms are common).
- After getting a multiplexer running, stress-test it with large numbers of sprites and unusual ordering to expose timing bugs and off-by-one raster timing issues.

## Key Registers
- $D000-$D02E - VIC-II - Sprite 0-7 registers and other VIC-II registers (sprite X/Y positions, pointers, enable/control, colors, etc.)

## References
- "continuous_insertion_sort_ocean_algorithm" — expands on order-array-based insertion-sort variants commonly used to produce the sprite sortorder
- "raster_interrupt_optimizations_and_unrolled_code" — discusses locating and analyzing multiplexer code near IRQ/raster handlers and common unrolling/optimizations used in per-line sprite code
