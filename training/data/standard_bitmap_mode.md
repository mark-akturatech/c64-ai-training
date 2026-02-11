# VIC-II Standard Bitmap Mode (ECM=0, BMM=1, MCM=0)

**Summary:** Description of the VIC-II standard bitmap mode (ECM=0, BMM=1, MCM=0) for the Commodore 64: 320×200 1‑bit-per‑pixel bitmap with color information supplied per 8×8 video-matrix cell; bitmap and matrix base selection controlled by VM10–VM13 and CB13 in $D018.

## Standard bitmap mode (ECM=0, BMM=1, MCM=0)
In this VIC-II bitmap mode each bit in a 320×200 bitmap represents one pixel on screen (1 bpp). The color for a block of 8×8 pixels is taken from the 40×25 video matrix; therefore color granularity is 8×8 pixels. The VIC forms an 8×8 block from eight successive bytes of bitmap data (not a simple linear scanline layout).

Two access types are defined:

- c-access (color/video-matrix access): addresses select entries in the 40×25 video matrix; each entry is a color nybble pair (foreground for '1' and background for '0') plus unused upper bits. The matrix supplies two 4‑bit colors per 8×8 cell: bits 4–7 are color for pixels whose bitmap bit is 1, bits 0–3 are color for bitmap bits 0.

- g-access (graphics/bitmap access): addresses select bytes from the 320×200 bitmap; each byte holds 8 pixels (bit‑7 leftmost -> bit‑0 rightmost). When the bitmap bit is 0 the pixel color is taken from c-data bits 0–3; when the bitmap bit is 1 the pixel color is taken from c-data bits 4–7.

The base addresses of both the video matrix and the bitmap are controlled by VM10–VM13 and CB13 respectively (bits in register $D018). Logical address bit composition used by the VIC for c-access and g-access is shown below.

Behavioral notes (explicit from source):
- Bitmap: 320×200, 1 bit per pixel.
- Video matrix: 40×25 entries; each entry contains two 4‑bit color nybbles (color for '1' and color for '0').
- The VIC constructs an 8×8 pixel block from 8 successive bytes fetched by g-access; color selection for each pixel uses the corresponding video-matrix entry (c-access) for that 8×8 block.
- CB13 plus VC9..VC0 and RC2..RC0 form the bitmap address bits used for g-access (see bit maps below).

## Source Code
```text
Overview:
- Bitmap: 320 x 200 pixels, 1 bit per pixel (8 pixels per byte)
- Video matrix: 40 x 25 entries, one entry per 8x8 block (color nybbles)
- $D018 bits VM10-VM13 and CB13 select matrix/bitmap bases

c-access

 Addresses (14 bits shown: bit13..bit0)
 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+
 | 13 | 12 | 11 | 10 |  9 |  8 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |  0 |
 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+
 |VM13|VM12|VM11|VM10| VC9| VC8| VC7| VC6| VC5| VC4| VC3| VC2| VC1| VC0|
 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+

 Data (12 bits shown: bit11..bit0)
 +----+----+----+----+----+----+----+----+----+----+----+----+
 | 11 | 10 |  9 |  8 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |  0 |
 +----+----+----+----+----+----+----+----+----+----+----+----+
 |       unused      |     Color of      |     Color of      |
 |                   |    "1" pixels     |    "0" pixels     |
 +-------------------+-------------------+-------------------+

- Interpretation: c-data is a byte where bits 4..7 form the color index for bitmap bits=1, bits 0..3 form the color index for bitmap bits=0.
- Video-matrix resolution: one c-data value per 8x8 screen block (40x25).

g-access

 Addresses (14 bits shown: bit13..bit0)
 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+
 | 13 | 12 | 11 | 10 |  9 |  8 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |  0 |
 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+
 |CB13| VC9| VC8| VC7| VC6| VC5| VC4| VC3| VC2| VC1| VC0| RC2| RC1| RC0|
 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+

 Data (8 bits)
 +----+----+----+----+----+----+----+----+
 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |  0 |
 +----+----+----+----+----+----+----+----+
 |         8 pixels (1 bit/pixel)        |
 |                                       |
 | "0": Color from bits 0-3 of c-data    |
 | "1": Color from bits 4-7 of c-data    |
 +---------------------------------------+

- RC2..RC0 are the row-in-character bits (0..7) selecting which of the 8 bytes in the 8x8 tile is fetched.
- VC9..VC0 address the 40x25 cell coordinates (combined with VM bits and CB13 as base select).
- CB13 selects the bitmap bank high bit (bit 13 of the final graphics address).

Notes:
- The VIC forms 8×8 blocks from 8 successive bytes (RC2..RC0 cycle through 0..7), using a single c-data entry per block for color selection.
- The video matrix remains 40×25 (one c-data per 8×8), so per-pixel color is chosen from two 4-bit nybbles in the c-data byte.
```

## Key Registers
- $D018 - VIC-II - VM10–VM13 and CB13 (video-matrix base and bitmap base selection bits)

## Labels
- D018
- VM10
- VM11
- VM12
- VM13
- CB13
