# Bitmap mode, VIC-II memory control ($D011, $D018) and color memory placement

**Summary:** Enabling VIC-II bitmap mode via Bit 5 of $D011, bitmap layout as 320x200 pixels, Character Dot-Data / Video Matrix placement controlled by VIC memory control $D018 (bits 1–3 and 4–7), and the 1K color RAM area ($D800-$DBFF) and placement restrictions inside the VIC-II 16K window.

## Bitmap mode and layout
- Bitmap mode is enabled by setting Bit 5 of $D011 (VIC-II control register). In bitmap mode the screen is a 320×200 bitmap (8×8 character grid of 40×25 character cells, each cell supplying 8×8 pixels).
- In bitmap mode the VIC-II reads three distinct areas from VIC address space: the Bitmap (pixel) data area, the Video Matrix (screen codes) area, and the Character Dot-Data area (used in multicolor/text modes). The location of these areas is controlled by $D018 (VIC-II Memory Control).
- Color information for bitmap pixels is provided by a combination of the color RAM (1K at $D800-$DBFF) and per-character/bitmap attribute schemes (the color RAM provides one nybble per character cell). Color RAM is a dedicated 1K that must be located in CPU memory at $D800-$DBFF (it is not part of the VIC 16K bank selection; it remains at that CPU address but is accessed by the VIC-II for color attributes).
- Only two possible starting offsets are allowed for the 8K bitmap block within the VIC-II 16K window: an offset of 0 or 8192 (8K) from the start of the VIC-II 16K window. In other words, the bitmap data can only be placed at a 0K or 8K boundary inside the VIC bank; this is selected by Bit 3 of $D018 when in bitmap mode (see $D018 details below).

**[Note: Source may contain an error — the source text also contains a conflicting statement that "Bit 5 controls the VIC-II chip Reset line". The authoritative and commonly used meaning for Bit 5 of $D011 is "bitmap enable". The reset description appears incorrect for $D011.]**

## VIC-II Memory Control ($D018) — character, bitmap and video matrix placement
- $D018 controls two base addresses used by the VIC-II:
  - Bits 1–3 (lower nybble region) select the Character Dot-Data base (character/glyph shape data) as a 1K-aligned offset inside the VIC-II 16K window. Values represent even numbers 0..14 as 1K increments (so setting value N means Character data starts at N*1K).
  - Bits 4–7 (upper nybble) select the Video Matrix base (the 1K screen-code area of 40×25). The upper nibble value (0..15) represents the offset in 1K increments from the start of the VIC-II memory to the Video Matrix.
- Default/example values:
  - Character Dot-Data default nybble = 4 → character dot-data area at 4×1K = $1000 (where the built-in character ROM is normally located inside VIC address space). To switch to the alternate character set (second 2K of the ROM) change the lower nybble from 4 to 6 (POKE 53272,PEEK(53272) OR 2).
  - Video Matrix default nybble = 1 → Video Matrix at offset 1K (the usual screen memory starting point).
- In bitmap mode the lower nybble (bits 1–3) is interpreted differently for the bitmap: only bit 3 is significant; it selects whether Bitmap data begins at offset 0 or 8K (0 = offset 0, 1 = offset 8192).
- Practical caution: BASIC’s screen editor and input routines expect the Video Matrix to be at the default place unless you also update BASIC’s pointer at decimal 648 ($288). If you move the Video Matrix via $D018 without updating BASIC’s internal screen location (memory location 648), BASIC will continue to write and edit text in the old memory area — you will not see typed characters on the displayed screen until BASIC’s pointer is also updated.

## Color RAM and bitmap attribute mapping
- Color RAM is a dedicated 1K area at CPU addresses $D800-$DBFF; it holds one 4-bit color entry per character cell (40×25).
- When using bitmap modes you still use the Video Matrix + Color RAM scheme: the Video Matrix selects which character cell corresponds to each 8×8 block of bitmap pixels; Color RAM provides the color/attribute for that cell.
- Because Color RAM is a separate 1K block accessed by the VIC-II, choosing Locations for bitmap and character data must respect the single 16K VIC bank window — bitmap data, character data, sprite shapes and Video Matrix must all reside within the selected VIC 16K bank.

