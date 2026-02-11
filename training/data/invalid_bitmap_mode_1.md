# VIC-II invalid bitmap mode 1 (ECM=1, BMM=1, MCM=0)

**Summary:** VIC-II invalid bitmap mode 1 (ECM=1, BMM=1, MCM=0) produces a black screen on the C64; internal bitmap pixels can be read using the sprite-collision trick. g-address bits 9 and 10 are forced to zero, causing the displayed bitmap to consist of four repeated sections and g-data to render as black.

## Description
This invalid bitmap mode behaves structurally like standard bitmap mode, but with two critical differences:

- ECM=1 forces bits 9 and 10 of the g-address to zero, so vertical graphics addressing that would normally vary across those bits is disabled. As a result the graphics area is effectively composed of four sections which are each repeated four times across the displayed bitmap.
- Although the screen appears black, pixel values can still be probed using the sprite collision readout trick (reading internal graphics via sprite-to-background collisions).
- The g-data format in this mode uses 1 bit per pixel (8 pixels per byte). However, both bit values are treated as black in this mode: "0" = Black (background) and "1" = Black (foreground). Therefore the visible output is fully black even though distinct bit patterns exist internally.

The tables below show the c-access and g-access address bit layouts and the g-data layout for this mode (as given by the source).

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
```

```text
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
 |         8 pixels (1 bit/pixel)        |
 |                                       |
 | "0": Black (background)               |
 | "1": Black (foreground)               |
 +---------------------------------------+
```

## References
- "invalid_bitmap_mode_2" — expands on related invalid bitmap mode with ECM set and multicolor enabled (MCM set)
