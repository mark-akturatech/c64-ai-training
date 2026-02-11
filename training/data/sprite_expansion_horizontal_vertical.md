# Expanded Sprites (VIC-II X/Y magnification)

**Summary:** How to enable/disable sprite horizontal and vertical expansion on the VIC-II using registers $D01D (53277) and $D017 (53271) with POKE/PEEK bit operations; uses sprite numbers 0–7 and doubles dot width/height without changing resolution.

**Description**
The VIC-II supports per-sprite expansion (magnification) in X, Y, or both. When a sprite is expanded, each sprite dot becomes twice as wide (X expansion) and/or twice as tall (Y expansion). This increases the displayed size but does not change the sprite's internal resolution.

- Horizontal expansion is controlled by bits for sprites 0–7 in VIC-II control register $D01D (decimal 53277). Set the bit for sprite N to enable horizontal expansion; clear it to disable.
- Vertical expansion is controlled by bits for sprites 0–7 in VIC-II register $D017 (decimal 53271). Set the bit for sprite N to enable vertical expansion; clear it to disable.

SN denotes the sprite number (0–7). The bit operations use OR with 2^SN to set and AND with (255-2^SN) to clear the bit.

## Source Code
```basic
POKE 53277,PEEK(53277)OR(2^SN)      ' Set horizontal expansion bit for sprite SN
POKE 53277,PEEK(53277)AND (255-2^SN) ' Clear horizontal expansion bit for sprite SN

POKE 53271,PEEK(53271)OR(2^SN)      ' Set vertical expansion bit for sprite SN
POKE 53271,PEEK(53271)AND (255-2^SN) ' Clear vertical expansion bit for sprite SN
```

## Key Registers
- $D017 (53271) - VIC-II - Vertical (Y) expansion bits for sprites 0–7 (1 = double-height)
- $D01D (53277) - VIC-II - Horizontal (X) expansion bits for sprites 0–7 (1 = double-width)

## References
- "sprite_position_registers_and_addresses" — covers positioning expanded sprites, X/Y registers and MSB handling

## Labels
- D017
- D01D
