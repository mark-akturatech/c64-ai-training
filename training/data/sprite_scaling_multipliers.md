# Sprite multipliers (X/Y expansion)

**Summary:** Sprite X/Y expansion is controlled by VIC‑II registers SPRXSZ ($D01D) and SPRYSZ ($D017); setting a sprite's bit in the appropriate register doubles each pixel in that axis (resolution unchanged), clearing the bit returns it to normal.

## Using the sprite multipliers
Each sprite (0–7) can be independently expanded in X and/or Y. Expansion doubles the displayed size of each sprite pixel in the chosen direction only — the sprite's pixel resolution does not change.

- X expansion: set the sprite's bit in SPRXSZ ($D01D). Clear the bit to return to normal.
- Y expansion: set the sprite's bit in SPRYSZ ($D017). Clear the bit to return to normal.
- Both axes: a sprite can be expanded in both X and Y simultaneously by setting its bit in both registers.

Bits correspond to sprite numbers (bit 0 → sprite 0, bit 1 → sprite 1, … bit 7 → sprite 7). Use bit masks to set/clear individual sprite expansion bits without disturbing the others (read-modify-write).

## Source Code
```text
Register: SPRYSZ ($D017) - Sprite Y expansion (VIC-II)
  Bit 7  Bit 6  Bit 5  Bit 4  Bit 3  Bit 2  Bit 1  Bit 0
  S7     S6     S5     S4     S3     S2     S1     S0
  1 = Y-expanded for that sprite, 0 = normal height

Register: SPRXSZ ($D01D) - Sprite X expansion (VIC-II)
  Bit 7  Bit 6  Bit 5  Bit 4  Bit 3  Bit 2  Bit 1  Bit 0
  S7     S6     S5     S4     S3     S2     S1     S0
  1 = X-expanded for that sprite, 0 = normal width

Common bit masks (hex):
  Sprite 0: %00000001 = $01
  Sprite 1: %00000010 = $02
  Sprite 2: %00000100 = $04
  Sprite 3: %00001000 = $08
  Sprite 4: %00010000 = $10
  Sprite 5: %00100000 = $20
  Sprite 6: %01000000 = $40
  Sprite 7: %10000000 = $80

Example (read-modify-write concept only; not an instruction listing):
  - To set X expansion for sprite 2: OR $D01D with $04
  - To clear Y expansion for sprite 2: AND $D017 with %11111011 (i.e. clear bit 2)
```

## Key Registers
- $D017 - VIC-II - SPRYSZ: Sprite Y expansion bits (bit0 = sprite0 … bit7 = sprite7)
- $D01D - VIC-II - SPRXSZ: Sprite X expansion bits (bit0 = sprite0 … bit7 = sprite7)

## References
- "sprite_basic_properties_and_sizes" — expands on expanded size (no extra technical detail)

## Labels
- SPRYSZ
- SPRXSZ
