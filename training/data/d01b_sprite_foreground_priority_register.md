# $D01B SPBGPR — Sprite to Foreground Display Priority Register

**Summary:** $D01B (SPBGPR) — VIC-II register controlling per-sprite display priority versus foreground graphics; bits 0-7 select whether each sprite appears in front of (0) or behind (1) foreground. Default 0 (all sprites above foreground). Multicolor '01' bit-pair is treated as background for priority purposes; fixed sprite-to-sprite priority (lower-number sprites over higher-number).

## Description
Bits 0–7 of $D01B select the sprite-vs-foreground priority for sprites 0–7. When a sprite overlaps text or bitmap (foreground) graphics, the corresponding bit determines which is displayed:

- Bit = 0: sprite is displayed in front of foreground graphics.
- Bit = 1: foreground graphics are displayed in front of the sprite.

Power-on default: all bits cleared (0), so sprites begin with priority over foreground graphics.

Multicolor note: the multicolor "01" bit-pair (the shared multicolor pixel value) is considered background for priority comparisons; therefore those multicolor pixels are shown behind sprites even when the foreground graphics otherwise have priority.

Sprite-to-sprite priority is fixed: each sprite has priority over all higher-numbered sprites (Sprite 0 > Sprite 1 > ... > Sprite 7). Use of these priority bits allows arranging objects to appear in front of or behind foreground elements.

## Source Code
```text
$D01B        SPBGPR       Sprite to Foreground Display Priority Register

                     0    Select display priority of Sprite 0 to foreground (0=sprite
                            appears in front of foreground)
                     1    Select display priority of Sprite 1 to foreground (0=sprite
                            appears in front of foreground)
                     2    Select display priority of Sprite 2 to foreground (0=sprite
                            appears in front of foreground)
                     3    Select display priority of Sprite 3 to foreground (0=sprite
                            appears in front of foreground)
                     4    Select display priority of Sprite 4 to foreground (0=sprite
                            appears in front of foreground)
                     5    Select display priority of Sprite 5 to foreground (0=sprite
                            appears in front of foreground)
                     6    Select display priority of Sprite 6 to foreground (0=sprite
                            appears in front of foreground)
                     7    Select display priority of Sprite 7 to foreground (0=sprite
                            appears in front of foreground)

                          If a sprite is positioned to appear at a spot on the screen that is
                          already occupied by text or bitmap graphics, a conflict arises.  The
                          contents of this register determines which one will be displayed in
                          such a situation.  If the bit that corresponds to a particular sprite
                          is set to 0, the sprite will be displayed in front of the foreground
                          graphics data.  If that bit is set to 1, the foreground data will be
                          displayed in front of the sprite.  The default value that this
                          register is set to at power-on is 0, so all sprites start out with
                          priority over foreground graphics.

                          Note that for the purpose of priority, the 01 bit-pair of multicolor
                          graphics modes is considered to display a background color, and
                          therefore will be shown behind sprite graphics even if the foreground
                          graphics data takes priority.  Also, between the sprites themselves
                          there is a fixed priority.  Each sprite has priority over all
                          higher-number sprites, so that Sprite 0 is displayed in front of all
                          the others.
```

## Key Registers
- $D01B - VIC-II - Sprite to Foreground Display Priority Register (per-sprite 0=above foreground, 1=behind foreground)

## References
- "spena_sprite_enable_register" — covers sprite enable bits ($D015) which determine whether sprites are visible (priority applies only when sprite pixels are enabled)
- "spmc_sprite_multicolor_registers" — expands on multicolor bit-pair behavior and shared colors

## Labels
- SPBGPR
