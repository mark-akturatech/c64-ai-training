# VIC-II register map ($D000-$D02E) — Appendix G (Commodore 64)

**Summary:** VIC-II register map for $D000-$D02E including sprite X/Y positions, sprite MSB X ($D010), Y-scroll/control ($D011), raster ($D012), light-pen ($D013-$D014), sprite enable ($D015), X-scroll/control ($D016), sprite expand Y ($D017), memory base bits ($D018), IRQ request/mask ($D019/$D01A), background/sprite priority ($D01B), multicolor sprite select ($D01C), sprite expand X ($D01D), collision registers ($D01E-$D01F), color registers ($D020-$D02E), and 0–15 color code legend.

## Register overview
This packet documents the VIC-II register block at $D000 (decimal 53248) through $D02E. Registers include sprite position bytes (low and high bits), scroll/control registers, raster and light-pen registers, sprite enable and expansion controls, interrupt request and mask registers, collision status registers, and the color registers (border, background, multicolor, sprite colors). The detailed bitfields for the sprite expand and collision registers and the full color-code legend are included in the Source Code section.

- Sprite coordinate registers: low bytes and Y bytes for sprites 0–7 live in the low range; MSB X bits are in $D010.
- Scrolling and display control: X/Y scroll and other screen control bits are in $D011 and $D016; screen & character memory base selection is in $D018.
- Raster and light-pen: raster counter at $D012; light-pen X/Y at $D013–$D014.
- Sprite enable and expansion: sprite enable mask at $D015; vertical expansion at $D017; horizontal expansion bits (per-sprite) at $D01D.
- Interrupts: IRQ status in $D019 and IRQ enable/mask in $D01A.
- Collision detection: sprite-sprite collisions at $D01E, sprite-background collisions at $D01F (each bit corresponds to one sprite).
- Colors: border, background (3), multicolor registers and sprite color registers are at $D020-$D02E. Color codes 0–15 map to C64 palette names; only codes 0–7 are usable in multicolor character mode.