## Sprite vertical expansion ($D017)
- $D017 ($D017 / decimal 53271) is the Sprite Vertical Expansion register. Each bit 0..7 corresponds to sprite 0..7; when a bit is set the corresponding sprite’s height is doubled (each dot becomes two raster scan lines).

## Examples / default placements
- Typical defaults on a stock C64:
  - Video Matrix: upper nybble = 1 → Video Matrix at VIC offset 1K
  - Character dot-data: lower nybble = 4 → character data at VIC offset 4K ($1000)
  - Bitmap (if enabled): controlled by Bit 3 of $D018; bitmap block starts at either VIC offset 0K or 8K
- When enabling bitmap mode, verify:
  - $D011 Bit 5 = 1 (bitmap enable)
  - $D018 upper nybble points to the 1K Video Matrix you intend to use
  - $D018 lower nybble (bit 3) selects the desired 0K/8K bitmap offset
  - BASIC pointer at decimal 648 ($288) is updated if you’ve moved the Video Matrix and still want BASIC editing to work on the visible screen

## Source Code
```basic
70 POKE648,I:PRINTCHR$(19);A$;A$;A$;A$:NEXT:POKE648,4:REM CLR HI-RES SCREEN
80 FOR CO=1TO3:FOR Y=0TO199STEP.5:REM FROM THE TOP OF THE SCREEN TO THE BOTTOM
90 X=INT(10*CO+15*SIN(CO*45+Y/10)): REM SINE WAVE SHAPE
100 BY=BASE+40*(Y AND 248)+(Y AND 7)+(X*2 AND 504): REM FIND HI-RES BYTE
110 BI=(NOT X AND 3):POKE BY,PEEK(BY) AND (NOT 3*CA(BI)) OR(CO*CA(BI))
120 NEXT Y,CO
130 GOTO 130: REM LET IT STAY ON SCREEN
```

```text
53271         $D017          YXPAND
Sprite Vertical Expansion Register

Bit 0:  Expand Sprite 0 vertically (1=double height, 0=normal height)
Bit 1:  Expand Sprite 1 vertically (1=double height, 0=normal height)
Bit 2:  Expand Sprite 2 vertically (1=double height, 0=normal height)
Bit 3:  Expand Sprite 3 vertically (1=double height, 0=normal height)
Bit 4:  Expand Sprite 4 vertically (1=double height, 0=normal height)
Bit 5:  Expand Sprite 5 vertically (1=double height, 0=normal height)
Bit 6:  Expand Sprite 6 vertically (1=double height, 0=normal height)
Bit 7:  Expand Sprite 7 vertically (1=double height, 0=normal height)
```

```text
53272         $D018          VMCSB
VIC-II Chip Memory Control Register

Bit 0:  Unused
Bits 1-3:  Text character dot-data base address within VIC-II address space
Bits 4-7:  Video matrix base address within VIC-II address space

Bits 1-3: set location of Character Dot-Data area (even numbers 0..14 -> 0..14 K steps)
Default lower nybble = 4 -> Character set at VIC offset 4K ($1000)

In bitmap mode, the lower nybble controls bitmap location: only Bit 3 is significant.
Bit3=0 -> bitmap offset 0K
Bit3=1 -> bitmap offset 8K

Bits 4-7: determine starting address of the Video Matrix (0..15 -> 0..15 K offset)
Default upper nybble = 1 -> Video Matrix at VIC offset 1K
```

## Key Registers
- $D011 - VIC-II - Bitmap mode enable (Bit 5), control register 1 (display control)
- $D017 - VIC-II - Sprite Vertical Expansion (expand sprites vertically)
- $D018 - VIC-II - Memory Control (Character Dot-Data base, Video Matrix base, bitmap 0K/8K selection)
- $D000-$D02E - VIC-II - VIC-II register block (general reference)
- $D800-$DBFF - Color RAM (1K attribute memory used for character/bitmap cell colors)

## References
- "bitmap_pixel_addressing_and_plotting" — How to find pixel byte for given X-Y in bitmap space (expanded guide)