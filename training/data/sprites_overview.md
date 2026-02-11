# VIC-II Sprites (MOBs) — 8 movable objects, 24x21 pixels

**Summary:** VIC-II sprites (MOBs) are eight independent 24x21-pixel movable objects controlled by VIC-II registers ($D000-$D02E). Sprite enable bits are in $D015, expansion and multicolor modes via $D017/$D01D and $D01C, priority via $D01B, per-sprite colors in $D027-$D02E, and X coordinates use 9 bits with MSBs collected in $D010.

## Sprites
The VIC-II supports eight sprites (MOBs), each 24×21 pixels in size. Key behaviors and controls:

- Movement and positioning
  - The top-left corner of each sprite is positioned by its MxX / MxY coordinate registers (per-sprite registers).
  - Y coordinate: 8 bits in the sprite's MxY register.
  - X coordinate: 9 bits total — low 8 bits in the sprite's MxX register, with the most significant X bits for all sprites collected in register $D010.

- Enabling
  - Individual sprites are enabled/disabled by the bits in register $D015 (MxE).

- Size/expansion
  - Sprites can be expanded by a factor of 2 in X and/or Y while retaining the logical resolution of 24×21 pixels. Expansion is controlled via registers $D017 and $D01D (as noted in source).

- Color and display mode
  - Each sprite has its own color set in the per-sprite color registers $D027–$D02E.
  - Standard vs. multicolor sprite mode is selected by register $D01C (MxMC).

- Priority and collisions
  - Sprite display priority relative to background (text/bitmap) is selectable via $D01B (MxDP).
  - The VIC can detect sprite-sprite and sprite-background collisions and signal interrupts for those events (collision registers and interrupt behavior discussed in linked material).

- Sprite bitmap storage
  - Sprite shape/bitmap data and memory access behavior (including multicolor base and CPU access timing) are documented separately (see References). The chunk notes that sprite bitmap storage and p/s-access details exist but are expanded elsewhere.

## Key Registers
- $D000-$D02E - VIC-II - Sprite-related registers (sprite coordinates, enable, color, multicolor, expansion, priority, collision-related registers)
- $D010 - VIC-II - Sprite X most-significant bits (MSBs) for all sprites (provides 9th X bit)
- $D015 - VIC-II - Sprite enable bits (MxE)
- $D017 - VIC-II - Sprite expansion / control (referenced for X/Y expansion)
- $D01D - VIC-II - Sprite expansion / control (referenced for X/Y expansion)
- $D01C - VIC-II - Sprite multicolor mode (MxMC)
- $D01B - VIC-II - Sprite priority (MxDP)
- $D027-$D02E - VIC-II - Per-sprite color registers (sprite 0–7 colors)

## References
- "sprite_memory_access_and_display" — expands on sprite memory layout, CPU/VIC access timing, multicolor base
- "sprite_priority_and_collision" — expands on sprite vs background priority rules and collision register behavior (e.g., collision interrupt registers)

## Labels
- $D000-$D02E
- $D010
- $D015
- $D017
- $D01D
- $D01C
- $D01B
- $D027-$D02E
