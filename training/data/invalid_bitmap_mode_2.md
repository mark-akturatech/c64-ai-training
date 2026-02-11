# VIC-II Invalid Bitmap Mode 2 (ECM=1, BMM=1, MCM=1)

**Summary:** VIC-II (MOS 6567/6569) invalid bitmap mode with ECM=1, BMM=1, MCM=1 forces g-address bits 9 and 10 to zero (ECM effect), producing a black screen; structure resembles multicolor bitmap (repeated segments), and '01' is treated as background (2bpp mapping yields only black).

## Description
This invalid bitmap mode (ECM/BMM/MCM = 1/1/1) produces a black display but still permits sprite-graphics collisions to be detected ("scanned"). Its memory addressing structure follows the multicolor bitmap layout, except that the ECM setting forces g-address bits 9 and 10 to zero. As a result, the effective graphics addressing and pixel interpretation collapse so that all 2-bit pixel combinations map to black: both background encodings ("00" and "01") and foreground encodings ("10" and "11") produce black, yielding a uniformly black screen. Graphical memory is arranged in repeating segments similar to multicolor bitmap mode.

See the Source Code section for the c-access/g-access address bit layouts and the 2-bit-per-pixel data mapping used by this mode.

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
 |                           unused                          |
 +-----------------------------------------------------------+

g-access

 Addresses

 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+
 | 13 | 12 | 11 | 10 |  9 |  8 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |  0 |
 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+
 |CB13| VC9| VC8|  0 |  0 | VC5| VC4| VC3| VC2| VC1| VC0| RC2| RC1| RC0|
 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+

 Data

 +----+----+----+----+----+----+----+----+
 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |  0 |
 +----+----+----+----+----+----+----+----+
 |         4 pixels (2 bits/pixel)       |
 |                                       |
 | "00": Black (background)              |
 | "01": Black (background)              |
 | "10": Black (foreground)              |
 | "11": Black (foreground)              |
 +---------------------------------------+
```

## References
- "invalid_bitmap_mode_1" — expands on the shared ECM-induced address restrictions affecting both invalid bitmap modes
