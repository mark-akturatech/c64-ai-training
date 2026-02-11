# VIC-II Color Registers $D020-$D02E

**Summary:** VIC-II color registers $D020-$D02E control the border color, four background color registers (BGCOL0–BGCOL3), two sprite multicolor registers (SPMC0/1) and sprite color registers (SP0–SP7). Only the lower 4 bits of these registers are connected — reads must be masked (e.g. PEEK($D020) AND 15).

## VIC-II Color Registers
These registers live at $D020–$D02E in the VIC-II I/O area and are used by the video hardware to select colors for the border, background layers (including extended background color text/multicolor character modes), and sprites (single-color and multicolor). Key operational points:

- Only the low 4 bits are physically connected (nibble). When reading any of these registers from CPU space, mask the value with AND 15 (decimal) or AND #%00001111 to get the actual color number.
- $D020 (border color) determines the border/frame color around the display and becomes the whole-screen color when the blanking bit (Bit 4 of $D011 / $D011 = 53265) is set.
- BGCOL0 ($D021) is the primary background used for text, hi-res sprites, and multicolor bitmap graphics; BGCOL1–BGCOL3 ($D022–$D024) are used for multicolor character bit-pairs and extended background text mode ranges.
- SPMC0 ($D025) and SPMC1 ($D026) supply the two shared multicolor palette entries used by multicolor sprites (01 and 11 bit-pairs respectively).
- Sprite color registers ($D027–$D02E) set the color for hi-res sprite pixels (bit value 1) and multicolor sprite 10 bit-pairs; each sprite has its own color register.
- Default color values (VIC power-up / BASIC defaults) are recorded in the register map below.

Avoid relying on reads of these registers to obtain palette state unless you mask off the upper nibble.

## Source Code
```text
$D020-$D02E               VIC-II Color Register

Although these color registers are used for various purposes, all of
them have one thing in common.  Like the Color RAM Nybbles, only the
lower four bits are connected.  Therefore, when reading these
registers, you must mask out the upper four bits (that is,
BORDERCOLOR=PEEK(53280)AND15) in order to get a true reading.

$D020        EXTCOL       Border Color Register
                          The color value here determines the color of the border or frame
                          around the central display area.  The entire screen is set to this
                          color when the blanking feature of Bit 4 of 53265 ($D011) is enabled.
                          The default color value is 14 (light blue).

$D021        BGCOL0       Background Color 0
                          This register sets the background color for all text modes, sprite
                          graphics, and multicolor bitmap graphics.  The default color value is
                          6 (blue).

$D022        BGCOL1       Background Color 1
                          This register sets the color for the 01 bit-pair of multicolor
                          character graphics, and the background color for characters having
                          screen codes 64-127 in extended background color text mode.  The
                          default color value is 1 (white).

$D023        BGCOL2       Background Color 2
                          This register sets the color for the 10 bit-pair of multicolor
                          character graphics, and the background color for characters having
                          screen codes 128-191 in extended background color text mode.  The
                          default color value is 2 (red).

$D024        BGCOL3       Background Color 3
                          This register sets the background color for characters having screen
                          codes between 192 and 255 in extended background color text mode.  The
                          default color value is 3 (cyan).

$D025        SPMC0        Sprite Multicolor Register 0
                          This register sets the color that is displayed by the 01 bit-pair in
                          multicolor sprite graphics.  The default color value is 4 (purple).

$D026        SPMC1        Sprite Multicolor Register 1
                          This register sets the color that is displayed by the 11 bit-pair in
                          multicolor sprite graphics.  The default color value is 0 (black).

$D027-$D02E               Sprite Color Registers
                          These registers are used to set the color to be displayed by bits of
                          hi-res sprite data having a value of 1, and by bit-pairs of multicolor
                          sprite data having a value of 10.  The color of each sprite is
                          determined by its own individual color register.

$D027        SP0COL       Sprite 0 Color Register (default 1, white)
$D028        SP1COL       Sprite 1 Color Register (default 2, red)
$D029        SP2COL       Sprite 2 Color Register (default 3, cyan)
$D02A        SP3COL       Sprite 3 Color Register (default 4, purple)
$D02B        SP4COL       Sprite 4 Color Register (default 5, green)
$D02C        SP5COL       Sprite 5 Color Register (default 6, blue)
$D02D        SP6COL       Sprite 6 Color Register (default 7, yellow)
$D02E        SP7COL       Sprite 7 Color Register (default 12, medium gray)
```

## Key Registers
- $D020-$D02E - VIC-II - Border, background, sprite multicolor and sprite color registers (low 4 bits only; mask reads with AND 15)

## References
- "color_ram_description" — expands on Color RAM low-4bit behavior vs these color registers
- "spmc_sprite_multicolor_registers" — expands on Multicolor source registers $D025-$D026

## Labels
- EXTCOL
- BGCOL0
- BGCOL1
- BGCOL2
- BGCOL3
- SPMC0
- SPMC1
- SP0COL