## Source Code
```text
VIC-II register map (absolute addresses)

Dec Hex  Address  Register name / purpose
----------------------------------------------------------
 0   00  $D000   Sprite 0 X low
 1   01  $D001   Sprite 0 Y
 2   02  $D002   Sprite 1 X low
 3   03  $D003   Sprite 1 Y
 4   04  $D004   Sprite 2 X low
 5   05  $D005   Sprite 2 Y
 6   06  $D006   Sprite 3 X low
 7   07  $D007   Sprite 3 Y
 8   08  $D008   Sprite 4 X low
 9   09  $D009   Sprite 4 Y
10   0A  $D00A   Sprite 5 X low
11   0B  $D00B   Sprite 5 Y
12   0C  $D00C   Sprite 6 X low
13   0D  $D00D   Sprite 6 Y
14   0E  $D00E   Sprite 7 X low
15   0F  $D00F   Sprite 7 Y

16   10  $D010   Sprite X MSB bits (one bit per sprite: adds to X low bytes)
17   11  $D011   Control / Y-scroll and display control bits
18   12  $D012   Raster counter (low 8 bits)
19   13  $D013   Light-pen X (read-only)
20   14  $D014   Light-pen Y (read-only)
21   15  $D015   Sprite enable register (one bit per sprite; also used to disable sprites)
22   16  $D016   X-scroll and control bits
23   17  $D017   Sprite Y expand (vertical double-size enable per-sprite)
24   18  $D018   Screen memory / character memory base address bits
25   19  $D019   Interrupt request (status) register (read/clear)
26   1A  $D01A   Interrupt mask / enable register
27   1B  $D01B   Background-sprite priority (which layers are in front)
28   1C  $D01C   Sprite multicolor select / multicolor control
29   1D  $D01D   Sprite expand X (per-sprite horizontal double-size bits)
30   1E  $D01E   Sprite-Sprite collision status (one bit per sprite)
31   1F  $D01F   Sprite-Background collision status (one bit per sprite)

Color registers
Dec Hex  Address  Color register
--------------------------------
32   20  $D020   Border color
33   21  $D021   Background color 0
34   22  $D022   Background color 1
35   23  $D023   Background color 2
36   24  $D024   Background color 3
37   25  $D025   Sprite multicolor 0
38   26  $D026   Sprite multicolor 1
39   27  $D027   Sprite 0 color
40   28  $D028   Sprite 1 color
41   29  $D029   Sprite 2 color
42   2A  $D02A   Sprite 3 color
43   2B  $D02B   Sprite 4 color
44   2C  $D02C   Sprite 5 color
45   2D  $D02D   Sprite 6 color
46   2E  $D02E   Sprite 7 color

Bit maps for registers $D01D, $D01E, $D01F
----------------------------------------
Register $D01D (decimal 29, hex 1D) - Sprite Expand X (SEXX7..SEXX0)
bit7  bit6  bit5  bit4  bit3  bit2  bit1  bit0
SEXX7 ...                              SEXX0
(1 = sprite X doubled for that sprite)

Register $D01E (decimal 30, hex 1E) - Sprite-Sprite Collision (SSC7..SSC0)
bit7  bit6  bit5  bit4  bit3  bit2  bit1  bit0
SSC7 ...                               SSC0
(1 = this sprite has collided with any other sprite)

Register $D01F (decimal 31, hex 1F) - Sprite-Background Collision (SBC7..SBC0)
bit7  bit6  bit5  bit4  bit3  bit2  bit1  bit0
SBC7 ...                               SBC0
(1 = this sprite has collided with the background)

Color codes (Dec / Hex -> Name)
--------------------------------
 0  $0  BLACK
 1  $1  WHITE
 2  $2  RED
 3  $3  CYAN
 4  $4  PURPLE
 5  $5  GREEN
 6  $6  BLUE
 7  $7  YELLOW
 8  $8  ORANGE
 9  $9  BROWN
10  $A  LIGHT RED
11  $B  GRAY 1
12  $C  GRAY 2
13  $D  LIGHT GREEN
14  $E  LIGHT BLUE
15  $F  GRAY 3

LEGEND: ONLY COLORS 0-7 MAY BE USED IN MULTICOLOR CHARACTER MODE
```

## Key Registers
- $D000-$D00F - VIC-II - Sprite 0–7 X low and Y position bytes (sprite coordinates low/high bytes)
- $D010 - VIC-II - Sprite X MSB bits (per-sprite high X bit)
- $D011 - VIC-II - Y-scroll and display control bits
- $D012 - VIC-II - Raster counter (low 8 bits)
- $D013-$D014 - VIC-II - Light-pen X/Y registers (read-only)
- $D015 - VIC-II - Sprite enable mask (enable/disable sprites 0–7)
- $D016 - VIC-II - X-scroll and control bits
- $D017 - VIC-II - Sprite expand Y (vertical expansion control)
- $D018 - VIC-II - Screen & character memory base address bits
- $D019-$D01A - VIC-II - Interrupt request (status) and interrupt mask registers
- $D01B - VIC-II - Background/sprite priority control
- $D01C - VIC-II - Sprite multicolor select / multicolor flags
- $D01D - VIC-II - Sprite expand X (per-sprite horizontal expansion bits)
- $D01E-$D01F - VIC-II - Collision status registers (sprite-sprite, sprite-background)
- $D020-$D02E - VIC-II - Color registers: border, background colors, multicolor registers, sprite colors

## References
- "appendix_d_screen_and_color_memory_maps" — expands on how VIC register base bits interact with screen/color memory maps
- "appendix_l_6510_specifications" — timing and bus control interactions between CPU and VIC-II when accessing these registers

**[Note: Source material provided this register list and the collision/expand bit layouts; detailed individual bit descriptions for some control registers ($D011, $D016, $D018, IRQ bits in $D019/$D01A) are not present in the supplied text and therefore are not expanded here.]**