# Sprite multicolor mode — bit-pair to color mapping

**Summary:** VIC-II sprite multicolor mode (enabled per-sprite via MLTSP $D01C) halves horizontal resolution from 24 to 12 pixels and interprets each pair of bits in a sprite byte as a 2-bit color index selecting one of four color sources (multicolor registers or the sprite's own color register).

**Effect and interpretation**
When a sprite's multicolor mode is disabled, each of the 24 horizontal pixels is a single bit: 0 = transparent, 1 = the sprite's individual color (the sprite color register).

When multicolor mode is enabled for a sprite:
- Horizontal resolution is halved: 24 single-bit pixels become 12 two-bit pixels.
- Each adjacent pair of bits in the sprite bitmap is treated as a 2-bit value (00, 01, 10, 11).
- That 2-bit value selects which of four color sources supplies the pixel color (see mapping below).
- The sprite's bitmap bytes are thus decoded 2 bits at a time across each byte; a full sprite row still reads from the same 3 bytes per row but yields 12 multicolor pixels instead of 24 single-bit pixels.

Typical usage:
- Keep backgrounds and other sprite layering implications in mind, because 00 commonly produces transparency (background shows through).
- The global multicolor registers are shared across sprites; the per-sprite color register provides the fourth color option.

## Source Code
```text
Table: Bit-pair -> color source mapping (multicolor sprite mode)

Bit pair  Binary  Meaning / color source
00        0b00    Transparent (no sprite pixel; background shows through)
01        0b01    Multicolor register 1 (global multicolor color 1)
10        0b10    Multicolor register 2 (global multicolor color 2)
11        0b11    Sprite's individual color register (sprite color)

Notes:
- The "sprite's individual color register" is the sprite color byte at $D027 + sprite_number (sprite 0..7).
- Multicolor register 1 and 2 are the VIC-II global multicolor color registers (commonly documented as $D025 and $D026).
- Enabling multicolor per-sprite is controlled by MLTSP bits in $D01C (VIC-II).
- In non-multicolor mode, the single-bit pixel value 1 maps to the sprite's individual color; 0 is transparent.
```

## Key Registers
- $D01C - VIC-II - Sprite multicolor enable bits (MLTSP): enable multicolor per-sprite
- $D025 - VIC-II - Multicolor register 1 (global multicolor color 1)
- $D026 - VIC-II - Multicolor register 2 (global multicolor color 2)
- $D027-$D02E - VIC-II - Sprite color registers (sprite 0..7 individual color bytes)

## References
- "multicolor_bitpair_color_mapping_table_7_4" — detailed mapping of bit-pairs to color registers in multicolor mode
- "multicolor_mode_enable_mltsp_d01c" — how multicolor mode is enabled per sprite (MLTSP $D01C)

## Labels
- MLTSP
- D025
- D026
- D027
