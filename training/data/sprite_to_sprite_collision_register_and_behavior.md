# VIC-II Sprite-to-Sprite Collision Register ($D01E / 53278)

**Summary:** VIC-II sprite-to-sprite collision flags live at $D01E (decimal 53278). Each bit (0–7) is set when the corresponding sprite participates in any sprite-sprite collision; the register is read-cleared (PEEK clears it). Collisions may be detected even when sprites are off-screen.

## Sprite-to-Sprite Collisions
The VIC-II detects collisions when a non-zero pixel of one sprite overlaps a non-zero pixel of another sprite. These events are reflected in the sprite-to-sprite collision register at $D01E (53278). Behavior details:

- Bits 0–7 correspond to sprites 0–7; a bit set to 1 indicates that sprite is involved in at least one sprite-sprite collision.
- The register latches collision states; bits remain set until the register byte is read (PEEK 53278). Reading the register automatically clears all bits, so store the read value in a variable if you need to examine it later.
- Collisions are reported even if the involved sprites are off-screen (i.e., off visible border/bitmap area), so tests should not assume on-screen presence.
- Sprite-to-data (sprite/background/character) collisions are separate and documented elsewhere (see References).

## Source Code
```text
; VIC-II Sprite-to-Sprite Collision Register
; Address: $D01E  (decimal 53278)
; Bit layout (bit7..bit0):
;   bit7 - Sprite 7 collision flag
;   bit6 - Sprite 6 collision flag
;   bit5 - Sprite 5 collision flag
;   bit4 - Sprite 4 collision flag
;   bit3 - Sprite 3 collision flag
;   bit2 - Sprite 2 collision flag
;   bit1 - Sprite 1 collision flag
;   bit0 - Sprite 0 collision flag
;
; Notes:
; - A bit = 1 => that sprite was involved in one or more sprite-sprite collisions.
; - Reading ($D01E) clears the register (all bits reset to 0).
; - Use PEEK(53278) in BASIC or LDA $D01E in assembly to read/clear.
```

## Key Registers
- $D01E - VIC-II - Sprite-to-sprite collision flags (bits 0-7 => sprites 0-7)

## References
- "sprite_to_data_collision_register_and_notes" — sprite-to-background/data collisions and read/clearing behavior