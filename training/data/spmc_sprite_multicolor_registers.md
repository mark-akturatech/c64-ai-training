# Sprite Multicolor Register ($D01C)

**Summary:** $D01C (SPMC) — VIC-II sprite multicolor enable bits for sprites 0–7; groups sprite shape bits into pairs producing double-wide dots (sprite effectively 12 dots wide) and maps bit-pair values to background, two shared multicolor registers ($D025/$D026) and the sprite's own color ($D027-$D02E).

## Description
$D01C (SPMC) is an 8-bit VIC-II register where each bit selects multicolor mode for the corresponding hardware sprite: bit 0 → Sprite 0, bit 1 → Sprite 1, … bit 7 → Sprite 7. Setting a bit to 1 enables multicolor mode for that sprite; 0 selects high-resolution (1-bit-per-dot) sprite rendering.

In multicolor mode the sprite shape bits are grouped in pairs. Each pair selects one of four color sources for a double-wide horizontal dot (the sprite keeps the same nominal size but is rendered with 12 visible horizontal pixels instead of 24 high-resolution pixels). The four pair values map as follows:

- 00 — Background color register 0 (transparent)
- 01 — Sprite Multicolor Register 0 ($D025)
- 10 — This sprite's own color register ($D027-$D02E)
- 11 — Sprite Multicolor Register 1 ($D026)

Because there are two shared multicolor registers plus a unique per-sprite color, a multicolor sprite can display up to three foreground colors. More unique colors can be produced by overlaying multiple sprites.

The mode is analogous to character/bitmap multicolor (see Bit 4 of $D016 for VIC-II multicolor bitmap/char mode).

## Source Code
```text
Register: $D01C   SPMC   Sprite Multicolor Registers (VIC-II)

Bit layout:
 0    Select multicolor mode for Sprite 0 (1=multicolor, 0=hi-res)
 1    Select multicolor mode for Sprite 1 (1=multicolor, 0=hi-res)
 2    Select multicolor mode for Sprite 2 (1=multicolor, 0=hi-res)
 3    Select multicolor mode for Sprite 3 (1=multicolor, 0=hi-res)
 4    Select multicolor mode for Sprite 4 (1=multicolor, 0=hi-res)
 5    Select multicolor mode for Sprite 5 (1=multicolor, 0=hi-res)
 6    Select multicolor mode for Sprite 6 (1=multicolor, 0=hi-res)
 7    Select multicolor mode for Sprite 7 (1=multicolor, 0=hi-res)

Behavior summary:
 - When a sprite's bit is 0: each sprite shape bit = one horizontal pixel (hi-res).
 - When a sprite's bit is 1: shape bits are grouped in pairs → each pair controls a double-wide dot.
 - Effective horizontal resolution: sprite visually 12 dots wide in multicolor mode.
 - Pair mapping:
     00 -> Background Color Register 0 (transparent)
     01 -> Sprite Multicolor Register 0 ($D025)
     10 -> Sprite's own color register ($D027 - $D02E)
     11 -> Sprite Multicolor Register 1 ($D026)

Related registers (for color selection):
 - $D025 — Sprite Multicolor Register 0 (shared)
 - $D026 — Sprite Multicolor Register 1 (shared)
 - $D027-$D02E — Sprite color registers (sprite 0..7 unique color)
 - See also: Bit 4 of $D016 — VIC-II multicolor character/bitmap mode
```

## Key Registers
- $D01C - VIC-II - Sprite Multicolor enable bits (sprite 0-7)
- $D025-$D026 - VIC-II - Shared sprite multicolor registers (multicolor 0 and 1)
- $D027-$D02E - VIC-II - Sprite color registers (sprite 0..7 unique color)
- $D016 - VIC-II - Control register (Bit 4 selects character/bitmap multicolor mode) 

## References
- "sprite_color_registers" — expands on per-sprite color registers $D027-$D02E
- "sprite_multicolor_shared_registers" — expands on registers $D025-$D026 for shared multicolor values

## Labels
- SPMC
