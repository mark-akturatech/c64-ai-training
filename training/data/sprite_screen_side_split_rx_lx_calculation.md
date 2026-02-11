# LINE 55 — RX / LX horizontal-position math for sprite movement

**Summary:** Explains the LINE 55 computations RX = INT(X/256) and LX = X - RX*256 used in a sprite movement loop to split a 9-bit X coordinate into a low 8-bit VIC X position and a high bit written to the VIC sprite-X-MSB register ($D010, VIC-II). Shows how RX becomes 0/1 for screen halves so POKE V+16 can select left/right halves.

## Computation (LINE 55)
RX = INT(X/256)
- Integer division of X by 256 yields the high (9th) bit of a 9-bit X coordinate.
- For typical sprite screen use (X in 0..511) RX = 0 when X < 256 (left half) and RX = 1 when X ≥ 256 (right half).
- (Values X ≥ 512 produce RX ≥ 2 — not commonly used for single-screen sprite placement.)

LX = X - RX*256
- Subtracting RX*256 removes the high bit from X, leaving the low 8 bits (0..255).
- LX is the value you POKE into the VIC low-X register (0–255). When X crosses 256->257, LX resets to 1 (at X=256 LX becomes 0), matching the hardware low-byte behavior so the MSB (RX) can be stored separately.

How this is used in the movement loop
- Each loop iteration computes RX and LX from a full X coordinate.
- POKE V+16,RX (V = VIC base, $D000) writes the sprite-X-MSB bits (sprite high X-bit bitmap) so the VIC knows the screen half for each sprite.
- POKE the appropriate VIC X low register with LX so the low 8 bits position the sprite within that half.
- Net result: a continuous horizontal coordinate from 0..511 is represented by (RX,LX) -> (VIC X MSB, VIC X low).

Edge cases and notes
- For single-screen 0..255 motion RX always 0; only when crossing the 256 boundary must RX be set to 1 and LX wrap to 0..255.
- Ensure the sprite index used when writing the MSB bit in $D010 matches the low-byte register you POKE for LX.
- **[Note: Source may contain an error — the original text uses V+16 in decimal; V is VIC base ($D000), so V+16 = $D010.]**

## Source Code
```basic
RX=INT(X/256)
LX=X-RX*256
REM Use RX to POKE V+16 with 0 or 1 (set sprite X MSB for right side)
```

## Key Registers
- $D010 - VIC-II - Sprite X MSB (high-bit for sprites 0-7; written via POKE V+16)

## References
- "sprite_horizontal_movement_loop" — expands on these formulas evaluated each loop iteration to position the sprite horizontally
- "sprite_color_and_y_position" — shows Y handling separately; RX/LX handle X across screen halves
- "sprite_pointer_setting_p_equals_192" — pointer changes combined with RX/LX create full animated movement

## Labels
- $D010
