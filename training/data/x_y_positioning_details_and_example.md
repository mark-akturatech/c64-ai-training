# Sprite X/Y positioning and V+16 MSB handling (C64 VIC-II)

**Summary:** How to POKE sprite X ($D000-$D00F) and Y positions ($D000-$D00F) on the VIC-II, how values <24 place a sprite partly/fully off the left edge, valid Y visible range (50–229), and how to use the sprite X MSB register ($D010) to access X positions beyond 255 (right-side MSB bit per-sprite).

**X position (horizontal)**
- Sprite X low byte registers are at VIC-II base $D000 with sprite n using $D000/$D001 for sprite 0, $D002/$D003 for sprite 1, etc.; low X is an 8-bit value 0–255 (see Key Registers).
- X = 0..255 counts left→right. Values 0..23 place all or part of the sprite off the left edge (not visible or partially visible); values 24..255 place the sprite within the visible area (24 is the leftmost visible X).
- To place a sprite beyond the 255th horizontal pixel you must set the sprite's MSB bit in the VIC-II sprite-MSBS register at $D010, then set the low X to the desired value (the low X counter restarts at 0 once the MSB is set). Each sprite has one bit in $D010 representing its X high bit (sprite 0 = bit0 (1), sprite 1 = bit1 (2), etc.).
- You may set the MSB with: POKE $D010, PEEK($D010) OR bitmask. Clear with AND inverse mask (example for sprite 1: set OR 2, clear AND 253).

**Y position (vertical)**
- Sprite Y is stored in the Y registers paired with X (see Key Registers). Y counts top→bottom as 0..255.
- Y = 0..49 places all or part of the sprite off the top of the screen. Y = 50..229 places the sprite within the visible area. Y = 230..255 places all or part of the sprite off the bottom of the screen.

**MSB / right-side X handling (example for sprite 1)**
- For sprite 1 the MSB bit is bit 1 (value 2) in $D010.
- To move sprite 1 to the first pixel beyond X=255:
  - Set the MSB: POKE $D010, PEEK($D010) OR 2
  - Set low X to 0: POKE $D002, 0
  - To return to normal 0..255 X range clear the bit: POKE $D010, PEEK($D010) AND 253
- You can OR/AND with the current $D010 value (PEEK/POKE) to modify one sprite's MSB without changing others.

**Example BASIC program (defines sprite 1 as a solid box and positions it)**
- This example uses V = 53248 ($D000). It sets sprite 1 image memory, enables the sprite and positions it at X=24 Y=50. It also shows changing to Y=229 and X=255 and using $D010 to access right-side positions.

## Source Code
```basic
10 PRINT "{CLEAR}": V=53248: POKE V+21,2: POKE 2041,13
20 FOR S=832 TO 895: POKE S,255: NEXT: POKE V+40,7
30 POKE V+2,24
40 POKE V+3,50
```

Additional example edits (from the same source):
```basic
40 POKE V+3,229    ' move sprite to bottom-left visible (Y=229)
30 POKE V+2,255    ' move sprite to right limit (low byte = 255)

' To go beyond X=255 for sprite 1:
30 POKE V+16,PEEK(V+16) OR 2: POKE V+2,0

' To clear the MSB for sprite 1 (return to normal X range):
POKE V+16,PEEK(V+16) AND 253
```

(Notes: V+2 is sprite 1 X low; V+3 is sprite 1 Y; V+16 is $D010.)

## Key Registers
- $D000-$D00F - VIC-II - Sprite 0–7 X (low) and Y registers (pairs: $D000/$D001 = sprite0 X/Y, $D002/$D003 = sprite1 X/Y, …)
- $D010 - VIC-II - Sprite X most-significant bits (one bit per sprite) and related sprite control bits

**X-Y POKE Chart (Figure 3-5)**
To display a sprite in a given location, you must POKE the X and Y settings for each sprite. Remember that every sprite has its own unique X POKE and Y POKE. The X and Y settings for all 8 sprites are shown here:

| Function | Sprite 0 | Sprite 1 | Sprite 2 | Sprite 3 | Sprite 4 | Sprite 5 | Sprite 6 | Sprite 7 |
|----------|----------|----------|----------|----------|----------|----------|----------|----------|
| Set X    | V,X      | V+2,X    | V+4,X    | V+6,X    | V+8,X    | V+10,X   | V+12,X   | V+14,X   |
| Set Y    | V+1,Y    | V+3,Y    | V+5,Y    | V+7,Y    | V+9,Y    | V+11,Y   | V+13,Y   | V+15,Y   |
| Right X  | V+16,1   | V+16,2   | V+16,4   | V+16,8   | V+16,16  | V+16,32  | V+16,64  | V+16,128 |

**POKEing an X Position:** The possible values of X are 0 to 255, counting from left to right. Values 0 to 23 place all or part of the sprite out of the viewing area off the left side of the screen; values 24 to 255 place the sprite in the viewing area up to the 255th position. To place the sprite at one of these positions, just type the X-position POKE for the sprite you're using. For example, to POKE sprite 1 at the farthest left X position in the viewing area, type: `POKE V+2,24`.

**X Values Beyond the 255th Position:** To get beyond the 255th position across the screen, you need to make a second POKE using the numbers in the "Right X" row of the chart (Figure 3-5). Normally, the horizontal (X) numbering would continue past the 255th position to 256, 257, etc., but because registers only contain 8 bits, we must use a "second register" to access the right side of the screen and start our X numbering over again at 0. So to get beyond X position 255, you must POKE V+16 and a number (depending on the sprite). This gives you 65 additional X positions (renumbered from 0 to 65) in the viewing area on the right side of the viewing screen. (You can actually POKE the right side X value as high as 255, which takes you off the right edge of the viewing screen.)

**POKEing a Y Position:** The possible values of Y are 0 to 255, counting from top to bottom. Values 0 to 49 place all or part of the sprite out of the viewing area off the top of the screen. Values 50 to 229 place the sprite in the viewing area. Values 230 to 255 place all or part of the sprite out of the viewing area off the bottom of the screen.

## References
- "positioning_sprites_on_screen_and_xy_poke_chart" — expands on using V+16 MSB pokes in practice