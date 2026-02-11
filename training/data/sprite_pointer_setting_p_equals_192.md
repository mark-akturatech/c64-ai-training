# SPRITE POINTER: P = 192 → memory 12288

**Summary:** Explains sprite pointer value P=192 used to point sprite 0 to the 64‑byte block starting at 12288 (192 * 64). Covers the pointer arithmetic (index × 64 = byte address) and how swapping pointer values rotates which stored 64‑byte shape block the sprite displays for animation.

## Explanation
P is a sprite pointer index (an 8‑bit value) that selects a 64‑byte block in memory containing a single sprite shape. The VIC‑II treats the pointer as an index into 64‑byte aligned blocks, so the displayed sprite bitmap start address = P × 64. In this example:

- P = 192 selects the block that begins at 192 × 64 = 12288.
- Changing P to other pointer values makes sprite 0 use the other 64‑byte blocks (stored elsewhere in memory), so a single hardware sprite can appear to change shape by swapping its pointer.

This is the basis for simple frame‑based sprite animation: store multiple 64‑byte frames consecutively (or at known offsets) and rotate the sprite pointer among the corresponding indices so the VIC‑II fetches different shape data for sprite 0.

## Pointer arithmetic and examples
- Formula: address = P × 64 (P is the pointer index, integer 0–255).
- Examples:
  - P = 192 → 192 × 64 = 12288
  - P = 193 → 193 × 64 = 12352
  - P = 194 → 194 × 64 = 12416

If three shape blocks are stored at 12288, 12352, 12416 (consecutive 64‑byte blocks), then rotating P among 192, 193, 194 cycles sprite 0 through those three shapes.

## Source Code
```basic
45 P=192               ' Set pointer index for sprite 0 to 192 (-> address 12288)
```

## References
- "sprite_shape1_load_loop" — Pointer value 192 selects the first shape block at 12288
- "sprite_shape2_load_loop" — Other pointer values can select the second block
- "sprite_shape3_load_loop" — Other pointer values can select the third block
- "sprite_horizontal_movement_loop" — Pointer switching used together with X movement to animate the sprite
