# Creating a C64 sprite (24×21) — convert a 24×21 grid into 63 DATA bytes

**Summary:** Step-by-step method for converting a 24×21 sprite grid into 63 decimal byte values for Commodore 64 DATA statements. Covers grouping pixels in 8-wide chunks, using binary bit weights (128..1), 3 groups per row × 21 rows = 63 values, and packing those values into DATA lines (crunched or line-by-line).

**Procedure**
- **Sprite dimensions:** 24 pixels across × 21 pixels down = 504 pixels total.
- **Grouping:** Divide each row into three horizontal groups of 8 pixels (left → right). Each group becomes one byte (0–255).
- **Bit weights (leftmost bit is MSB):** 128, 64, 32, 16, 8, 4, 2, 1.
- **Byte value calculation:** For each 8-pixel group, add the weights of the solid (filled) pixels to get a decimal 0–255 value.
  - Example:
    - If all eight pixels are filled → 128+64+32+16+8+4+2+1 = 255.
    - If only the leftmost pixel is filled → 128.
    - If all eight are blank → 0.
- **DATA layout in the program:**
  - The special DATA section starts at line 100.
  - Conceptually, each program line represents one sprite row. Each row contains three numbers (one per 8-pixel group).
  - 21 rows × 3 numbers = 63 DATA values. You may enter them as one DATA statement per row (3 numbers) or compress them into a single long DATA block (crunched DATA) containing all 63 values.
- **Practical workflow:**
  1. Draw the sprite on a 24×21 graph grid (paper or printed grid).
  2. For each row, process groups left-to-right: for each 8-pixel group mark which pixels are solid and sum the corresponding bit weights.
  3. Enter the resulting decimal values in the DATA section of the spritemaking program (line-by-line or crunched).
  4. Repeat for all 21 rows until you have 63 values.

## Source Code
```text
10 REM SPRITE CREATION PROGRAM
20 V=53248
30 POKE V+21,1 : REM ENABLE SPRITE 0
40 POKE 2040,13 : REM SPRITE POINTER TO MEMORY BLOCK 13
50 FOR I=0 TO 62
60 READ A
70 POKE 832+I,A : REM STORE SPRITE DATA IN MEMORY
80 NEXT I
90 POKE V+39,1 : REM SET SPRITE COLOR TO WHITE
100 POKE V,100 : REM SET SPRITE X POSITION
110 POKE V+1,100 : REM SET SPRITE Y POSITION
120 END
130 DATA 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
```

## References
- "sprite_example_hot_air_balloon_program" — expands on example uses DATA to define sprite bytes
- "sprite_program_crunched_example" — expands on how to crunch DATA statements for a sprite
