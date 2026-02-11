# Sprite definition format (VIC-II)

**Summary:** The VIC-II chip in the Commodore 64 supports hardware sprites, which are movable graphical objects. Each sprite is 24×21 pixels, stored in 63 bytes arranged as 21 rows of 3 bytes each. In high-resolution mode, each bit represents a pixel (1 for foreground, 0 for transparent). In multicolor mode, horizontal bit pairs define pixels, allowing up to four colors with reduced horizontal resolution. The VIC-II can handle up to 8 hardware sprites (numbered 0–7), each with its own definition block, position registers, color register, enable bits, and collision detection bits.

**Defining a Sprite**

- **Size:** 24 pixels wide × 21 pixels tall = 504 pixels.
- **Storage:** 504 bits = 63 bytes, arranged as 21 rows of 3 bytes each.
- **High-resolution (hi-res) mode:** Each bit represents a pixel: 1 = foreground (sprite color), 0 = transparent.
- **Multicolor mode:** Each pair of bits represents a pixel, reducing horizontal resolution to 12 pixels. Each displayed pixel is two hardware dots wide, allowing up to 4 colors via VIC-II multicolor encoding.
- **Sprite components:**
  - Sprite definition block in memory (63 bytes).
  - Position registers.
  - Color register.
  - Enable bits and collision detection bits in VIC-II control registers.

## Source Code

```text
Sprite size and layout summary:

Total pixels: 24 × 21 = 504 pixels
Total bytes: 504 / 8 = 63 bytes

Layout: 21 rows × 3 bytes per row
Row 0:   BYTE 0   BYTE 1   BYTE 2   (24 bits)
Row 1:   BYTE 3   BYTE 4   BYTE 5
Row 2:   BYTE 6   BYTE 7   BYTE 8
...
Row 19:  BYTE 57  BYTE 58  BYTE 59
Row 20:  BYTE 60  BYTE 61  BYTE 62

Notes:
- In hi-res mode, each bit within the 24 bits of a row represents one pixel: 1 = sprite pixel (foreground color), 0 = transparent.
- In multicolor mode, bits are grouped in pairs across the row: each bit-pair defines one multicolor pixel (reduces horizontal resolution to 12 columns, each rendered twice as wide).
```

## Key Registers

- **Sprite Pointers:** Memory locations 2040–2047 ($07F8–$07FF) hold the sprite pointers for sprites 0–7, respectively. Each pointer contains a value from 0 to 255, which, when multiplied by 64, gives the starting address of the sprite data within the current VIC-II memory bank. For example, if the pointer for sprite 0 (at location 2040) contains the value 14, the sprite data starts at address 14 × 64 = 896. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_3/page_133.html?utm_source=openai))

- **VIC-II Memory Banks:** The VIC-II can access one of four 16 KB memory banks:
  - Bank 0: $0000–$3FFF
  - Bank 1: $4000–$7FFF
  - Bank 2: $8000–$BFFF
  - Bank 3: $C000–$FFFF

  The active bank is selected via bits 0 and 1 of the CIA #2 Port A register at location 56576 ($DD00). The bit patterns are:
  - 00: Bank 3
  - 01: Bank 2
  - 10: Bank 1
  - 11: Bank 0

  When the VIC-II is set to Bank 0 or Bank 2, certain areas contain a ROM image of the character set, and sprite definitions cannot be placed there. For more than 128 different sprite definitions, use Bank 1 or Bank 3. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_3/page_134.html?utm_source=openai))

- **Sprite Enable Register:** Location 53269 ($D015) controls the enabling of sprites. Each bit corresponds to a sprite (bit 0 for sprite 0, bit 1 for sprite 1, etc.). Setting a bit to 1 enables the corresponding sprite. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_3/page_134.html?utm_source=openai))

## References

- "sprite_multicolor_mode_bit_pairs" — details on how sprite multicolor bit-pairs map to VIC-II palette colors.
- "sprite_pointers_and_memory_location_formula" — information on sprite definition block locations and pointer calculations.