# Sprite X/Y Position Registers ($D000-$D010)

**Summary:** Sprite X/Y position registers ($D000-$D00F) and the X MSB register ($D010) in the VIC-II control sprite placement; X positions are 9-bit (0–511) using $D000..$D00E for low bytes and $D010 for MSBs, Y positions are 8-bit (0–255). Registers are interleaved X0,Y0,X1,Y1... and positioning is referenced to the top-left corner of the 24×21 sprite box.

## Sprite positioning details
Each sprite has:
- an 8-bit X position low byte stored in the interleaved X registers,
- an 8-bit Y position stored in the interleaved Y registers,
- a single MSB bit in $D010 which provides the 9th X bit for each sprite (bit 0 = sprite 0, bit 1 = sprite 1, …, bit 7 = sprite 7).

This allows:
- X range: 0..511 (9-bit) — combine low byte from $D000..$D00E with the corresponding bit in $D010 to add 256 when set.
- Y range: 0..255 (8-bit).
- Coordinates reference the top-left corner of the sprite's 24×21 pixel bounding box.

Registers are arranged in memory interleaved so that each sprite's X and Y registers form a pair: X0 ($D000), Y0 ($D001), X1 ($D002), Y1 ($D003), etc. The X MSB register is a single byte at $D010 containing one MSB bit per sprite.

## Source Code
```text
+---------+---------+---------------------------------------------------+
| DECIMAL |   HEX   |                     DESCRIPTION                   |
+---------+---------+---------------------------------------------------+
|  53248  | ($D000) | SPRITE 0 X POSITION REGISTER                      |
|  53249  | ($D001) | SPRITE 0 Y POSITION REGISTER                      |
|  53250  | ($D002) | SPRITE 1 X POSITION REGISTER                      |
|  53251  | ($D003) | SPRITE 1 Y POSITION REGISTER                      |
|  53252  | ($D004) | SPRITE 2 X POSITION REGISTER                      |
|  53253  | ($D005) | SPRITE 2 Y POSITION REGISTER                      |
|  53254  | ($D006) | SPRITE 3 X POSITION REGISTER                      |
|  53255  | ($D007) | SPRITE 3 Y POSITION REGISTER                      |
|  53256  | ($D008) | SPRITE 4 X POSITION REGISTER                      |
|  53257  | ($D009) | SPRITE 4 Y POSITION REGISTER                      |
|  53258  | ($D00A) | SPRITE 5 X POSITION REGISTER                      |
|  53259  | ($D00B) | SPRITE 5 Y POSITION REGISTER                      |
|  53260  | ($D00C) | SPRITE 6 X POSITION REGISTER                      |
|  53261  | ($D00D) | SPRITE 6 Y POSITION REGISTER                      |
|  53262  | ($D00E) | SPRITE 7 X POSITION REGISTER                      |
|  53263  | ($D00F) | SPRITE 7 Y POSITION REGISTER                      |
|  53264  | ($D010) | SPRITE X MSB REGISTER (bit 0 = sprite0, ... bit7) |
+---------+---------+---------------------------------------------------+
```

## Key Registers
- $D000-$D00F - VIC-II - Sprite 0–7 X and Y positions (interleaved: X0,Y0,X1,Y1,...)
- $D010 - VIC-II - Sprite X MSB register (bits 0–7 = MSB for sprites 0–7, adds 256 to X low byte when bit set)

## References
- "sprite_vertical_positioning_limits_and_example" — expands on Y ranges and on-screen values
- "horizontal_movement_examples" — expands on X movement using X MSB for >255 positions