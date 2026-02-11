# VIC-II (MOS 6566/6567) register map $D000-$D02E

**Summary:** VIC-II register map for $D000-$D02E (sprite X/Y positions $D000-$D00F, sprite MSB X and VIC control registers at $D010, raster compare at $D012, IRQ flags/mask at $D019/$D01A, sprite/color/multicolor registers at $D020-$D02E). Contains bit-level descriptions for key control and IRQ registers.

## VIC-II register overview
This chunk documents the VIC-II (MOS 6566/6567) registers from $D000 through $D02E. Registers fall into three functional groups:

- Sprite position registers ($D000-$D00F): X/Y low bytes for sprites 0–7.
- Control, raster, IRQ and memory registers ($D010-$D01F): MSB of sprite X positions, VIC control bits (raster MSB, text/bitmap modes, row/column selection, smooth scroll X/Y), raster compare register, light-pen latches, sprite enable/expand, memory base selectors, IRQ flag and IRQ mask registers, and sprite collision registers.
- Color and multicolor registers ($D020-$D02E): border/background colors, sprite multicolor registers, and sprite color registers.

Notable control bits (summarized from the source):
- $D010: Sprite X MSBs (one bit per sprite) — extends 8-bit X positions in $D000-$D00E.
- $D011: VIC control — Raster high bit (bit 7, extends raster compare to 9 bits via $D012), Extended color text, Bitmap mode, blank-screen-to-border, 24/25 row select, Y fine-scroll (bits 2–0).
- $D012: Read Raster / Write Raster compare low 8 bits (with $D011 bit 7 providing the 9th bit).
- $D013/$D014: Light-pen X/Y latch (latched positions when light pen triggers).
- $D015: Sprite enable mask (1 = enable individual sprite display).
- $D016: VIC control (X fine-scroll in bits 2–0, multicolor enable bit 4, 38/40 column select bit 3). The source warns bit 5 must always be written as 0.
- $D017: Vertical expand (Y expand 2× for sprites 0–7).
- $D018: VIC memory control — video matrix base (bits 7–4), character dot-data base (bits 3–1), select upper/lower character set (bit 0).
- $D019: VIC interrupt flag register — bits set to 1 indicate IRQ occurred (bit 7 = any enabled IRQ occurred, bit 3 = light-pen, bit 2 = sprite-sprite collision, bit 1 = sprite-background collision, bit 0 = raster compare).
- $D01A: IRQ mask register — 1 = interrupt enabled for corresponding IRQ sources.
- $D01B: Sprite/background priority (1 = sprite priority).
- $D01C: Sprite multi-color enable bits for sprites 0–7.
- $D01D: Horizontal expand (X expand 2× for sprites 0–7).
- $D01E / $D01F: Collision detection registers (sprite-sprite, sprite-background).
- $D020-$D024: Border and background colors 0–3.
- $D025-$D026: Sprite multicolor registers (two global multicolor values).
- $D027-$D02E: Sprite 0–7 individual color registers.

Do not duplicate the full register map here — the exact address list and bit layouts are provided in the Source Code section for retrieval.

## Source Code
```text
D000-D02E  53248-54271           MOS 6566 VIDEO INTERFACE CONTROLLER
                                  (VIC)

D000       53248                 Sprite 0 X Pos
D001       53249                 Sprite 0 Y Pos
D002       53250                 Sprite 1 X Pos
D003       53251                 Sprite 1 Y Pos
D004       53252                 Sprite 2 X Pos
D005       53253                 Sprite 2 Y Pos
D006       53254                 Sprite 3 X Pos
D007       53255                 Sprite 3 Y Pos
D008       53256                 Sprite 4 X Pos
D009       53257                 Sprite 4 Y Pos
D00A       53258                 Sprite 5 X Pos
D00B       53259                 Sprite 5 Y Pos
D00C       53260                 Sprite 6 X Pos
D00D       53261                 Sprite 6 Y Pos
D00E       53262                 Sprite 7 X Pos
D00F       53263                 Sprite 7 Y Pos
```

