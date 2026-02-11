# Sprite Multiplexing — Method 2.4.1: "Just before the new sprite"

**Summary:** VIC-II sprite multiplexing technique using raster interrupts to write sprite registers ($D000-$D02E) shortly before a sprite's start Y; "close enough" equals the raster time required to write all sprites in the worst case (writing 8 sprites ≈ 10–12 raster lines). Precalculation of interrupt timing lets you adjust the interrupt lead and write Y-coordinates first for robustness.

## Description
The method delays writing sprite registers until the raster is very close to a sprite's display start Y, then updates the relevant VIC-II sprite registers in that raster interrupt. If multiple sprites begin near the same Y, they may be handled in the same interrupt.

Definition of "close enough"
- Set the interrupt to occur such that there is enough raster time remaining to write all sprite registers that may need updating in that interrupt.
- The safe minimum lead is the worst-case raster time to write all sprites that could be updated in the interrupt. For eight sprites this is typically on the order of 10–12 raster lines; if you attempt the interrupt closer than this and all sprites happen to coincide, you risk not finishing the writes.

Precalculation benefits
- If you precompute when raster interrupts must occur, you can:
  - Adjust the interrupt lead based on how many sprites will be written in that interrupt (e.g., a single sprite can be updated only ~2 lines before its Y, while many sprites require ~10–12 lines).
  - Arrange the write order: perform all Y-coordinate updates first (they are critical to avoid visible vertical positioning errors), then update X, frame pointers, color, and other cosmetic registers.
- Result: fewer cosmetic errors in tightly packed sprite formations and more optimal use of raster time.

Practical points
- Writing Y first: because the exact scanline where a sprite becomes visible is the highest priority, update Y-position registers as early in the interrupt as possible. Other attributes (X, color, pointer) can follow once vertical alignment is ensured.
- Grouping sprites: if multiple sprites' start Y are within the "close enough" window, write them in one interrupt to save overhead.
- Timing margin: choose conservative margins when worst-case write time is uncertain; use precalculation to minimize unnecessary conservatism.
- (See $D010 MSB/raster-compare handling in related notes for edge cases with raster wrap and high-bit raster comparisons.)

## Key Registers
- $D000-$D02E - VIC-II - Sprite registers (positions, pointers, colors, and sprite control registers)

## References
- "raster_interrupt_code_example_and_notes" — naive register write sequence and $D010 MSB handling
- "raster_interrupt_optimizations_and_unrolled_code" — faster per-physical-sprite unrolled code and timing optimizations
