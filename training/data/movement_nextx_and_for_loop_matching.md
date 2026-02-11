# LINE 90: NEXT X

**Summary:** Explains BASIC statement NEXT X in the program loop controlling a sprite: it advances the FOR...NEXT X loop (line 50), causing the sprite to change shape via DATA first and then jump 3 horizontal X positions (faster, "dancelike" motion) rather than moving one position at a time.

## Explanation
NEXT X is the closing statement of the FOR X...NEXT X loop defined earlier (line 50). In this program the sequence is:

- The sprite is cycled through one of three shapes defined by DATA statements.
- Only after the sprite shape has been advanced to the next DATA entry does the sprite move horizontally.
- The horizontal move is a jump of 3 X positions per loop iteration (not a one-position smooth scroll). Stepping by 3 positions produces a faster, more "dancelike" motion for the sprite.
- Timing (how fast the loop repeats) is controlled separately (delay loop / POKE-based timing); NEXT X controls the discrete horizontal stepping amount and the loop iteration.

(Short parenthetical: X here is the loop variable for horizontal position.)

## References
- "sprite_horizontal_position_and_wrapping" — how X position changes interact with LX/RX and screen wrapping
- "poke_sprite_pointer_poke2040_and_delay_loop" — how the delay loop and pointer POKE control sprite speed and shape-timing
