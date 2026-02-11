# Multidirectional Scrolling — map-data & block-data (tile) system (Cadaver)

**Summary:** Describes the common C64/SEUCK tile system where map-data is an array of 8-bit block numbers (allowing up to 256 blocks) that index block-data (tile bitmaps/character data). Relevant search terms: map-data, block-data, tiles, SEUCK, 8-bit block numbers, VIC-II, $D012 (raster/timing).

**The map-data and the block-data**

- **Overview:** The system separates level geometry (map-data) from the visual content of each tile (block-data). Map-data is a grid of 8-bit indices; each index points to one block (tile) in a block-data table. This lets many map cells share the same block definition, saving memory compared with storing full-screen bitmaps.

- **Map-data:**
  - Stored as sequential bytes (one byte per map cell) where each byte is a block number (0–255).
  - The map is typically arranged as rows of block indices that represent the playfield grid. Row ordering (row-major vs column-major) and any pre-calculation for scrolling offsets are implementation details (see references).
  - Because indices are 8-bit, a maximum of 256 distinct blocks can be referenced without additional encoding.

- **Block-data:**
  - Holds the visual representation for each block number used in the map.
  - A block may be one hardware character (e.g., an 8×8 character cell) or a larger composite made of multiple character cells; the source chunk assumes familiarity with whatever block size the tool (e.g., SEUCK) uses.
  - Block-data is stored as raw pattern data (bitmap or character bytes) and is referenced indirectly by map-data. Storage order inside block-data (row-major, per-character, per-row) affects copying routines and cache/CPU performance.

- **Memory and performance trade-offs:**
  - Map-data + block-data uses much less RAM than storing full-screen bitmaps when the world reuses tiles heavily.
  - It shifts complexity into runtime rendering: you must translate visible map cells into character/pixel data and push those into video memory or character RAM during scrolling and screen updates.
  - Precalculating visible rows (or prefetching future rows) reduces per-frame work; details vary by implementation and hardware timing (VIC-II raster timing such as $D012 is commonly used to time updates).

- **Typical uses and variants:**
  - SEUCK-style editors and many C64 games use this system for multidirectional scrolling and level storage.
  - Variants may include additional attribute layers (color bytes, collision indices), multi-layer maps, run-length or other compression on map-data or block-data, and double-buffering of character sets.

## Source Code

```text
// Example of a 2×2 block composed of four 8×8 character cells
// Each character cell is represented by an 8-byte bitmap
// The block is stored in row-major order

Block 0:
Character 0:
.byte %00000000
.byte %00111100
.byte %01100110
.byte %01100110
.byte %01100110
.byte %01100110
.byte %00111100
.byte %00000000

Character 1:
.byte %00000000
.byte %00111100
.byte %01100110
.byte %01100110
.byte %01100110
.byte %01100110
.byte %00111100
.byte %00000000

Character 2:
.byte %00000000
.byte %00111100
.byte %01100110
.byte %01100110
.byte %01100110
.byte %01100110
.byte %00111100
.byte %00000000

Character 3:
.byte %00000000
.byte %00111100
.byte %01100110
.byte %01100110
.byte %01100110
.byte %01100110
.byte %00111100
.byte %00000000
```

## References

- "map_row_storage_and_precalculation" — expands on how map rows are stored and accessed for scrolling
- "block_data_row_major_storage_example" — shows how block pixels/characters are stored (row-major example)
