# C64 I/O Map — $D010 (VIC‑II 53264) MSIGX — Most Significant Bits of Sprites 0–7 Horizontal Position

**Summary:** $D010 (VIC‑II MSIGX) holds the most significant (9th) bit for the horizontal X position of sprites 0–7; each bit (bit0..bit7) adds 256 to the corresponding sprite's horizontal position, extending X range to 0–511. Use together with sprite X low bytes in $D000–$D007 to form a 9‑bit horizontal coordinate.

## Register description
$D010 provides the MSB for each sprite's horizontal position (sprite X high bit). Each bit corresponds to one sprite: setting the bit adds 256 to that sprite's X position; clearing the bit limits the sprite X to 0–255. Combine the bit in $D010 with the low 8 bits stored in $D000–$D007 (VIC‑II sprite X low bytes) to form a full 9‑bit horizontal position (0–511).

- Bit mapping: bit0 → sprite 0, bit1 → sprite 1, …, bit7 → sprite 7.
- Purpose: extend sprite horizontal positioning beyond 8‑bit range by providing the 9th bit (MSB).

## Source Code
```text
$D010        MSIGX        Most Significant Bits of Sprites 0-7 Horizontal Position

                     0    Most significant bit of Sprite 0 horizontal position
                     1    Most significant bit of Sprite 1 horizontal position
                     2    Most significant bit of Sprite 2 horizontal position
                     3    Most significant bit of Sprite 3 horizontal position
                     4    Most significant bit of Sprite 4 horizontal position
                     5    Most significant bit of Sprite 5 horizontal position
                     6    Most significant bit of Sprite 6 horizontal position
                     7    Most significant bit of Sprite 7 horizontal position

                          Setting one of these bits to 1 adds 256 to the horizontal position of
                          the corresponding sprite.  Resetting one of these bits to 0 restricts
                          the horizontal position of the corresponding sprite to a value of 255
                          or less
```

## Key Registers
- $D010 - VIC‑II - Most significant bits (MSB) of sprites 0–7 horizontal position (sprite X high bits)

## References
- "sprite_horizontal_and_vertical_position_registers_description" — How to form 9-bit horizontal position

## Labels
- MSIGX
