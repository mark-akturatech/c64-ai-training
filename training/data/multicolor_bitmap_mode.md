# VIC-II Multicolor Bitmap Mode (ECM=0, BMM=1, MCM=1)

**Summary:** VIC-II multicolor bitmap mode (ECM=0, BMM=1, MCM=1) produces 2-bit-per-pixel (2bpp) pixels by combining adjacent bits, reducing resolution to 160×200; c-data stores three 4-bit colors for bit-combinations '11','01','10' and g-data supplies four 2-bit pixels per byte where "00" selects background color at $D021. Searchable terms: VIC-II, multicolor bitmap, 2bpp, c-access, g-access, $D021.

## Description
- Pixel formation: Each pair of adjacent bitmap bits forms one 2-bit pixel (two VIC bits → one displayed pixel), halving horizontal resolution from 320 to 160 pixels. Vertical resolution remains 200 (standard VIC bitmap lines).
- Color sources:
  - c-data (color memory / color RAM for bitmap): Each c-byte encodes three 4-bit color values:
    - bits 8–11 → color for "11" pixel codes
    - bits 4–7  → color for "01" pixel codes
    - bits 0–3  → color for "10" pixel codes
  - g-data (bitmap data bytes): Each g-byte contains four 2-bit pixels (bits 7..0 = four 2-bit pairs). The 2-bit codes map to colors as:
    - "00" = Background color 0 (the VIC background register $D021)
    - "01" = Color taken from bits 4–7 of the corresponding c-data byte
    - "10" = Color taken from bits 0–3 of the corresponding c-data byte
    - "11" = Color taken from bits 8–11 of the corresponding c-data byte
- Priority and collision: The 2-bit code "01" is treated as background for sprite priority and collision detection (same behavior as multicolor text mode). See the referenced chunk for full sprite priority/collision rules in MCM=1 (2bpp).
- Addressing: c-access and g-access follow the VIC-II address bit mappings (VMx/VCx/CBx/RCx fields) shown in the reference diagrams below.

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
 |     Color of      |     Color of      |     Color of      |
 |    "11 pixels"    |    "01" pixels    |    "10" pixels    |
 +-------------------+-------------------+-------------------+
```

```text
g-access

 Addresses

 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+
 | 13 | 12 | 11 | 10 |  9 |  8 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |  0 |
 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+
 |CB13| VC9| VC8| VC7| VC6| VC5| VC4| VC3| VC2| VC1| VC0| RC2| RC1| RC0|
 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+

 Data

 +----+----+----+----+----+----+----+----+
 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |  0 |
 +----+----+----+----+----+----+----+----+
 |         4 pixels (2 bits/pixel)       |
 |                                       |
 | "00": Background color 0 ($D021)      |
 | "01": Color from bits 4-7 of c-data   |
 | "10": Color from bits 0-3 of c-data   |
 | "11": Color from bits 8-11 of c-data  |
 +---------------------------------------+
```

## Key Registers
- $D000-$D02E - VIC-II - Video registers including mode selection bits (ECM/BMM/MCM) and bitmap-related registers

## References
- "sprite_priority_and_collision" — expanded rules for background/foreground determination and collision in MCM=1 (2bpp)

## Labels
- $D021
