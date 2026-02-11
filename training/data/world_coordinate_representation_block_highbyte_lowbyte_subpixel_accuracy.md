# Multidirectional Scrolling Coordinate Systems (Cadaver)

**Summary:** Comparison of two world-coordinate representations for C64 multidirectional scrolling: (1) 16‑bit pixel-counting from the map top-left; (2) highbyte = block coordinate, lowbyte = position-within-block (author's preference). Covers block size (4 chars = 32 pixels), subpixel accuracy, background collision checking speed, and the sprite-display cost (bit-rotates).

**Coordinate Representations**

- **Pixel-Counting (16-bit pixels from map origin):**
  - Each axis is a 16‑bit pixel counter measured from the top-left of the entire game map.
  - To render on screen, subtract the scrolling position: `screen_x = world_x - scroll_x`.
  - **Pros:**
    - Conceptually simple.
    - No per-sprite subpixel bookkeeping.
  - **Cons:**
    - Background collision checks are slow and complicated.
    - No subpixel accuracy; accelerating movement appears rough.

- **Block+Offset (Highbyte = Block, Lowbyte = Offset) — Author's Preference:**
  - The 16‑bit world coordinate is split: highbyte = block coordinate in the map, lowbyte = position within that block.
  - A block is 4 chars = 32 pixels. The lowbyte provides subpixel positioning (3 bits of subpixel accuracy).
  - **Pros:**
    - Background collision checking is fast: the map tile/block index is directly the coordinate highbyte (use highbyte to index map/block tables).
    - Subpixel movement is available without massively complicating map lookups.
  - **Cons:**
    - Sprite display and sprite–sprite collision require bit-rotates/shifts to remove the lowbyte subpixel component when producing pixel-aligned sprite bitmaps and when using hardware or bitmap collision routines — a modest runtime cost.
  - **Implementation Note from Author:**
    - Use a single world-coordinate system for all in-world objects and perform background collisions by examining the map & block data (the "hard way"); checking collision against screen tiles may be an optimization in some cases but was not used.

## References

- "coordinate_systems_screen_vs_world_and_issues" — expands on why choose world coordinates and related tradeoffs
