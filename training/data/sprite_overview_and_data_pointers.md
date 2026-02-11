# Sprites — Sprite Data Pointers and Storage Layout

**Summary:** Commodore 64 VIC-II sprites: eight sprites (0–7), each 24x21 dots; shape data uses 63 bytes stored in 64-byte blocks within the VIC-II 16K window. Sprite Data Pointers are the last eight bytes of screen memory (default $7F8-$7FF / 2040–2047) and select the 64-byte block (pointer × 64 = block start).

## Overview
- Sprites: eight independent sprite characters, numbered 0–7, each 24 dots wide by 21 dots high.
- Shape storage: each sprite shape uses 63 bytes of data housed in a 64-byte block. The VIC-II addresses 16K of RAM as its window subdivided into 256 blocks of 64 bytes.
- Sprite Data Pointers: the eight pointer bytes are located in the last eight bytes of the screen memory area (defaults are decimal 2040–2047, hex $7F8–$7FF). Pointer N (first = sprite 0, second = sprite 1, etc.) contains a block number; block_number * 64 = address (within the VIC-II 16K window) of the first byte of that block.
- Multiple sprites may reference the same 64-byte block, allowing identical shapes for several sprites while only using one stored block.

Example from source:
- With default VIC-II addressing and screen-memory defaults, a value of 11 in location 2040 ($7F8) means Sprite 0 uses the 63-byte shape block starting at address 11 × 64 = 704.

## Key Registers
- $7F8-$7FF (2040–2047) - VIC-II - Sprite Data Pointers (last eight bytes of screen memory; each byte selects a 64-byte block within the VIC-II 16K window; pointer × 64 = block start)

## References
- "sprite_shape_data_format" — expands on how sprite bits map to dots (3 bytes per line)
- "sprite_horizontal_and_vertical_position_registers" — expands on Registers $D000-$D010 for sprite positioning
