# Sprite X/Y positioning (LINE 70 / LINE 80)

**Summary:** Explains sprite horizontal (X) and vertical (Y) positioning via VIC-II sprite registers (POKE V for X, POKE V+1 for Y). V is the base video-chip address for a given sprite (V / V+1 map to VIC-II sprite X/Y registers, $D000-$D00F); examples show visible-left limit X=24 and sample Y positions (50, 100, 229).

## Explanation
LINE 70 in the original BASIC program sets the sprite's HORIZONTAL (X) position. The X value stored at the sprite's X register represents the X-coordinate of the sprite's UPPER-LEFT corner. On a standard TV display the farthest left visible X value is 24; values down to 0 are accepted and will move the sprite off-screen to the left.

LINE 80 sets the sprite's VERTICAL (Y) position. The Y register specifies the Y-coordinate of the sprite's upper-left corner.

In the program, V is used as the base address for a sprite's X register; V+1 is the corresponding Y register. POKEing those addresses writes the sprite coordinates directly to the VIC-II.

Examples used in DIRECT mode:
- POKE V,24:POKE V+1,50 — place the sprite near the upper-left corner of the visible screen.
- POKE V,24:POKE V+1,229 — place the sprite at the lower-left corner.

(Short note: V is the BASIC variable holding the VIC-II address for the sprite's X register.)

## Source Code
```basic
REM LINE 70 determines the HORIZONTAL (X) POSITION of the sprite (upper-left corner)
REM LINE 80 determines the VERTICAL (Y) POSITION of the sprite

REM Example DIRECT-mode pokes:
POKE V,24:POKE V+1,50    : REM places sprite at upper-left visible corner
POKE V,24:POKE V+1,229   : REM places sprite at lower-left corner
```

## Key Registers
- $D000-$D00F - VIC-II - Sprite 0-7 X (even offsets) and Y (odd offsets) positions (POKE V / V+1 maps here)
- $D010 - VIC-II - Sprite X high-bit register (MSB bits for sprites 0-7)

## References
- "sprite_memory_allocation_and_video_register" — expands on V holding the base VIC-II address for sprite X/Y registers
- "tv_screen_coordinate_figure_and_caption" — visual depiction of X and Y coordinates on the TV screen