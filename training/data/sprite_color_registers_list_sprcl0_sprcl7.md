# Sprite color registers (SPRCx $D027-$D02E)

**Summary:** Sprite color registers in the VIC-II (addresses $D027-$D02E) select one of the 16 palette colors for each hardware sprite; set bits in a sprite bitmap display the sprite color while clear bits are transparent. See also SPREN $D015 (sprite enable), MLTSP $D01C (per-sprite multicolor), and multicolor mode behavior.

## Sprite color registers
There are eight hardware sprite color registers, one per sprite. Each register holds a 4-bit color index (one of 16 VIC-II palette colors) that the VIC-II uses when a sprite pixel is active. In standard (hi-res) sprite mode, a set bit in the sprite pattern data produces a pixel in the sprite's color; a clear bit is transparent and the background shows through. (Multicolor mode changes pixel interpretation to bit‑pairs; see multicolor references.)

Enabling and positioning sprites (so they are visible) is handled by SPREN $D015 and sprite position registers; per-sprite multicolor enable is at MLTSP $D01C. This chunk covers only the color registers themselves.

## Source Code
```text
Name      Address
SPRCLO    $D027
SPRCL1    $D028
SPRCL2    $D029
SPRCL3    $D02A
SPRCL4    $D02B
SPRCL5    $D02C
SPRCL6    $D02D
SPRCL7    $D02E

Notes:
- Each register selects any of the 16 available VIC-II colors (0-15).
- In standard sprite mode: pattern bit = 1 -> sprite color shown; bit = 0 -> transparent.
- Multicolor mode interprets pattern bits as pairs (affects color usage).
```

## Key Registers
- $D027-$D02E - VIC-II - Sprite color registers (sprite 0-7)

## References
- "sprite_enable_register_spren_d015" — Sprites must be enabled (SPREN $D015) and positioned to be visible
- "multicolor_mode_overview" — How multicolor mode changes pixel interpretation (bit-pairs) and affects which color registers are used
- "multicolor_mode_enable_mltsp_d01c" — Per-sprite multicolor enable (MLTSP $D01C)

## Labels
- SPRCLO
- SPRCL1
- SPRCL2
- SPRCL3
- SPRCL4
- SPRCL5
- SPRCL6
- SPRCL7
