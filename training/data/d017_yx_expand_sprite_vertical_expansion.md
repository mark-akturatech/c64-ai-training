# $D017 — YXPAND (Sprite Vertical Expansion Register)

**Summary:** $D017 (VIC-II 53271) controls vertical expansion for sprites 0–7 (bits 0–7). Setting a sprite's bit doubles the vertical size by making each sprite row produce two raster scanlines.

## Description
$D017 (named YXPAND in some documents) is the VIC-II sprite vertical expansion register. Each bit 0–7 enables vertical double-height for the corresponding hardware sprite: when a bit is 1, every dot row of that sprite's 24×21 dot matrix is output for two raster scanlines instead of one, effectively doubling the sprite's vertical resolution on screen for that sprite.

This register is per-sprite (independent bits for sprites 0–7) and can be used selectively to double any combination of sprites. Vertical expansion is commonly used in conjunction with horizontal expansion ($D01D) — see cross-reference for details on pairing.

## Source Code
```text
Register: $D017  YXPAND  Sprite Vertical Expansion Register  (VIC-II, 53271)

Bit layout (7..0):
  7    Expand Sprite 7 vertically (1 = double height, 0 = normal)
  6    Expand Sprite 6 vertically (1 = double height, 0 = normal)
  5    Expand Sprite 5 vertically (1 = double height, 0 = normal)
  4    Expand Sprite 4 vertically (1 = double height, 0 = normal)
  3    Expand Sprite 3 vertically (1 = double height, 0 = normal)
  2    Expand Sprite 2 vertically (1 = double height, 0 = normal)
  1    Expand Sprite 1 vertically (1 = double height, 0 = normal)
  0    Expand Sprite 0 vertically (1 = double height, 0 = normal)

Notes:
- Sprite dot matrix: 24 (width) by 21 (height) rows.
- When vertical expansion is set, each dot row is repeated for two raster scanlines.
```

## Key Registers
- $D017 - VIC-II (53271) - Sprite Vertical Expansion (bits 0-7 control sprites 0–7; 1 = double height)

## References
- "xexpand_and_yexpand_registers" — expands on Horizontal expansion ($D01D) & how vertical expansion pairs with it

## Labels
- YXPAND
