# $D01E — SPSPCL (Sprite-to-Sprite Collision Register)

**Summary:** $D01E (decimal 53278) is the VIC-II Sprite-to-Sprite Collision register (SPSPCL). Bits 0–7 indicate whether sprite 0–7 collided with any other sprite; reading the register clears its bits (read-to-clear).

## Description
SPSPCL is a single-byte, read-to-clear status register in the VIC-II ($D000-$D02E region) that records sprite-to-sprite collisions. Each bit corresponds to one hardware sprite: when a sprite's non-transparent pixels overlap with any other sprite's non-transparent pixels, the bit for that sprite is set to 1. Reading $D01E clears all bits.

- Bit set = 1 means the corresponding sprite has collided with at least one other sprite since the last read.
- Bits are independent; multiple bits may be set if multiple sprites were involved in collisions.
- The register reports collisions for each sprite (0..7) — the bit flags indicate which sprites experienced collisions, not which sprite they collided with.

## Source Code
(omitted — no code or tables in source)

## Key Registers
- $D01E - VIC-II - Sprite-to-Sprite Collision Register (bits 0–7 map to Sprite 0–7; read clears)

## References
- "sprite_collision_rules_and_notes" — Rules for collision detection and interpretation