# C64 memory map (6510 view) — VIC-II / $D000 area, CHAREN, Color RAM, ROMs

**Summary:** Memory map of the Commodore 64 as seen by the 6510 CPU: Kernal ROM $E000-$FFFF, BASIC ROM $A000-$BFFF, Character ROM and I/O/VIC at $D000-$DFFF with CHAREN (bit 2 of $0001) selecting between I/O/Color RAM and character ROM; Color RAM at $D800-$DBFF (low 4 bits only); VIC-II registers at $D000 (47 registers) mirrored every $40 bytes across $D000-$D3FF. Notes on open areas returning last VIC-read byte on many C64s.

**Memory map as seen by the 6510**

- The 6510 addresses 64KB linearly; a PAL on the C64 (and the 6510 I/O port) controls overlaying ROMs and I/O areas. The “standard configuration” used here places:
  - BASIC ROM: $A000–$BFFF
  - Kernal ROM: $E000–$FFFF
  - I/O, VIC, SID, Color RAM, Character ROM region: $D000–$DFFF

- Writes to a ROM area (BASIC/Kernal/Char) actually write to the underlying RAM; the ROM only overrides read accesses.

- 6510 I/O port:
  - $0000 — data direction register (DDR)
  - $0001 — data register; CHAREN is bit 2 of $0001 (CHAREN=1 => character generator disabled for $D000 area; CHAREN=0 => character ROM mapped/readable in $D000 area)

- The $D000–$DFFF area:
  - CHAREN (bit 2 of $0001) selects whether reads in portions of $D000–$DFFF return I/O (VIC, SID, CIAs, expansion) / Color RAM or Character ROM.
  - Color RAM is physically at $D800–$DBFF and wired to the lower 4 data bits on reads/writes; the upper 4 bits read back as open lines (return unpredictable/random values).
  - The two subareas labeled “I/O 1” and “I/O 2” in some diagrams are reserved for expansion; under normal operation they are not populated and read accesses return open/random values (on many machines this is the last byte the VIC read).
  - The 47 VIC registers are mapped starting at $D000; because of incomplete address decoding they are repeated (mirrored) every $40 ($40 = 64) bytes across $D000–$D3FF. The primary register block is $D000–$D02E (47 registers).

- SID and CIAs:
  - SID registers are accessed in the $D400 region (standard SID base $D400).
  - CIA 1 and CIA 2 appear at $DC00 and $DD00 respectively (each CIA occupies $DC00–$DC0F and $DD00–$DD0F in standard layouts).

- Open/read behavior:
  - Reads from unmapped / open areas in $D000–$DFFF (and some expansion areas) commonly return the last byte that the VIC read on many C64 revisions; behavior can vary between hardware revisions. (See references for detailed discussion and experiments.)

## Source Code
```text
ASCII memory map (from source):

                               The area at $d000-$dfff with
                                  CHAREN=1     CHAREN=0

 $ffff +--------------+  /$e000 +----------+  +----------+
       |  Kernal ROM  | /       |  I/O  2  |  |          |
 $e000 +--------------+/  $df00 +----------+  |          |
       |I/O, Char ROM |         |  I/O  1  |  |          |
 $d000 +--------------+\  $de00 +----------+  |          |
       |     RAM      | \       |  CIA  2  |  |          |
 $c000 +--------------+  \$dd00 +----------+  | Char ROM |
       |  Basic ROM   |         |  CIA  1  |  |          |
 $a000 +--------------+   $dc00 +----------+  |          |
       |              |         |Color RAM |  |          |
       .     RAM      .         |          |  |          |
       .              .   $d800 +----------+  |          |
       |              |         |   SID    |  |          |
 $0002 +--------------+         |registers |  |          |
       | I/O port DR  |   $d400 +----------+  |          |
 $0001 +--------------+         |   VIC    |  |          |
       | I/O port DDR |         |registers |  |          |
 $0000 +--------------+   $d000 +----------+  +----------+
```

```text
Concise reference table (visual/reference copy):

$0000     I/O DDR (bit 2 = CHAREN)
$0001     I/O data (CHAREN)
$A000-$BFFF  BASIC ROM (reads)
$C000-$CFFF  RAM (standard RAM area)
$D000-$DFFF  I/O / VIC / SID / Color RAM / Char ROM (CHAREN selects)
  - $D000    VIC registers (registers start here; 47 regs)
  - $D000-$D3FF  VIC register block mirrored every $40 bytes
  - $D400    SID registers (SID base)
  - $D800-$DBFF Color RAM (lower 4 bits only)
$E000-$FFFF  Kernal ROM (reads)
```

