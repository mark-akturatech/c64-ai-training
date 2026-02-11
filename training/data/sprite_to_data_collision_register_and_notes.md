# Sprite-to-data collisions ($D01F)

**Summary:** Sprite-to-data (sprite-to-background) collisions are reported by VIC-II register $D01F (decimal 53279); each sprite sets a bit when colliding with non-zero background data, bits are latched until read (PEEK) which clears them. In multicolor mode the color value 01 is treated as transparent for collision detection.

## Sprite-to-data collisions
- The VIC-II sprite-to-data collision register is at $D01F (decimal 53279).  
- Each of the eight sprites has a dedicated bit in $D01F; a bit = 1 indicates that the corresponding sprite has collided with non-zero background (screen or character) data.  
- The bits in $D01F are latched: once set they remain 1 until the register is read (PEEK). Reading the register clears all bits automatically, so store the read value in a variable if you need to examine it later.  
- Important multicolor behavior: when the background uses multicolor graphics, the color code 01 is considered transparent for collision testing (it still displays visually but does not trigger sprite-to-data collisions). To avoid unwanted collisions, make background areas that should not collide use color code 01 in multicolor mode.

## Key Registers
- $D01F - VIC-II - Sprite-to-data collision register; one bit per sprite (bits latched until read)

## References
- "sprite_to_sprite_collision_register_and_behavior" — expands on both collision registers being latched and cleared on read

## Labels
- D01F
