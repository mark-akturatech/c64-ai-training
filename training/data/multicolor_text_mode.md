# The MOS 6567/6569 video controller (VIC-II) — Multicolor text mode (ECM=0, BMM=0, MCM=1)

**Summary:** Describes VIC-II multicolor text mode (ECM=0, BMM=0, MCM=1) behavior: c-data bit 11 selects single-bit-per-pixel text or 2‑bits-per-pixel multicolor characters; g-data interpretation depends on the MC flag and maps pixel codes to $D021/$D022/$D023 and c-data bits 8–10. Searchable terms: VIC-II, multicolor text, c-data bit11, MC flag, $D021, $D022, $D023.

## Mode behavior
- Mode: Multicolor text (ECM=0, BMM=0, MCM=1) — characters can be displayed as four-colored at the cost of halved horizontal resolution.
- c-data bit 11 (MC flag):
  - If bit 11 = 0: character is displayed as standard text (1 bpp), foreground colors limited to 0–7 (standard single-bit-per-pixel behavior).
  - If bit 11 = 1: the 8 pattern bits of each character byte are interpreted as four 2-bit pixels (adjacent bit pairs form one pixel), effectively reducing horizontal resolution (pixels twice as wide).
- c-data encoding when MC flag = 1:
  - Bits 10–8 (three bits) hold the color used when a 2-bit pixel code is '11'.
  - Bit 11 is the MC flag.
- g-data (character graphic pattern) interpretation:
  - g-access address uses the same mapping as text mode (character bitmap fetches unchanged).
  - If MC flag = 0: g-data represents 8 pixels = 8 bits (1 bpp):
    - '0' = background color 0 ($D021)
    - '1' = color from bits 8–10 of c-data (foreground)
  - If MC flag = 1: g-data represents 4 pixels = 2 bits/pixel; pixel codes map to colors:
    - '00' = background color 0 ($D021)
    - '01' = background color 1 ($D022) — NOTE: '01' is also treated as background for sprite priority and collision detection
    - '10' = background color 2 ($D023)
    - '11' = color from c-data bits 8–10 (stored in c-data)
- Sprite priority/collision: the pixel code '01' is treated as background for priority and collision logic (see sprite_priority_and_collision for expanded details).

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
 | MC |   Color of   | D7 | D6 | D5 | D4 | D3 | D2 | D1 | D0 |
 |flag|  "11" pixels |    |    |    |    |    |    |    |    |
 +----+--------------+----+----+----+----+----+----+----+----+
```

```text
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
 |                                       | MC flag = 0
 | "0": Background color 0 ($D021)       |
 | "1": Color from bits 8-10 of c-data   |
 +---------------------------------------+
 |         4 pixels (2 bits/pixel)       |
 |                                       |
 | "00": Background color 0 ($D021)      | MC flag = 1
 | "01": Background color 1 ($D022)      |
 | "10": Background color 2 ($D023)      |
 | "11": Color from bits 8-10 of c-data  |
 +---------------------------------------+
```

## Key Registers
- $D021-$D023 - VIC-II - Background color registers used by multicolor text mode (Background 0 = $D021, Background 1 = $D022, Background 2 = $D023)

## References
- "sprite_priority_and_collision" — treatment of '01' as background affects sprite collision and priority handling

## Labels
- $D021
- $D022
- $D023
