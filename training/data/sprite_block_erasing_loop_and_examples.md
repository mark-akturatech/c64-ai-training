# Erasing 8-pixel blocks inside a C64 sprite (BASIC POKE example)

**Summary:** Demonstrates a BASIC loop that POKEs zeros into sprite bitmap bytes at decimal addresses 836–891 (within 832–894), illustrating how sprite pixels are stored as 3 bytes per row (24 × 21 sprite = 63 bytes) and how STEP 3 selects one 8-pixel vertical block (byte) per row.

**Explanation**

A standard single-color C64 sprite is 24 pixels wide × 21 rows = 504 pixels, stored as 3 bytes per row (24 bits = 3 × 8). This results in 63 consecutive bytes of bitmap data for one sprite. In this example, these 63 bytes occupy decimal addresses 832 through 894 inclusive (832 + 62 = 894).

Bytes for each scanline are stored consecutively as three 8-pixel groups: left, middle, right. Stepping by 3 through the sprite data selects the same byte position within each row — i.e., a vertical 8-pixel stripe through the sprite:
- Start = 832 (and then +3) selects the left 8-pixel column of each row.
- Start = 833 (and then +3) selects the middle 8-pixel column of each row.
- Start = 834 (and then +3) selects the right 8-pixel column of each row.

The provided BASIC line:
writes 0 into every third byte starting at 836, clearing one vertical 8-pixel stripe across the sprite. (836 is in the "middle column" class for this 832-base sprite block; different start values within 832–894 will target different vertical byte-columns.)

To ensure the sprite data is correctly associated with a sprite number, the sprite pointer must be set accordingly. Sprite pointers are located at memory addresses 2040 to 2047, corresponding to sprites 0 through 7. Each pointer holds a value that, when multiplied by 64, gives the starting address of the sprite data. For example, to associate sprite 0 with the sprite data starting at address 832 (which is 13 × 64), you would set:
This tells the VIC-II chip to use the sprite data located at address 832 for sprite 0. ([lemon64.com](https://www.lemon64.com/hosted/manual/manual/7_4.html?utm_source=openai))

The source also suggests experimenting by POKEing any addresses from 832 to 894 with 255 (0xFF - solid 8 pixels) or 0 (blank) to alter the sprite shape manually.

## Source Code

```basic
90 FOR A=836 TO 891 STEP 3:POKE A,0:NEXT A
```

```basic
POKE 2040,13
```

```basic
90 FOR A=836 TO 891 STEP 3:POKE A,0:NEXT A
```

```text
Sprite bitmap address map (example block: decimal 832–894 = 63 bytes)
Each row consists of 3 bytes: [byte0 = left 8 pixels], [byte1 = middle 8 pixels], [byte2 = right 8 pixels]
Row 0: 832  833  834
Row 1: 835  836  837
Row 2: 838  839  840
Row 3: 841  842  843
Row 4: 844  845  846
Row 5: 847  848  849
Row 6: 850  851  852
Row 7: 853  854  855
Row 8: 856  857  858
Row 9: 859  860  861
Row10: 862  863  864
Row11: 865  866  867
Row12: 868  869  870
Row13: 871  872  873
Row14: 874  875  876
Row15: 877  878  879
Row16: 880  881  882
Row17: 883  884  885
Row18: 886  887  888
Row19: 889  890  891
Row20: 892  893  894
```

Notes:
- Writing 0 (POKE …,0) clears that byte (blank 8 pixels); writing 255 (POKE …,255) sets all 8 pixels solid.
- The example loop (start 836 STEP 3) targets the middle 8-pixel vertical stripe for this particular 832-based sprite block.

## References
- "sprite_bitmap_memory_blocks_and_manual_editing" — expands on which byte addresses correspond to 8-pixel blocks being modified
- "crunched_sprite_program_and_optimization_tip" — shows how similar POKE operations can be combined when shrinking a program
