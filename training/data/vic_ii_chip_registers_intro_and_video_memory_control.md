# Intro to VIC-II registers ($D000-$D02E), video banks, $D018, $D020, $D021, and sprite basics

**Summary:** VIC-II registers $D000-$D02E (including $D018 video matrix/character base, $D020 border color, $D021 background color) control VIC-II video bank selection and display mode; sprites are 24×21 pixels (63 bytes, 3 bytes/scanline) stored in 64-byte blocks selected by Sprite Data Pointers (default screen RAM $07F8-$07FF). This node covers multicolor/text/bitmap color rules, sprite data format, pointer arithmetic (pointer * 64), and sharing of sprite blocks.

## VIC-II video addressing and $D018
The VIC-II accesses an independent 16K video address space (one of four selectable 16K banks in the C64 memory map). The layout the VIC-II uses for:
- the Screen (Video Matrix, i.e. the 1-byte-per-character map) and
- the Character Dot-Data (character ROM or user character data)
is selected via the $D018 register (VIC bank/character base select). $D018 sets which addresses inside the VIC-II’s 16K view are used for the Video Matrix and the Character Generator (dot data). The VIC-II uses offsets inside its accessible 16K bank; the values in $D018 select those offsets (see your system’s bank mapping for full address translation).

Important: sprite shape data lives in the VIC-II’s 16K address space as well, addressed in 64-byte blocks selected by the Sprite Data Pointers in screen memory.

## Multicolor / text / bitmap color rules (summary)
- Multicolor text mode: character cells can use four colors — three global/common colors (shared among all chars) plus one color selectable per character (character color RAM).
- Multicolor bitmap mode: the bitmap is divided into 8×8 dot areas; within each 8×8 block four colors are available, three of which can be individually selected per block (plus a global background).
These mode behaviors are determined by VIC-II control bits (in the $D0xx register set) and by the layout selected via $D018.

## Sprites: overview and data format
- Count and size: 8 hardware sprites (Sprite 0–7). Each sprite is 24 dots wide × 21 dots high.
- Memory usage: 24×21 = 504 bits = 63 bytes per sprite. Sprite memory is organized in 64‑byte blocks; each block can hold one sprite (63 bytes used) — the block size is 64 for pointer arithmetic convenience.
- Pointer mechanism: Sprite Data Pointers are eight consecutive bytes placed at the end of the screen memory area (by default decimal addresses 2040–2047, hex $07F8–$07FF). Each pointer byte holds a block number. The starting address of the sprite data block within the VIC-II 16K bank is:
  address = pointer_value × 64
  (pointer_value interpreted as an unsigned byte; result is an offset within the currently mapped VIC bank).
- Sharing: multiple sprites may point to the same 64‑byte block; thus one 64‑byte block can define shapes for multiple sprites (useful for reusing graphics).
- Bit-to-dot mapping: each byte encodes 8 horizontal dots (bit 7 is the leftmost of that byte's 8 dots when displayed). Since a sprite line is 24 dots, it requires 3 consecutive bytes per line (3×8 = 24). Over 21 lines: 3 bytes × 21 lines = 63 bytes.

## Bit values and examples
Bits are weighted from bit 0 = 1 up to bit 7 = 128. A byte value equals the sum of weights for bits set to 1. In sprite data, 1 bits draw the sprite color for that dot; 0 bits are transparent/background.

Examples (three bytes per sprite scanline shown as binary -> decimal):
- 00000000 01111110 00000000 -> 0, 126, 0
  (middle byte bits 1–6 set -> a 6-dot horizontal run)
- 00011111 11111111 11111000 -> 21, 255, 248
  (a wide run: leftmost 5 bits set in first byte = 21, full middle byte = 255, rightmost 5 bits set in third byte = 248)

Example sprite lines combined to form a cross shape (each line shown as 3 bytes decimal):
- Many empty lines (0,0,0)
- Several lines 0,126,0
- Several lines 21,255,248
- etc. (full example in Source Code)

## Sprite usage notes (technical)
- Each sprite uses 63 bytes; the 64th byte in the block is padding/unused (block size 64).
- Sprite color and control (enable, x/y positions, expand, multicolor mode per sprite, collision flags) are controlled by VIC-II registers (see the $D000-$D02E register set).
- Pointer arithmetic is independent of the CPU memory mapping; the pointer value is interpreted by the VIC-II inside its 16K bank view.

## Source Code
```text
; Sprite pointer example
; Default Sprite Data Pointers are at screen RAM addresses decimal 2040-2047 = $07F8-$07FF
; Example: pointer byte = 11 (decimal) at $07F8
; Sprite start address within VIC bank = 11 * 64 = 704 (decimal) = $02C0

; Sprite line examples (binary -> decimal, 3 bytes per line)
00000000 01111110 00000000 = 0, 126, 0
00011111 11111111 11111000 = 21, 255, 248

; Cross example (15 lines shown; 3 bytes per line)
00000000 00000000 00000000 = 0, 0, 0
00000000 00000000 00000000 = 0, 0, 0
00000000 01111110 00000000 = 0, 126, 0
00000000 01111110 00000000 = 0, 126, 0
00000000 01111110 00000000 = 0, 126, 0
00000000 01111110 00000000 = 0, 126, 0
00000000 01111110 00000000 = 0, 126, 0
00000000 01111110 00000000 = 0, 126, 0
00000000 01111110 00000000 = 0, 126, 0
00011111 11111111 11111000 = 21, 255, 248
00011111 11111111 11111000 = 21, 255, 248
00011111 11111111 11111000 = 21, 255, 248
00000000 01111110 00000000 = 0, 126, 0
00000000 01111110 00000000 = 0, 126, 0
00000000 01111110 00000000 = 0, 126, 0
```

## Key Registers
- $D000-$D02E - VIC-II - VIC-II control/status and registers (raster, sprite enable, sprite X/Y, sprite control bits, interrupts, etc.)
- $D018 - VIC-II - Video Matrix and Character Dot-Data base selection (selects offsets inside the VIC 16K bank for screen and character data)
- $D020 - VIC-II - Border color register
- $D021 - VIC-II - Background (screen) color register (text/bitmap background)
- $07F8-$07FF - Screen RAM (default) - Sprite Data Pointers (8 bytes; each pointer selects a 64‑byte block: block_number * 64 = sprite data start offset within VIC bank). (decimal 2040–2047)

## References
- "character_generator_rom_and_vic_memory_setup" — expands on Character Generator ROM and alternate entry at $C000

## Labels
- D018
- D020
- D021
