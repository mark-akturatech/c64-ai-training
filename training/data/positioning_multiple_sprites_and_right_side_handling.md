# Positioning multiple hardware sprites; showing sprites past X=255 (VIC-II, $D000 family)

**Summary:** Example BASIC program and explanation showing how to define three sprites (pointers at 2040..2047), enable multiple sprites (VIC-II $D015), set sprite colors ($D027-$D02E), set X/Y positions ($D000-$D00F), and how to display a sprite past X=255 by setting the sprite's X MSB bit in $D010 (V+16).

**Explanation**

- **Sprite Data Placement:** In this example, sprite data is placed at memory page starting at decimal 832 (pointer value 13, since pointer = address/64). Each sprite uses 64 bytes; the program fills addresses 832–895 with 255 to create solid-square sprites.

- **Sprite Pointers:** Sprite pointers are stored in RAM at decimal 2040..2047 (one byte per sprite). Setting 2040..2042 = 13 points sprites 0, 1, and 2 to memory starting at 13*64 = 832.

- **Enabling Sprites:** Enable sprites by writing the sprite-enable bits to VIC-II register $D015 (V+21). `POKE V+21,7` sets bits 0–2, enabling sprites 0, 1, and 2.

- **Setting Sprite Colors:** Sprite colors are set in registers $D027–$D02E (V+39..V+46). The example sets sprite 0 color to 1, sprite 1 to 7, and sprite 2 to 8.

- **Setting X and Y Positions:** X and Y low bytes are at $D000–$D00F (V through V+15): pairings are X0 ($D000), Y0 ($D001), X1 ($D002), Y1 ($D003), etc.

- **Positioning Sprites Beyond X=255:** Sprites can be positioned past the 0–255 X low-range by setting the sprite's MSB bit in $D010 (V+16). Each bit in $D010 corresponds to a sprite (bit 0 = sprite 0, bit 1 = sprite 1, ...). Setting a sprite's bit makes the X counter wrap and continue at 256 (X low byte starts over from 0 at the 256th pixel). For example, to place sprite 0 at pixel 256+24, set bit 0 in $D010 and set $D000 to 24.

- **Useful POKE Sequences:**
  - Set right-half (MSB) for sprite 0 and place at 256+24: `POKE V+16,PEEK(V+16) OR 1 : POKE V,24`
  - Clear MSB for sprite 0 (return to left side): `POKE V+16,PEEK(V+16) AND 254`

- **Sprite Positioning Chart:**

  The following chart lists the locations of each sprite position register:

  | Location (Decimal) | Location (Hex) | Description                      |
  |--------------------|----------------|----------------------------------|
  | 53248              | $D000          | Sprite 0 X Position Register     |
  | 53249              | $D001          | Sprite 0 Y Position Register     |
  | 53250              | $D002          | Sprite 1 X Position Register     |
  | 53251              | $D003          | Sprite 1 Y Position Register     |
  | 53252              | $D004          | Sprite 2 X Position Register     |
  | 53253              | $D005          | Sprite 2 Y Position Register     |
  | 53254              | $D006          | Sprite 3 X Position Register     |
  | 53255              | $D007          | Sprite 3 Y Position Register     |
  | 53256              | $D008          | Sprite 4 X Position Register     |
  | 53257              | $D009          | Sprite 4 Y Position Register     |
  | 53258              | $D00A          | Sprite 5 X Position Register     |
  | 53259              | $D00B          | Sprite 5 Y Position Register     |
  | 53260              | $D00C          | Sprite 6 X Position Register     |
  | 53261              | $D00D          | Sprite 6 Y Position Register     |
  | 53262              | $D00E          | Sprite 7 X Position Register     |
  | 53263              | $D00F          | Sprite 7 Y Position Register     |
  | 53264              | $D010          | Sprite X MSB Register            |

  *Note:* The position of a sprite is calculated from the top-left corner of the 24x21 dot area that your sprite can be designed in. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_3/page_138.html?utm_source=openai))

## Source Code

```basic
10 PRINT"{clear}": v=53248: FOR s=832 TO 895: POKE s,255: NEXT
20 FOR m=2040 TO 2042: POKE m,13: NEXT
30 POKE v+21,7
40 POKE v+39,1: POKE v+40,7: POKE v+41,8
50 POKE v,24: POKE v+1,50
60 POKE v+2,12: POKE v+3,229
70 POKE v+4,255: POKE v+5,50

REM Examples to move a sprite into the >255 X area:
REM Set sprite-0 MSB and place sprite 0 at 256+24:
POKE v+16,PEEK(v+16) OR 1 : POKE v,24

REM Same, checking right edge:
POKE v+16,1: POKE v,65: POKE v+1,75

REM Clear sprite-0 MSB (back to normal 0-255 X range):
POKE v+16,PEEK(v+16) AND 254
```

## Key Registers

- **$D000-$D00F:** VIC-II - Sprite 0-7 X (even offsets) and Y (odd offsets) low bytes (X0=$D000, Y0=$D001, X1=$D002, ...)
- **$D010:** VIC-II - Sprite X MSB bits / control (bit 0 = sprite 0 X MSB, bit 1 = sprite 1 X MSB, ...)
- **$D015:** VIC-II - Sprite enable bits (bitmask to enable sprites 0-7)
- **$D027-$D02E:** VIC-II - Sprite 0-7 color registers

## References

- "sprite_pointers_and_memory_location_formula" — sprite pointer table (2040..2047) and pointer->address formula (pointer*64 = sprite data address)
- C64 Programmer's Reference Guide: Programming Graphics - Sprites ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_3/page_138.html?utm_source=openai))
- How C64 Sprites Work - Retro Game Coders ([retrogamecoders.com](https://retrogamecoders.com/how-c64-sprites-work/?utm_source=openai))