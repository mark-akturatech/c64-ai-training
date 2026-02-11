# VIC-II Memory Mapping, Text/Bitmap Modes, Color RAM, and Key Registers ($D000–$D02E, $D800)

**Summary:** VIC-II memory addressing (independent 16K window), Video Matrix / Character Dot Data selection via Memory Control Register $D018, text vs. multicolor vs. bitmap modes controlled by $D011/$D016, border/background colors at $D020–$D024, and Color RAM at $D800 ($D800–$DBFF) for per-character color/bitmap nybbles.

## Overview
The VIC-II addresses memory independently of the 6510 and can map exactly one 16K block at a time (system default: first 16K). All screen RAM (video matrix), character dot data, and sprite shape data must reside within the chosen 16K block.

The VIC-II is accessed through registers at $D000–$D02E (decimal 53248–53294). Those locations behave like memory-mapped I/O: readable/writable but with side effects that directly control video hardware.

Video addressing is split between:
- Video Matrix Base Address (upper nybble of $D018) — selects which 16K block contains the screen RAM (character codes or bitmap color memory location).
- Character Dot Data Base Address (lower nybble of $D018) — selects where the 8×8 character bitmaps live (ROM or RAM within the selected 16K window).

Character generator ROM is at $C000 (alternate entry noted). Character shapes used by text mode come from either ROM or a RAM image placed where the Character Dot Data base points.

## Text mode and Color RAM
- Standard text mode: each character cell (8×8) is rendered using an 8×8 dot pattern; Color RAM provides one nybble per character for the foreground color. A single global background color for text is stored in Background Color Register 0 ($D021).
- Border color (frame around the screen) is at $D020.
- Color RAM begins at $D800 (decimal 55296). On the C64 this is typically $D800–$DBFF (1 KB), one nybble per character position; Color RAM is used as the per-character foreground color in text and as foreground/color nybbles for multicolor bitmap mode (see below).

## Multicolor text mode
- Enable: Bit 4 of $D016 (VIC-II control register).
- Effect: Each character dot is decoded in bit-pairs (2 horizontal pixels combined) selecting one of four colors. Horizontal resolution is halved (4 effective dots per 8×8 character width).
- The two extra color sources are Background Color Registers 1 and 2 ($D022 and $D023) — these supply the extra colors used by the 2-bit lookup alongside the Color RAM nybble and Background Color 0.

## Extended Background Color Mode (ECM)
- In ECM the Color RAM still selects the foreground color, but the background color is determined by the character code (screen code) range:
  1. Codes 0–63: background = Background Color Register 0 ($D021).
  2. Codes 64–127: background = Background Color Register 1 ($D022).
  3. Codes 128–191: background = Background Color Register 2 ($D023).
  4. Codes 192–255: background = Background Color Register 3 ($D024).
- Only the first 64 character shapes are selectable (characters 0–63), but each can appear with one of four background colors via the code ranges above.

## Bitmap mode and multicolor bitmap
- Enable bitmap mode: Bit 5 of $D011.
- High-resolution bitmap: each bit maps to a single on/off dot; bitmap area is 320×200 (8×8 blocks across the screen).
  - Character Dot Data Base (lower nybble of $D018) selects the base for bitmap dot data.
  - Video Matrix Base (upper nybble of $D018) selects where the color memory (one byte per 8×8 cell or two nybbles per byte in multicolor bitmap) resides.
- Multicolor bitmap: horizontal resolution halved to 160 pixels; Color RAM (or the bitmap color memory area determined by Video Matrix Base) supplies the foreground color and the two additional colors come from per-cell nybbles.
- Color RAM is not used for high-resolution bitmap foreground/background (except in multicolor variant where Color RAM or dedicated color RAM bytes provide color nybbles).

## Notes on practical mapping
- All screen RAM, character shapes, and sprite data referenced by VIC-II must be located inside the VIC-II's currently selected 16K block — ensure the Memory Control Register ($D018) is set so those resources lie within the active window.
- The VIC-II uses nybbles from $D018: upper nybble = video matrix (screen RAM / bitmap color location), lower nybble = character generator/bitmap base for dot data.
- Multicolor flags and bitmap flags are single bits in $D016 and $D011 respectively (see Source Code for exact bits).

## Source Code
```text
VIC-II / Color registers referenced in this chunk (decimal / hex):

53248-53294 ($D000-$D02E) - VIC-II registers (general range)

Specific registers and bits noted:
  53265 ($D011)  - Control register 1
                   Bit 5 = Bitmap graphics mode (1 = bitmap enabled)

  53270 ($D016)  - Control register 2
                   Bit 4 = Multicolor text/bitmap mode (1 = multicolor)

  53272 ($D018)  - Memory Control Register (8-bit)
                   Upper nybble = Video Matrix Base Address nybble (screen RAM or bitmap color base)
                   Lower nybble = Character Dot Data Base Address nybble (character/bitmap dot data base)

  53280 ($D020)  - Border Color Register

  53281 ($D021)  - Background Color Register 0 (default text background)

  53282 ($D022)  - Background Color Register 1 (ECM / multicolor extra color)

  53283 ($D023)  - Background Color Register 2 (ECM / multicolor extra color)

  53284 ($D024)  - Background Color Register 3 (ECM background for codes 192-255)

Other memory regions:
  55296 ($D800)  - Color RAM base (one nybble per character cell), typically $D800-$DBFF (1 KB)
  49152 ($C000)  - Character Generator ROM (alternate source for character shapes)

Notes:
- Bit numbering convention: Bit0 = 1 ... Bit7 = 128.
- To set/reset bits from BASIC:
    Set bit:    POKE addr, PEEK(addr) OR BitValue
    Reset bit:  POKE addr, PEEK(addr) AND (255 - BitValue)
```

## Key Registers
- $D000-$D02E - VIC-II - control and status registers (general VIC-II I/O range)
- $D018 - VIC-II - Memory Control Register (upper nybble = Video Matrix base, lower nybble = Character Dot Data base)
- $D011 - VIC-II - Control register (Bit 5 = bitmap mode)
- $D016 - VIC-II - Control register (Bit 4 = multicolor mode)
- $D020-$D024 - VIC-II - Border and Background Color Registers (Border $D020; Background 0 $D021; Background 1-3 $D022-$D024)
- $D800-$DBFF - Color RAM - per-character nybble color memory (foreground color in text; used by multicolor bitmap)

## References
- "d000_dfff_overview_i_o_devices_vic_sid_cia_colorram" — expands on VIC-II and other I/O registers and Color RAM usage

## Labels
- MEMORY_CONTROL
- CONTROL_REGISTER_1
- CONTROL_REGISTER_2
- BORDER_COLOR
- COLOR_RAM
