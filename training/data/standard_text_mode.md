# MOS 6567/6569 VIC-II — Standard text mode (ECM=0, BMM=0, MCM=0)

**Summary:** Describes VIC-II standard text mode addressing and pixel semantics: video-matrix (c-access) uses VM13..VM10 + VC0..VC9 to form a 12-bit matrix address; character generator (g-access) uses CB13..CB11 + character byte + RC2..RC0 to select an 8-bit character row. Foreground color is the 4-bit color nybble in c-data; background is global $D021.

## Standard text mode (ECM/BMM/MCM = 0/0/0)
In standard text mode the VIC-II reads an 8-bit character pointer from the video matrix; that pointer selects one of 256 characters in the character generator. Each character is 8×8 pixels stored as eight successive bytes in the character generator (one byte per row).

- Video matrix addressing (c-access): a 14-bit address where VM13..VM10 (from $D018) select the high page of the video matrix and VC0..VC9 form the lower 10 bits (character index within the matrix). The 12-bit matrix address selects the character pointer byte.
- c-data layout (video matrix byte): bits 0–7 = character pointer (character number), bits 8–11 = 4-bit foreground color nybble used for pixels with value 1.
- Character generator addressing (g-access): formed from CB13..CB11 (from $D018), the character byte D7..D0 (the pointer read from the matrix), and RC2..RC0 (character row counter) to select one of the 8 bytes for that character row.
- g-data layout (character row byte): 8 bits correspond to 8 horizontal pixels; bit=0 => background color (global) at $D021, bit=1 => foreground color from c-data bits 8–11.
- Character set and video matrix can be relocated in RAM by setting CB11–CB13 and VM10–VM13 bits in register $D018 (VIC memory pointer register).

No multicolor modes or extended characters are active in this configuration (ECM/BMM/MCM all zero), therefore each character pixel maps 1:1 to a screen pixel.

## Source Code
```text
c-access

 Addresses

 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+
 | 13 | 12 | 11 | 10 |  9 |  8 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |  0 |
 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+
 |VM13|VM12|VM11|VM10| VC9| VC8| VC7| VC6| VC5| VC4| VC3| VC2| VC1| VC0|
 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+

 Data

 +----+----+----+----+----+----+----+----+----+----+----+----+
 | 11 | 10 |  9 |  8 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |  0 |
 +----+----+----+----+----+----+----+----+----+----+----+----+
 |      Color of     | D7 | D6 | D5 | D4 | D3 | D2 | D1 | D0 |
 |     "1" pixels    |    |    |    |    |    |    |    |    |
 +-------------------+----+----+----+----+----+----+----+----+

g-access

 Addresses

 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+
 | 13 | 12 | 11 | 10 |  9 |  8 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |  0 |
 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+
 |CB13|CB12|CB11| D7 | D6 | D5 | D4 | D3 | D2 | D1 | D0 | RC2| RC1| RC0|
 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+

 Data

 +----+----+----+----+----+----+----+----+
 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |  0 |
 +----+----+----+----+----+----+----+----+
 |         8 pixels (1 bit/pixel)        |
 |                                       |
 | "0": Background color 0 ($D021)       |
 | "1": Color from bits 8-11 of c-data   |
 +---------------------------------------+
```

## Key Registers
- $D018 - VIC-II - VM10..VM13 (video matrix base) and CB11..CB13 (character generator base) memory pointer bits
- $D021 - VIC-II - Background/border color register (background color used for g-data bit=0)

## References
- "vc_and_rc" — expands on VC/RC select c/g addresses and RC selects character row
- "color_palette" — expands on palette indices used for foreground/background

## Labels
- D018
- D021
