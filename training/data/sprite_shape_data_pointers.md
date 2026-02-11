# Sprite Shape Data Pointers — video matrix offsets $7F8-$7FF (2040–2047)

**Summary:** The last eight bytes of the VIC-II video matrix (offsets 2040–2047 decimal / $7F8–$7FF) hold block numbers that point to sprite shape data blocks; each block is 64 bytes (sprite shape uses 63 bytes for a 24×21 bitmap) and the pointer value × 64 gives the starting address within the 16K VIC-addressable area.

## Description
- Location: the final eight bytes of the video matrix (wherever the screen memory/video matrix is currently located) are used as the shape-data pointers for hardware sprites 0–7.
- Contents: offsets 2040..2047 ($7F8..$7FF) contain one byte each; these bytes are block numbers (0–255).
- Address calculation: start address = block_number × 64. Each sprite shape occupies 63 bytes (24 bits × 21 rows), but is stored in a 64-byte block to align to 256 total blocks in the 16K VIC-II-addressable area (256 × 64 = 16384).
- Mapping of pointer bytes to sprites:
  - 2040 ($7F8) — Sprite 0 shape block number
  - 2041 ($7F9) — Sprite 1 shape block number
  - ...
  - 2047 ($7FF) — Sprite 7 shape block number
- Relocatable: if screen memory (video matrix) is relocated, these eight pointer bytes move with it; therefore the absolute RAM addresses for the pointers depend on the current video matrix base.
- Example: a value of 11 in location 2040 means Sprite 0 shape starts at address 11 × 64 = 704 (decimal) and continues for 63 bytes (704–766 decimal).

## Key Registers
- $7F8-$7FF - Video matrix (last 8 bytes) - Sprite shape data pointer block numbers (Sprite 0–7)

## References
- "vicscn_video_screen_memory_area" — expands on sprite pointers as part of the video screen memory region
- "hibase_screen_memory_top_page" — expands on how relocating screen memory moves these sprite pointers into a different RAM page