```text
VIC-II Register Map:

Address  | Register Name | Description
---------|---------------|-----------------------------------------------
$D000    | SPR0_X        | Sprite 0 X-coordinate
$D001    | SPR0_Y        | Sprite 0 Y-coordinate
$D002    | SPR1_X        | Sprite 1 X-coordinate
$D003    | SPR1_Y        | Sprite 1 Y-coordinate
$D004    | SPR2_X        | Sprite 2 X-coordinate
$D005    | SPR2_Y        | Sprite 2 Y-coordinate
$D006    | SPR3_X        | Sprite 3 X-coordinate
$D007    | SPR3_Y        | Sprite 3 Y-coordinate
$D008    | SPR4_X        | Sprite 4 X-coordinate
$D009    | SPR4_Y        | Sprite 4 Y-coordinate
$D00A    | SPR5_X        | Sprite 5 X-coordinate
$D00B    | SPR5_Y        | Sprite 5 Y-coordinate
$D00C    | SPR6_X        | Sprite 6 X-coordinate
$D00D    | SPR6_Y        | Sprite 6 Y-coordinate
$D00E    | SPR7_X        | Sprite 7 X-coordinate
$D00F    | SPR7_Y        | Sprite 7 Y-coordinate
$D010    | SPR_HI_X      | Most significant bits of sprite X-coordinates
$D011    | CTRL1         | Control register 1
$D012    | RASTER        | Raster counter
$D013    | LP_X          | Light pen X-coordinate
$D014    | LP_Y          | Light pen Y-coordinate
$D015    | SPR_EN        | Sprite enable
$D016    | CTRL2         | Control register 2
$D017    | SPR_EXP_Y     | Sprite Y expansion
$D018    | VMCSB         | Video matrix and character set base
$D019    | IRQ_STATUS    | Interrupt request status
$D01A    | IRQ_ENABLE    | Interrupt request enable
$D01B    | SPR_EXP_X     | Sprite X expansion
$D01C    | SPR_MC        | Sprite multicolor mode select
$D01D    | SPR_PRI       | Sprite priority
$D01E    | SPR_BG_COL    | Sprite-sprite collision detection
$D01F    | SPR_FG_COL    | Sprite-background collision detection
$D020    | BORDERCOL     | Border color
$D021    | BGCOL0        | Background color 0
$D022    | BGCOL1        | Background color 1
$D023    | BGCOL2        | Background color 2
$D024    | BGCOL3        | Background color 3
$D025    | SPR_MCOL0     | Sprite multicolor 0
$D026    | SPR_MCOL1     | Sprite multicolor 1
$D027    | SPR0_COL      | Sprite 0 color
$D028    | SPR1_COL      | Sprite 1 color
$D029    | SPR2_COL      | Sprite 2 color
$D02A    | SPR3_COL      | Sprite 3 color
$D02B    | SPR4_COL      | Sprite 4 color
$D02C    | SPR5_COL      | Sprite 5 color
$D02D    | SPR6_COL      | Sprite 6 color
$D02E    | SPR7_COL      | Sprite 7 color
```

```text
VIC-II Control Register 1 ($D011) Bit-Level Definition:

Bit  | Name  | Description
-----|-------|-----------------------------------------------------------
7    | RST8  | 1 = Enable raster line 8
6    | ECM   | 1 = Enable extended color mode
5    | BMM   | 1 = Enable bitmap mode
4    | DEN   | 1 = Enable screen display
3    | RSEL  | 1 = Select 25 rows text mode; 0 = Select 24 rows
2-0  |       | Unused
```

```text
VIC-II Control Register 2 ($D016) Bit-Level Definition:

Bit  | Name  | Description
-----|-------|-----------------------------------------------------------
7    | RES   | Unused
6    | MCM   | 1 = Enable multicolor mode
5    | CSEL  | 1 = Select 40 columns text mode; 0 = Select 38 columns
4-0  |       | Unused
```

## Labels
- CHAREN
- CTRL1
- RASTER
- VMCSB
- BORDERCOL
