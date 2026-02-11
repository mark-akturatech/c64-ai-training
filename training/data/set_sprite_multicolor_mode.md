# VIC-II: Sprite multicolor mode control ($D01C / 53276)

**Summary:** Use the VIC-II control register $D01C (decimal 53276) to enable or disable multicolor mode per hardware sprite (SN = 0..7) via BASIC POKE/PEEK bit masks. Enable with OR (2^SN); disable with AND (255-2^SN).

## Description
The VIC-II register at $D01C (decimal 53276) holds one bit per sprite (sprite 0..7). Setting a sprite's bit turns that sprite into multicolor mode; clearing the bit returns it to single-color (hi-res) sprite mode. SN is the sprite number 0–7 and the mask for sprite SN is 2^SN (bit with value 1<<SN).

Note: multicolor mode changes how sprite pixels are interpreted (uses 2-bit color pairs, reducing horizontal resolution).

## Enabling and disabling per-sprite multicolor (BASIC)
- To enable multicolor for sprite SN: set the corresponding bit in $D01C.
- To disable multicolor for sprite SN: clear the corresponding bit in $D01C.
- SN must be 0..7. Mask = 2^SN (decimal).

## Source Code
```basic
REM Enable multicolor for sprite SN (SN = 0..7)
POKE 53276, PEEK(53276) OR (2^SN)

REM Disable multicolor for sprite SN (SN = 0..7)
POKE 53276, PEEK(53276) AND (255 - 2^SN)

REM Example: enable multicolor for sprite 3
POKE 53276, PEEK(53276) OR 8

REM Example: disable multicolor for sprite 3
POKE 53276, PEEK(53276) AND (255 - 8)
```

## Key Registers
- $D01C (53276) - VIC-II - Sprite multicolor enable bits (bit0 = sprite0 ... bit7 = sprite7)

## References
- "sprite_multicolor_mode_bit_pairs" — expands on color mapping for bit pairs when multicolor is enabled