# MOS 6567/6569 (VIC-II) — Complete register list ($D000-$D02E)

**Summary:** Complete reference of the 47 VIC-II registers ($D000-$D02E) for the MOS 6567/6569 used in the Commodore 64, including sprite X/Y registers, MSB X bits ($D010), control registers ($D011/$D016), raster ($D012), lightpen ($D013/$D014), sprite enable/expansion/controls ($D015,$D017,$D01B-$D01D), interrupt status/enable ($D019/$D01A), color registers ($D020-$D024) and sprite color/multicolor registers ($D025-$D02E). Notes on repeated mapping every $40, read-only/auto-clear behavior of $D01E/$D01F, and unused bits returning 1.

## Registers (overview)
This chunk lists the VIC-II's 47 read/write registers mapped at $D000–$D02E and their primary functions. Important behavioral notes (from the source) are summarized here:

- Sprite position registers:
  - $D000–$D00F hold X and Y low-byte coordinates for sprites 0–7.
  - $D010 contains the MSB bits for each sprite X coordinate (M0X8..M7X8).
- Control registers:
  - $D011 is Control Register 1. Bit 7 is the MSB for the raster compare (RASTER high bit). Other bits control extended color/bitmap modes, display enable, row select and fine vertical scroll (Y scroll).
  - $D016 is Control Register 2. Contains the (unused/reserved) RES bit, multicolor mode for characters (MCM), charset selection (CSEL), and fine horizontal scroll (X scroll).
- Raster and lightpen:
  - $D012 is the raster counter (low 8 bits). Bit 7 of $D011 supplies the 9th bit for raster compare.
  - $D013/$D014 contain light-pen X/Y latches.
- Sprite enable/expansion and control:
  - $D015 enables/disables sprites (M0E..M7E).
  - $D017 enables Y expansion for sprites (M0YE..M7YE).
  - $D01B–$D01D control sprite priorities, sprite multicolor mode, and X-expansion respectively.
- Collision registers (read-only, auto-clear on read):
  - $D01E reports sprite–sprite collisions (M0M..M7M).
  - $D01F reports sprite–data collisions (M0D..M7D).
  - Both $D01E/$D01F cannot be written and are cleared automatically when read.
- Memory pointers:
  - $D018 holds VM10–VM13 (video matrix / bitmap pointers) and CB11–CB13 (character/bitmap base pointers) used to select screen/charset/bitmap memory pages.
- Interrupts:
  - $D019 is the interrupt status (IRQ) register; contains flags for raster, light-pen, sprite collisions, and memory fetch interrupts (see table in Source Code).
  - $D01A is the interrupt enable register with corresponding enable bits.
- Colors:
  - $D020–$D024 are border and background colors (EC, B0C..B3C).
  - $D025–$D02E define sprite multicolor registers and sprite colors (MM0, MM1, M0C..M7C).
- Read behavior and mirroring:
  - The VIC registers are mirrored every $40 bytes in $D000–$D3FF (register 0 also appears at $D040, $D080, ...).
  - Addresses $D02F–$D03F read as $FF; writes are ignored.
  - Bits marked as not connected return 1 when read.

(See the Source Code section for the original register table and the source notes verbatim.)

