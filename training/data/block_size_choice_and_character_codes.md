# Multidirectional Scrolling — Block Size & Block Data (Cadaver)

**Summary:** Discussion of block size choice for multidirectional scrolling on the C64: author prefers 4x4 blocks and recommends power-of-two block sizes for easy calculations; block data are usually 8-bit values (character/screen codes), with typical map systems limited to 256 blocks.

**Block size choice**
Block size is a tradeoff between memory use and the graphical detail possible. Smaller blocks (e.g., 4x4 tiles) reduce wasted tile data and allow finer map detail at the cost of larger maps and more processing/VRAM updates; larger blocks reduce map memory but limit per-tile variety.

The author prefers 4x4 blocks. Power-of-two block sizes are recommended because they simplify index/address calculations (enables indexing with shifts/masks) and align cleanly with byte-oriented data structures.

**Block data**
Block entries are generally stored as single 8-bit values (one byte per block) that contain the character/screen code used to draw that block on the screen. Because a block index is one byte, many map/block systems are constrained to 256 unique blocks (0–255) unless additional banking or multi-byte indices are implemented.

**Memory layout and encoding scheme for 4x4 blocks**
In a 4x4 block system, each block consists of 16 character cells arranged in a 4x4 grid. Each character cell corresponds to an 8x8 pixel character, resulting in a block size of 32x32 pixels. The memory layout for such a system typically involves:

- **Map Data:** Each map cell (representing a block) is stored as a single byte, indexing into a block definition table. For a map of width W blocks, each row requires W bytes.
- **Block Definition Table:** Each block is defined by 16 bytes, each byte representing a character code corresponding to a character in the character set. The 16 bytes are arranged in a 4x4 grid, matching the block's structure.

For example, if block 0 is defined as:


This means the top-left character of block 0 is character 00, the top-right is 03, and so on.

**Mapping blocks to character cells**
Each block maps directly to 16 character cells in a 4x4 arrangement. The block data specifies the character codes for these cells, which the VIC-II chip uses to render the corresponding characters on the screen. This mapping allows for efficient rendering and scrolling, as updating the screen involves copying character codes from the block definition to the screen memory.

## Source Code

```
00 01 02 03
04 05 06 07
08 09 0A 0B
0C 0D 0E 0F
```


## References
- "map_data_block_data_overview" — map & block data system constraints (256 blocks)
- "Standard Character Mode - C64-Wiki" — details on character modes and memory layout
- "Commodore 64 memory map" — overview of C64 memory organization
- "CharPad C64 Pro by Subchrist Software" — tool for creating character-based graphics on the C64
- "How to Develop a Commodore 64 Shoot-em-Up Game | Medium" — discusses using 4x4 tiles for efficient memory usage in game development