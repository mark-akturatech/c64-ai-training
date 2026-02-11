# $D01F — SPBGCL (Sprite-to-Foreground Collision Register)

**Summary:** $D01F (SPBGCL) is a VIC-II register that reports sprite-to-foreground (text/bitmap) collisions; bits 0–7 correspond to sprites 0–7 (1 = collision). Reading the register clears its contents.

## Description
Each bit of $D01F indicates whether the corresponding hardware sprite (0–7) has collided with the foreground display (text or bitmap) since the last read. A set bit (1) means that sprite collided with foreground pixels. The act of reading $D01F clears the register (read-to-clear behavior).

## Source Code
```text
$D01F        SPBGCL       Sprite to Foreground Collision Register

                     0    Did Sprite 0 collide with the foreground display?  (1=yes)
                     1    Did Sprite 1 collide with the foreground display?  (1=yes)
                     2    Did Sprite 2 collide with the foreground display?  (1=yes)
                     3    Did Sprite 3 collide with the foreground display?  (1=yes)
                     4    Did Sprite 4 collide with the foreground display?  (1=yes)
                     5    Did Sprite 5 collide with the foreground display?  (1=yes)
                     6    Did Sprite 6 collide with the foreground display?  (1=yes)
                     7    Did Sprite 7 collide with the foreground display?  (1=yes)
```

## Key Registers
- $D01F - VIC-II - Sprite-to-Foreground Collision Register

## References
- "sprite_collision_rules_and_notes" — rules for collision detection and interpretation

## Labels
- SPBGCL