## Source Code
```text
The VIC has 47 read/write registers for the processor to control its
functions:

 #| Adr.  |Bit7|Bit6|Bit5|Bit4|Bit3|Bit2|Bit1|Bit0| Function
--+-------+----+----+----+----+----+----+----+----+------------------------
 0| $d000 |                  M0X                  | X coordinate sprite 0
--+-------+---------------------------------------+------------------------
 1| $d001 |                  M0Y                  | Y coordinate sprite 0
--+-------+---------------------------------------+------------------------
 2| $d002 |                  M1X                  | X coordinate sprite 1
--+-------+---------------------------------------+------------------------
 3| $d003 |                  M1Y                  | Y coordinate sprite 1
--+-------+---------------------------------------+------------------------
 4| $d004 |                  M2X                  | X coordinate sprite 2
--+-------+---------------------------------------+------------------------
 5| $d005 |                  M2Y                  | Y coordinate sprite 2
--+-------+---------------------------------------+------------------------
 6| $d006 |                  M3X                  | X coordinate sprite 3
--+-------+---------------------------------------+------------------------
 7| $d007 |                  M3Y                  | Y coordinate sprite 3
--+-------+---------------------------------------+------------------------
 8| $d008 |                  M4X                  | X coordinate sprite 4
--+-------+---------------------------------------+------------------------
 9| $d009 |                  M4Y                  | Y coordinate sprite 4
--+-------+---------------------------------------+------------------------
10| $d00a |                  M5X                  | X coordinate sprite 5
--+-------+---------------------------------------+------------------------
11| $d00b |                  M5Y                  | Y coordinate sprite 5
--+-------+---------------------------------------+------------------------
12| $d00c |                  M6X                  | X coordinate sprite 6
--+-------+---------------------------------------+------------------------
13| $d00d |                  M6Y                  | Y coordinate sprite 6
--+-------+---------------------------------------+------------------------
14| $d00e |                  M7X                  | X coordinate sprite 7
--+-------+---------------------------------------+------------------------
15| $d00f |                  M7Y                  | Y coordinate sprite 7
--+-------+----+----+----+----+----+----+----+----+------------------------
16| $d010 |M7X8|M6X8|M5X8|M4X8|M3X8|M2X8|M1X8|M0X8| MSBs of X coordinates
--+-------+----+----+----+----+----+----+----+----+------------------------
17| $d011 |RST8| ECM| BMM| DEN|RSEL|    YSCROLL   | Control register 1
--+-------+----+----+----+----+----+--------------+------------------------
18| $d012 |                 RASTER                | Raster counter
--+-------+---------------------------------------+------------------------
19| $d013 |                  LPX                  | Light pen X
--+-------+---------------------------------------+------------------------
20| $d014 |                  LPY                  | Light pen Y
--+-------+----+----+----+----+----+----+----+----+------------------------
21| $d015 | M7E| M6E| M5E| M4E| M3E| M2E| M1E| M0E| Sprite enabled
--+-------+----+----+----+----+----+----+----+----+------------------------
22| $d016 |  - |  - | RES| MCM|CSEL|    XSCROLL   | Control register 2
--+-------+----+----+----+----+----+----+----+----+------------------------
23| $d017 |M7YE|M6YE|M5YE|M4YE|M3YE|M2YE|M1YE|M0YE| Sprite Y expansion
--+-------+----+----+----+----+----+----+----+----+------------------------
24| $d018 |VM13|VM12|VM11|VM10|CB13|CB12|CB11|  - | Memory pointers
--+-------+----+----+----+----+----+----+----+----+------------------------
25| $d019 | IRQ|  - |  - |  - | ILP|IMMC|IMBC|IRST| Interrupt register
--+-------+----+----+----+----+----+----+----+----+------------------------
26| $d01a |  - |  - |  - |  - | ELP|EMMC|EMBC|ERST| Interrupt enabled
--+-------+----+----+----+----+----+----+----+----+------------------------
27| $d01b |M7DP|M6DP|M5DP|M4DP|M3DP|M2DP|M1DP|M0DP| Sprite data priority
--+-------+----+----+----+----+----+----+----+----+------------------------
28| $d01c |M7MC|M6MC|M5MC|M4MC|M3MC|M2MC|M1MC|M0MC| Sprite multicolor
--+-------+----+----+----+----+----+----+----+----+------------------------
29| $d01d |M7XE|M6XE|M5XE|M4XE|M3XE|M2XE|M1XE|M0XE| Sprite X expansion
--+-------+----+----+----+----+----+----+----+----+------------------------
30| $d01e | M7M| M6M| M5M| M4M| M3M| M2M| M1M| M0M| Sprite-sprite collision
--+-------+----+----+----+----+----+----+----+----+------------------------
31| $d01f | M7D| M6D| M5D| M4D| M3D| M2D| M1D| M0D| Sprite-data collision
--+-------+----+----+----+----+----+----+----+----+------------------------
32| $d020 |  - |  - |  - |  - |         EC        | Border color
--+-------+----+----+----+----+-------------------+------------------------
33| $d021 |  - |  - |  - |  - |        B0C        | Background color 0
--+-------+----+----+----+----+-------------------+------------------------
34| $d022 |  - |  - |  - |  - |        B1C        | Background color 1
--+-------+----+----+----+----+-------------------+------------------------
35| $d023 |  - |  - |  - |  - |        B2C        | Background color 2
--+-------+----+----+----+----+-------------------+------------------------
36| $d024 |  - |  - |  - |  - |        B3C        | Background color 3
--+-------+----+----+----+----+-------------------+------------------------
37| $d025 |  - |  - |  - |  - |        MM0        | Sprite multicolor 0
--+-------+----+----+----+----+-------------------+------------------------
38| $d026 |  - |  - |  - |  - |        MM1        | Sprite multicolor 1
--+-------+----+----+----+----+-------------------+------------------------
39| $d027 |  - |  - |  - |  - |        M0C        | Color sprite 0
--+-------+----+----+----+----+-------------------+------------------------
40| $d028 |  - |  - |  - |  - |        M1C        | Color sprite 1
--+-------+----+----+----+----+-------------------+------------------------
41| $d029 |  - |  - |  - |  - |        M2C        | Color sprite 2
--+-------+----+----+----+----+-------------------+------------------------
42| $d02a |  - |  - |  - |  - |        M3C        | Color sprite 3
--+-------+----+----+----+----+-------------------+------------------------
43| $d02b |  - |  - |  - |  - |        M4C        | Color sprite 4
--+-------+----+----+----+----+-------------------+------------------------
44| $d02c |  - |  - |  - |  - |        M5C        | Color sprite 5
--+-------+----+----+----+----+-------------------+------------------------
45| $d02d |  - |  - |  - |  - |        M6C        | Color sprite 6
--+-------+----+----+----+----+-------------------+------------------------
46| $d02e |  - |  - |  - |  - |        M7C        | Color sprite 7
--+-------+----+----+----+----+-------------------+------------------------

Notes:

 � The bits marked with '-' are not connected and give "1" on reading
 � The VIC registers are repeated each 64 bytes in the area $d000-$d3ff,
   i.e. register 0 appears on addresses $d000, $d040, $d080 etc.
 � The unused addresses $d02f-$d03f give $ff on reading, a write access is
   ignored
 � The registers $d01e and $d01f cannot be written and are automatically
   cleared on reading
 � The RES bit (bit 5) of register $d016 has no function on the VIC
   6567/6569 examined as yet. On the 6566, this bit is used to stop the
   VIC.
 � Bit 7 in register $d011 (RST8) is bit 8 of register $d012. Together they
   are called "RASTER" in the following. A write access to these bits sets
   the comparison line for the raster interrupt (see section 3.12.).
```

