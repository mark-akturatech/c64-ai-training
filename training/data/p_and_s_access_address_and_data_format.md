# VIC-II sprite p-access and s-access formats (MP/MC pointer scheme)

**Summary:** Describes the VIC‑II p-access and s-access address/data formats used to fetch sprite pointers and sprite bitmap data, including bitfields VM13..VM10, MP7..MP0, MC5..MC0 and the meaning of s-access data bits (standard 1bpp and multicolor 2bpp encodings referencing $D025, $D026 and $D027-$D02E).

## Overview
This node documents how the MOS 6567/6569 (VIC‑II) forms addresses for sprite pointer reads (p-access) and subsequent sprite bitmap reads (s-access), and how the returned data bits map to pixels in standard and multicolor sprite modes.

- p-access: The VIC issues a pointer (p-access) address with VM13..VM10 in the high nibble and the sprite number in the low bits; the byte returned (MP7..MP0) is the sprite pointer (upper 8 bits) used to form the full sprite bitmap address for s-accesses.
- s-access: The VIC forms the s-access address by concatenating MP7..MP0 (high bits) with MC5..MC0 (low bits) to access the sprite bitmap bytes; the byte returned is interpreted differently depending on standard (1 bit/pixel) vs multicolor (2 bits/pixel) mode.
- Color registers used by these interpretations are the VIC‑II color registers: multicolor 0 ($D025), multicolor 1 ($D026), and sprite color registers ($D027–$D02E).

Do not confuse the pointer byte (MP7..MP0) with the pointer register in main CPU memory: MP is the value returned by p-access reads and directly becomes the high part of the s-access address (see referenced chunks for full address math).

## Address and data formats (summary)
- p-access address format: high bits VM13..VM10 plus constant one-bits in the middle and sprite number in the low bits; p-access returns 8-bit sprite pointer MP7..MP0.
- s-access address format: MP7..MP0 form the upper address bits, MC5..MC0 form the lower address bits — together they form the full address used for the sprite bitmap read.
- s-access data interpretation:
  - Standard (1 bit/pixel): each bit = 0 transparent, 1 = sprite color (sprite's own color register, $D027–$D02E).
  - Multicolor (2 bits/pixel): two-bit pairs encode: 00 transparent, 01 = multicolor 0 ($D025), 10 = sprite color ($D027–$D02E), 11 = multicolor 1 ($D026).

For timing and precise when p‑ and s‑accesses occur during the raster line, and how MP/MC combine into a 14-bit/16-bit bus address for actual DRAM accesses, see the referenced chunks.

## Source Code
```text
p-access

 Addresses

 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+
 | 13 | 12 | 11 | 10 |  9 |  8 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |  0 |
 +----+----+----+----+----+----+----+----+----+----+----+--------------+
 |VM13|VM12|VM11|VM10|  1 |  1 |  1 |  1 |  1 |  1 |  1 |Sprite number |
 +----+----+----+----+----+----+----+----+----+----+----+--------------+

 Data

 +----+----+----+----+----+----+----+----+
 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |  0 |
 +----+----+----+----+----+----+----+----+
 | MP7| MP6| MP5| MP4| MP3| MP2| MP1| MP0|
 +----+----+----+----+----+----+----+----+


s-access

 Addresses

 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+
 | 13 | 12 | 11 | 10 |  9 |  8 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |  0 |
 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+
 | MP7| MP6| MP5| MP4| MP3| MP2| MP1| MP0| MC5| MC4| MC3| MC2| MC1| MC0|
 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+

 Data

 +----+----+----+----+----+----+----+----+
 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |  0 |
 +----+----+----+----+----+----+----+----+
 |         8 pixels (1 bit/pixel)        |
 |                                       | MxMC = 0
 | "0": Transparent                      |
 | "1": Sprite color ($d027-$d02e)       |
 +---------------------------------------+
 |         4 pixels (2 bits/pixel)       |
 |                                       |
 | "00": Transparent                     | MxMC = 1
 | "01": Sprite multicolor 0 ($d025)     |
 | "10": Sprite color ($d027-$d02e)      |
 | "11": Sprite multicolor 1 ($d026)     |
 +---------------------------------------+
```

## Key Registers
- $D000-$D02E - VIC-II - VIC-II register block including sprite control, sprite pointer reads, sprite color registers and multicolor registers (relevant: $D025 multicolor 0, $D026 multicolor 1, $D027-$D02E sprite colors).

## References
- "sprite_memory_layout_and_pointer_mechanism" — expands on how the p-access pointer forms the upper address bits for s-accesses
- "sprite_display_modes_and_x_y_expansion" — expands on how bits returned by s-access map to pixels in standard and multicolor modes
- "s_access_timing_and_bus_takeover" — expands on when p- and s-accesses occur within a raster line and timing/bus behavior