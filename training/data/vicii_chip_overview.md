# VIC-II Overview (C64) — I/O Map $D000-$D02E

**Summary:** VIC-II (Video Interface Controller) overview: independent 16K video addressing, video memory/character dot data/sprite storage requirements, and VIC-II I/O register range $D000-$D02E (53248-53294) for controlling the C64 display.

## Overview
The VIC-II (Video Interface Controller) is the dedicated video processor responsible for generating the Commodore 64's display and graphics features. It operates independently of the 6510 CPU's memory mapping: the VIC-II can access only one 16K block of system memory at a time (any of the four 16K blocks may be selected), and the chosen block must contain all resources the VIC-II needs for the display.

All display-related data that the VIC-II uses — the video matrix (screen character indices), character dot data (glyph bitmaps), sprite shapes (sprite bitmap data), and any bitmap-mode graphics — must reside within the currently selected 16K video bank. The system default is for the VIC-II to use the first 16K block.

The VIC-II exposes a set of memory-mapped I/O registers at addresses $D000-$D02E (decimal 53248–53294). These registers can be read and written like ordinary memory locations, but their contents directly control timing, raster behavior, sprite enabling/positioning, character pointers, and other video hardware functions. Many VIC-II registers interact, so coordinated updates are common (for example, turning sprites on/off, changing raster IRQ lines, or switching character set pointers).

## Graphics subsystems
- Text/Character mode: screen contents are a video matrix of character indices that reference character dot data (glyph bitmaps) stored in memory within the VIC-II's selected 16K bank.
- Character dot data: glyph bitmaps (8×8 or multi-line character definitions) used by text and character-multicolor modes must be located inside the VIC-II-accessible 16K block.
- Sprites: hardware sprites (shape, color, position) are defined by sprite data bitmaps stored in the VIC-II-accessible 16K bank; sprite pointers and control are set via VIC-II registers.
- Bitmap modes: full-screen or high-resolution bitmaps are implemented using data stored in the current 16K bank and arranged under VIC-II control.

For detailed, register-level walkthroughs of the video matrix/character dot data and sprite pointers, see the referenced expansions.

## Key Registers
- $D000-$D02E - VIC-II - VIC-II I/O registers (video control, raster IRQs, sprite control, character/bank pointers) 

## References
- "video_matrix_and_character_dot_data" — expands on Video Matrix and Character dot data base ($D018)
- "sprite_overview_and_data_pointers" — expands on Sprites and Sprite Data Pointers