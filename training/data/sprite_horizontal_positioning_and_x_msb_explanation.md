# Horizontal positioning (sprites): 512 X positions, $D010 MSB

**Summary:** Sprites on the VIC-II have 9-bit horizontal positions (0..511). The per-sprite MSB is stored in VIC-II register $D010 (53264) — bits 0..7 map to sprites 0..7; visible X ranges are typically 24..343 (40×25 NTSC) or 31..335 (38-column/24-row modes).

**Horizontal Positioning**
The VIC-II provides 9-bit X coordinates for each sprite, allowing X positions from 0 to 511. The low 8 bits are written to each sprite's X position register (sprite X low), and the ninth (MSB) bit for all sprites is gathered in the VIC-II register $D010 (53264); bit n of $D010 is the MSB for sprite n (n = 0..7).

- X coordinate formation (per sprite): X = (X_MSB << 8) | X_low.
- If X > 255, set the sprite's MSB bit in $D010 to 1; if X < 256, that MSB bit should be 0.
- The full 0..511 range is usable in hardware, but most of that range is off-screen. Typical visible X windows depend on display mode:
  - Standard (NTSC) 40 columns × 25 rows: visible X approximately 24..343.
  - 38-column × 24-row mode: visible X approximately 31..335.
- Values outside the visible window (e.g., X < left_visible or X > right_visible) still position the sprite off-screen and can be used for entrance/exit animation or offscreen buffering.
- The per-sprite mapping in $D010 means you must set/clear the appropriate bit when crossing the 255/256 boundary while moving a sprite horizontally.

## Key Registers
- $D000 - Sprite 0 X position (low byte)
- $D002 - Sprite 1 X position (low byte)
- $D004 - Sprite 2 X position (low byte)
- $D006 - Sprite 3 X position (low byte)
- $D008 - Sprite 4 X position (low byte)
- $D00A - Sprite 5 X position (low byte)
- $D00C - Sprite 6 X position (low byte)
- $D00E - Sprite 7 X position (low byte)
- $D010 - VIC-II - Sprite X MSB bits (bit 0 = sprite 0 MSB ... bit 7 = sprite 7 MSB). Set the bit to 1 if that sprite's full X >= 256, clear to 0 if X < 256.

## References
- "sprite_positioning_summary" — expands on visible ranges and edge cases
- "horizontal_movement_examples" — example code for moving a sprite across the 255/256 boundary and manipulating $D010 bits
