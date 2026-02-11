# Overview of Sprite Control Registers

**Summary:** Sprite control registers on the VIC-II map many controls as bitfields (bit 0 → sprite 0, bit 1 → sprite 1, …) while other controls that require numeric values have one register per sprite (e.g., vertical position, color). See SPREN ($D015) for the sprite-enable bitmask and the per-sprite color registers SPRCL0–SPRCL7 for per-sprite color values.

**Sprite Controls**

Most VIC-II sprite-control registers use a one-bit-per-sprite layout: each bit in the register corresponds to one of the eight hardware sprites (bit 0 = sprite 0, bit 1 = sprite 1, …, bit 7 = sprite 7). These bitmapped registers are used for boolean flags that apply independently to each sprite (examples include enable/disable masks and other per-sprite toggle flags).

Controls that require a numeric value (position, color, pointers) are implemented as one register per sprite. In those cases, the VIC-II provides a separate byte for each sprite (for example: per-sprite X and Y positions and per-sprite color registers).

Practical consequences:

- To enable or disable individual sprites, you write a bitmask where the bit for each sprite toggles that sprite (see SPREN $D015).
- To set a sprite’s vertical position or its color, you write to that sprite’s dedicated register (one byte per sprite).
- Bit order is fixed: least-significant bit corresponds to sprite 0, most-significant bit corresponds to sprite 7.

This chunk is an overview; detailed register addresses and per-register bit layouts are covered in the referenced chunks.

## Source Code

```text
| Register Name | Address | Description | Type |
|---------------|---------|-------------|------|
| SPRX0         | $D000   | Sprite 0 X Position | Per-sprite |
| SPRY0         | $D001   | Sprite 0 Y Position | Per-sprite |
| SPRX1         | $D002   | Sprite 1 X Position | Per-sprite |
| SPRY1         | $D003   | Sprite 1 Y Position | Per-sprite |
| SPRX2         | $D004   | Sprite 2 X Position | Per-sprite |
| SPRY2         | $D005   | Sprite 2 Y Position | Per-sprite |
| SPRX3         | $D006   | Sprite 3 X Position | Per-sprite |
| SPRY3         | $D007   | Sprite 3 Y Position | Per-sprite |
| SPRX4         | $D008   | Sprite 4 X Position | Per-sprite |
| SPRY4         | $D009   | Sprite 4 Y Position | Per-sprite |
| SPRX5         | $D00A   | Sprite 5 X Position | Per-sprite |
| SPRY5         | $D00B   | Sprite 5 Y Position | Per-sprite |
| SPRX6         | $D00C   | Sprite 6 X Position | Per-sprite |
| SPRY6         | $D00D   | Sprite 6 Y Position | Per-sprite |
| SPRX7         | $D00E   | Sprite 7 X Position | Per-sprite |
| SPRY7         | $D00F   | Sprite 7 Y Position | Per-sprite |
| SPRXMSB       | $D010   | Most Significant Bit of X Position | Bitmapped |
| SPREN         | $D015   | Sprite Enable | Bitmapped |
| SPRYEXP       | $D017   | Sprite Y Expansion | Bitmapped |
| SPRXEXP       | $D01D   | Sprite X Expansion | Bitmapped |
| SPRPRIO       | $D01B   | Sprite Priority | Bitmapped |
| SPRMC         | $D01C   | Sprite Multicolor Mode | Bitmapped |
| SPRCOL0       | $D027   | Sprite 0 Color | Per-sprite |
| SPRCOL1       | $D028   | Sprite 1 Color | Per-sprite |
| SPRCOL2       | $D029   | Sprite 2 Color | Per-sprite |
| SPRCOL3       | $D02A   | Sprite 3 Color | Per-sprite |
| SPRCOL4       | $D02B   | Sprite 4 Color | Per-sprite |
| SPRCOL5       | $D02C   | Sprite 5 Color | Per-sprite |
| SPRCOL6       | $D02D   | Sprite 6 Color | Per-sprite |
| SPRCOL7       | $D02E   | Sprite 7 Color | Per-sprite |
```

## Key Registers

- $D015 - VIC-II - Sprite enable bitmask (SPREN) — one bit per sprite (bit 0 → sprite 0 ... bit 7 → sprite 7)

## References

- "sprite_enable_register_spren_d015" — Enabling/disabling individual sprites (SPREN $D015)
- "sprite_color_registers_list_sprcl0_sprcl7" — Per-sprite color registers and their addresses

## Labels
- SPREN
- SPRX0
- SPRY0
- SPRXMSB
- SPRPRIO
- SPRMC
- SPRCOL0
