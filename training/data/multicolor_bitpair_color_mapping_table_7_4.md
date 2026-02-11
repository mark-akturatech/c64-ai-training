# Sprite multicolor bit-pair → color mapping (multicolor sprite mode)

**Summary:** Maps the two-bit pairs in a VIC-II sprite's bitmap data (00, 01, 10, 11) to the resulting pixel interpretation in multicolor sprite mode; references VIC-II registers $D025 (multicolor 0), $D026 (multicolor 1), and per-sprite color registers ($D027-$D02E).

**Description**
In VIC-II multicolor sprite mode, each pair of bits in the sprite bitmap (2 bits per pixel) is interpreted as one of four outcomes. This table defines the mapping used by the hardware:

- 00 = transparent (pixel shows the underlying screen/background color)
- 01 = sprite multicolor register #0 (VIC-II $D025)
- 10 = per-sprite color register (the sprite's own color, VIC-II $D027-$D02E)
- 11 = sprite multicolor register #1 (VIC-II $D026)

This mapping is applied to every two-bit group in the 64-byte sprite data for a sprite when the sprite is set to multicolor mode. Use the VIC-II multicolor registers and the per-sprite color registers to select the palette entries that 01/10/11 map to.

To enable multicolor mode for a specific sprite, set the corresponding bit in the VIC-II control register at $D01C. Each bit in this register corresponds to a sprite (bit 0 for sprite 0, bit 1 for sprite 1, and so on). Setting a bit to 1 enables multicolor mode for that sprite; setting it to 0 keeps the sprite in standard (high-resolution) mode. For example, to enable multicolor mode for sprite 0:


## Source Code

```assembly
LDA $D01C
ORA #%00000001  ; Set bit 0 to enable multicolor mode for sprite 0
STA $D01C
```

```text
Table 7-4: Relationship Between Bit Pairs and Color Registers in Multicolor Mode

Bit Pair   Description / Resulting Pixel
00         TRANSPARENT (screen/background color)
01         SPRITE MULTICOLOR REGISTER #0   ($D025)
10         SPRITE COLOR REGISTER           (per-sprite color, $D027-$D02E)
11         SPRITE MULTICOLOR REGISTER #1   ($D026)
```

## Key Registers
- $D025 - VIC-II - Sprite multicolor register #0
- $D026 - VIC-II - Sprite multicolor register #1
- $D027-$D02E - VIC-II - Sprite color registers (per-sprite color for sprites 0–7)
- $D01C - VIC-II - Sprite multicolor mode enable register

## References
- "multicolor_sprite_mode_overview" — expands on why bit-pair mapping matters (resolution and color selection)
- "multicolor_mode_enable_mltsp_d01c" — expands on how to enable the multicolor interpretation per sprite
- "sprite_color_registers_list_sprcl0_sprcl7" — expands on uses of the per-sprite color register in the mapping (bit-pair 10)

## Labels
- $D025
- $D026
- $D027-$D02E
- $D01C