```text
HEX      DECIMAL        BITS                 DESCRIPTION
-------------------------------------------------------------------------
D010       53264                 Sprites 0-7 X Pos (msb of X coord.)
D011       53265                 VIC Control Register
                         7      Raster Compare: (Bit 8) See 53266
                         6      Extended Color Text Mode 1 = Enable
                         5      Bit Map Mode. 1 = Enable
                         4      Blank Screen to Border Color: 0 = Blank
                         3      Select 24/25 Row Text Display: 1=25 Rows
                         2-0    Smooth Scroll to Y Dot-Position (0-7)

D012       53266                 Read Raster/Write Raster Value for
                                    Compare IRQ
D013       53267                 Light-Pen Latch X Pos
D014       53268                 Light-Pen Latch Y Pos
D015       53269                 Sprite display Enable: 1 = Enable
D016       53270                 VIC Control Register
                         7-6    Unused
                         5      ALWAYS SET THIS BIT TO 0 !
                         4      Multi-Color Mode: 1 = Enable (Text or
                                  Bit-Map)
                         3      Select 38/40 Column Text Display:
                                  1 = 40 Cols
                         2-0    Smooth Scroll to X Pos

D017       53271                 Sprites 0-7 Expand 2x Vertical (Y)
D018       53272                 VIC Memory Control Register
                         7-4    Video Matrix Base Address (inside VIC)
                         3-1    Character Dot-Data Base Address (inside
                                  VIC)
                         0      Select upper/lower Character Set

D019       53273                 VIC Interrupt Flag Register (Bit = 1:
                                  IRQ Occurred)
                         7      Set on Any Enabled VIC IRQ Condition
                         3      Light-Pen Triggered IRQ Flag
                         2      Sprite to Sprite Collision IRQ Flag
                         1      Sprite to Background Collision IRQ Flag
                         0      Raster Compare IRQ Flag
```

```text
HEX      DECIMAL        BITS                 DESCRIPTION
-------------------------------------------------------------------------
D01A       53274                 IRQ Mask Register: 1 = Interrupt Enabled
D01B       53275                 Sprite to Background Display Priority:
                                     1 = Sprite
D01C       53276                 Sprites 0-7 Multi-Color Mode Select:
                                     1 = M.C.M.
D01D       53277                 Sprites 0-7 Expand 2x Horizontal (X)
D01E       53278                 Sprite to Sprite Collision Detect
D01F       53279                 Sprite to Background Collision Detect
D020       53280                 Border Color
D021       53281                 Background Color 0
D022       53282                 Background Color 1
D023       53283                 Background Color 2
D024       53284                 Background Color 3
D025       53285                 Sprite Multi-Color Register 0
D026       53286                 Sprite Multi-Color Register 1
D027       53287                 Sprite 0 Color
D028       53288                 Sprite 1 Color
D029       53289                 Sprite 2 Color
D02A       53290                 Sprite 3 Color
D02B       53291                 Sprite 4 Color
D02C       53292                 Sprite 5 Color
D02D       53293                 Sprite 6 Color
D02E       53294                 Sprite 7 Color
```

## Key Registers
- $D000-$D00F - VIC-II - Sprite 0–7 X/Y positions (low bytes for X/Y)
- $D010 - VIC-II - Sprite X MSB byte (msb of sprites 0–7 X coordinates)
- $D011 - $D012 - VIC-II - Control register (raster MSB, modes, Y fine-scroll) and Raster Compare (low 8 bits)
- $D013-$D017 - VIC-II - Light-pen latches, sprite enable, Y expansion and related registers
- $D018 - VIC-II - VIC memory control (video matrix/base, character data base, charset select)
- $D019 - $D01A - VIC-II - Interrupt Flag and IRQ Mask registers
- $D01B-$D01F - VIC-II - Sprite/background priority, sprite multi-color select, X expansion, collision registers
- $D020-$D02E - VIC-II - Border/background colors, sprite multicolor registers, sprite 0–7 color registers

## References
- "memory_map_part3_screen_video_rom_ram" — expands on VIC registers map to $D000-$D02E region in memory map
- "light_pen_description" — expands on Light-pen latches and IRQ bits referenced in VIC registers (D013/D014 & D019)