## Key Registers
- $D000-$D00F - VIC-II - Sprite 0–7 X/Y low-byte positions (M0X..M7X / M0Y..M7Y)
- $D010 - VIC-II - Sprite X MSB bits (M7X8..M0X8)
- $D011 - VIC-II - Control Register 1 (RST8 [raster MSB], ECM, BMM, DEN, RSEL, Y fine-scroll bits)
- $D012 - VIC-II - Raster counter (low 8 bits)
- $D013-$D014 - VIC-II - Light-pen X/Y latches (LPX, LPY)
- $D015 - VIC-II - Sprite enable flags (M7E..M0E)
- $D016 - VIC-II - Control Register 2 (RES (unused on 6567/6569), MCM, CSEL, X fine-scroll bits)
- $D017 - VIC-II - Sprite Y expansion (M7YE..M0YE)
- $D018 - VIC-II - Memory pointers (VM13..VM10, CB13..CB11)
- $D019 - VIC-II - Interrupt status / flags (IRQ bits: raster/lightpen/collision/memory flags)
- $D01A - VIC-II - Interrupt enable register (enable bits for the status flags)
- $D01B-$D01D - VIC-II - Sprite control: data priority (D), multicolor enable (MC), X expansion (XE)
- $D01E-$D01F - VIC-II - Collision registers (sprite–sprite $D01E, sprite–data $D01F) — read-only, auto-cleared on read
- $D020-$D024 - VIC-II - Border and background colors (EC, B0C..B3C)
- $D025-$D026 - VIC-II - Sprite multicolor registers (MM0, MM1)
- $D027-$D02E - VIC-II - Sprite color registers (M0C..M7C)

## References
- "sprite_memory_access_and_display" — expands on sprite registers $D000-$D01D and sprite fetch/display timing
- "vic_interrupts" — expands on interrupt latch $D019 and enable $D01A
- "display_generation_dimensions" — expands on X/Y fine-scroll, RSEL/CSEL effects and display geometry ($D011/$D016)

## Labels
- D010
- D011
- D012
- D018
- D019
