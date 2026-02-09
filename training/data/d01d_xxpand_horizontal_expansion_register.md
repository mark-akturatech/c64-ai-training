# $D01D — XXPAND — Sprite Horizontal Expansion Register

**Summary:** $D01D (53277) — VIC-II Sprite Horizontal Expansion register; bits 0-7 control horizontal doubling (1=double-width) for sprites 0–7. Can be combined with vertical expansion at $D017 to scale sprites.

## Description
Each bit in $D01D enables horizontal expansion for the corresponding hardware sprite: when a bit is set to 1, every displayed pixel (dot) of that sprite is repeated twice horizontally, producing a double-width appearance without altering the sprite's source bitplane data. Bits 0–7 map to sprites 0–7 respectively. Horizontal expansion works independently or together with the vertical expansion register at $D017 (vertical expansion doubles pixel rows).

## Source Code
```text
$D01D        XXPAND       Sprite Horizontal Expansion Register (53277)

                     0    Expand Sprite 0 horizontally (1=double-width sprite, 0=normal width)
                     1    Expand Sprite 1 horizontally (1=double-width sprite, 0=normal width)
                     2    Expand Sprite 2 horizontally (1=double-width sprite, 0=normal width)
                     3    Expand Sprite 3 horizontally (1=double-width sprite, 0=normal width)
                     4    Expand Sprite 4 horizontally (1=double-width sprite, 0=normal width)
                     5    Expand Sprite 5 horizontally (1=double-width sprite, 0=normal width)
                     6    Expand Sprite 6 horizontally (1=double-width sprite, 0=normal width)
                     7    Expand Sprite 7 horizontally (1=double-width sprite, 0=normal width)

                          This register can be used to double the width of any sprite.  Setting
                          any bit of this register to 1 will cause each dot of the corresponding
                          sprite shape to be displayed twice as wide as normal, so that without
                          changing its horizontal resolution, the sprite takes up twice as much
                          space.  The horizontal expansion feature can be used alone, or in
                          combination with the vertical expansion register at 53271 ($D017).
```

## Key Registers
- $D01D - VIC-II - Sprite Horizontal Expansion (bits 0-7 = sprites 0-7: 1=double-width)

## References
- "d017_yx_expand_sprite_vertical_expansion" — expands on Vertical expansion register $D017