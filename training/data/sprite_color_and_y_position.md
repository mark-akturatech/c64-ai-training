# Sprite 0: color and Y position (POKE V+39, POKE V+1)

**Summary:** Demonstrates how to set the color and vertical (Y) position of sprite 0 on the Commodore 64 using BASIC. The variable `V` represents the base address of the VIC-II chip registers, which is $D000 (53248 in decimal). Specifically, `POKE V+39,15` sets the color of sprite 0 to light grey, and `POKE V+1,68` positions sprite 0 at Y-coordinate 68.

**Explanation**

- `POKE V+39,15` writes the value 15 to the sprite 0 color register (`V+39` corresponds to $D027). In the C64 color palette, 15 represents light grey.
- `POKE V+1,68` sets the Y-coordinate of sprite 0 by writing 68 to the sprite 0 Y-position register (`V+1` corresponds to $D001). The Y-coordinate determines the vertical position of the sprite on the screen.
- The variable `V` is defined as the base address of the VIC-II chip registers, which is $D000 (53248 in decimal). This allows for easier reference to the VIC-II registers by adding offsets to `V`.

**Note:** The original source mentions setting the "upper right hand corner" of the sprite square to a vertical position. This is likely a typographical error, as the Y-position register sets the vertical position of the sprite's top edge. The correct term should be "upper left hand corner" or "top edge."

## Source Code

```basic
10 REM LINE 35:
20 POKE V+39,15         : REM Sets color for sprite 0 to light grey.
30 POKE V+1,68          : REM Sets the upper left hand corner of the sprite
40                      : REM square to vertical (Y) position 68. For the sake
50                      : REM of comparison, position 50 is the top left hand corner
60                      : REM Y position on the viewing screen.
```

## Key Registers

- $D001-$D008: VIC-II - Sprite 0-7 Y positions
- $D027-$D02E: VIC-II - Sprite 0-7 color registers

## References

- "sprite_shape1_load_loop" — expands on how color and position apply to sprite shapes loaded into memory
- "sprite_pointer_setting_p_equals_192" — expands on pointer-swapping combined with position and color to animate the sprite

## Labels
- LIGHT_GRAY
