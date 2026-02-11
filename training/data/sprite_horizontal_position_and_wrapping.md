# LINE 60 — POKEV, POKEV+16: sprite 0 horizontal (LX / RX) placement

**Summary:** Explains how `POKE V,LX` sets sprite 0's horizontal low byte (LX 0–255) and how `POKE V+16,RX` sets the MSB ("right side" carry) for positions ≥256. Mentions VIC-II sprite registers $D000 (sprite 0 X low) and $D010 (sprite X MSB bits).

**Explanation**
- `POKE V,LX` writes the low 8 bits of sprite 0's horizontal position (denoted LX) into the VIC-II sprite-X register (LX ranges 0–255). As LX increments to 255, it wraps back to 0 due to the LX equation: `LX = X - RX * 256`, where `RX = INT(X / 256)`. This means LX is effectively taken modulo 256. ([commodore.ca](https://www.commodore.ca/manuals/c64_programmers_reference/c64-programmers_reference_guide-03-programming_graphics.pdf?utm_source=openai))
- To place a sprite beyond X=255, set the sprite X MSB bit. `POKE V+16,RX` writes the RX bit (0 or 1) into the VIC-II register that holds the high X bits for all sprites; for sprite 0, this is bit 0. When RX = 1, the sprite's effective horizontal position is LX + 256 (i.e., placed on the "right side" of the screen). ([commodore.ca](https://www.commodore.ca/manuals/c64_programmers_reference/c64-programmers_reference_guide-03-programming_graphics.pdf?utm_source=openai))
- Combined effect (numeric formula): `X_position = LX + 256 * RX` (where LX = value poked to V, RX = bit for sprite 0 in V+16).
- The V+16 register contains MSB bits for all eight sprites (one bit per sprite). Writing RX to V+16 will affect that shared register (the source text describes only sprite 0's RX as 0 or 1).

## Source Code
```text
SPRITEMAKING CHART (Page 176)

SPRITE CONTROL REGISTERS

Register | Function
---------|---------
V+21     | Enable/disable sprites (bit 0 = sprite 0, bit 1 = sprite 1, ..., bit 7 = sprite 7)
V+23     | Expand sprites horizontally (bit 0 = sprite 0, ..., bit 7 = sprite 7)
V+29     | Expand sprites vertically (bit 0 = sprite 0, ..., bit 7 = sprite 7)
V+28     | Set sprite multicolor mode (bit 0 = sprite 0, ..., bit 7 = sprite 7)
V+39     | Sprite 0 color
V+40     | Sprite 1 color
V+41     | Sprite 2 color
V+42     | Sprite 3 color
V+43     | Sprite 4 color
V+44     | Sprite 5 color
V+45     | Sprite 6 color
V+46     | Sprite 7 color
```

## Key Registers
- $D000 - VIC-II - Sprite 0 X position (low 8 bits, LX)
- $D010 - VIC-II - Sprite X MSB bits (bits 0-7 = MSB for sprites 0-7; bit 0 = RX for sprite 0)

## References
- "poke_sprite_pointer_poke2040_and_delay_loop" — where P (the sprite pointer) is later applied with POKE 2040,P
- "increment_pointer_and_wrap_three_sprite_shapes" — pointer-wrapping logic (P reset) and how it interacts with horizontal positioning and RX/LX sequencing

## Labels
- $D000
- $D010
