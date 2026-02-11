# VIC-II Initialization Bytes (ROM $ECB9 - $ECE6)

**Summary:** VIC-II initialization bytes from ROM $ECB9–$ECE6 that set sprite 0–7 X/Y positions, sprite X MSB, control registers ($D011/$D016 semantics), raster compare, light-pen coordinates, sprite enable/expand/priority/multicolour/collision registers, interrupt flags/enables, and default border/background/sprite colours (VIC-II $D000–$D02E).

## Description
This ROM data sequence contains the default values written into the VIC-II registers during system initialization. It covers:

- Sprite coordinates: Y and low X bytes for sprites 0–7, plus the X MSB bits (one bit per sprite).
- Screen control: vertical fine scroll, 25/24 row selection, bitmap/multicolour/text control and the raster MSB (control register often referred to as $D011).
- Raster compare: low byte of raster compare ($D012) and raster MSB in the vertical control register.
- Light-pen coordinates: X and Y (VIC-II light-pen registers).
- Sprite enable and horizontal control: sprite enable bits and the horizontal fine scroll/control register (control register often referred to as $D016) including VIC reset bit, multicolor enable and 40/38 column selection.
- Sprite attributes and collision registers: priority, multicolour enable, X/Y expand, sprite-to-sprite and sprite-to-foreground collision flags.
- Interrupt registers: interrupt flag clear byte and interrupt enable byte (VIC-II interrupt status/enable).
- Colour registers: default border, background (0–3), multicolour 0/1 and sprite colours 0–7 (VIC-II $D020–$D02E). Note: sprite 7 colour byte collides in the ROM with the ASCII 'L' of the string "LOAD" (value $4C).

The bit-field semantics included in the ROM comments are preserved here (see Source Code). These are the canonical VIC-II meanings: vertical control bits (raster MSB, extended colour text, bitmap, screen enable, 25/24 rows, vertical scroll), horizontal control bits (VIC reset, multicolor, 40/38 columns, horizontal scroll), interrupt flag meanings (raster, sprite collisions, light-pen), and IRQ enable bits.

Do not assume this ROM block performs the writes itself — it contains the initialization values. Mapping to VIC-II registers follows conventional register assignments ($D000–$D02E); see Key Registers for the corresponding VIC-II register ranges.

## Source Code
```asm
; ROM data: VIC-II chip initialisation values (addresses shown are ROM addresses)
.;ECB9 00 00                    sprite 0 x,y
.;ECBB 00 00                    sprite 1 x,y 
.;ECBD 00 00                    sprite 2 x,y 
.;ECBF 00 00                    sprite 3 x,y
.;ECC1 00 00                    sprite 4 x,y 
.;ECC3 00 00                    sprite 5 x,y 
.;ECC5 00 00                    sprite 6 x,y 
.;ECC7 00 00                    sprite 7 x,y
.;ECC9 00                       sprites 0 to 7 x bit 8
.;ECCA 9B                       enable screen, enable 25 rows
;                              vertical fine scroll and control
;                              bit function
;                              --- -------
;                               7  raster compare bit 8
;                               6  1 = enable extended color text mode
;                               5  1 = enable bitmap graphics mode
;                               4  1 = enable screen, 0 = blank screen
;                               3  1 = 25 row display, 0 = 24 row display
;                              2-0 vertical scroll count
.;ECCB 37                       raster compare (low)
.;ECCC 00                       light pen x
.;ECCD 00                       light pen y
.;ECCE 00                       sprite 0 to 7 enable
.;ECCF 08                       enable 40 column display
;                              horizontal fine scroll and control
;                              bit function
;                              --- -------
;                              7-6 unused
;                               5  1 = vic reset, 0 = vic on
;                               4  1 = enable multicolor mode
;                               3  1 = 40 column display, 0 = 38 column display
;                              2-0 horizontal scroll count
.;ECC0 00                       sprite 0 to 7 y expand
.;ECD1 14                       memory control
;                              bit function
;                              --- -------
;                              7-4 video matrix base address
;                              3-1 character data base address
;                               0  unused
.;ECD2 0F                       clear all interrupts
;                              interrupt flags
;                               7 1 = interrupt
;                              6-4 unused
;                               3  1 = light pen interrupt
;                               2  1 = sprite to sprite collision interrupt
;                               1  1 = sprite to foreground collision interrupt
;                               0  1 = raster compare interrupt
.;ECD3 00                       all vic IRQs disabled
;                              IRQ enable
;                              bit function
;                              --- -------
;                              7-4 unused
;                               3  1 = enable light pen
;                               2  1 = enable sprite to sprite collision
;                               1  1 = enable sprite to foreground collision
;                               0  1 = enable raster compare
.;ECD4 00                       sprite 0 to 7 foreground priority
.;ECD5 00                       sprite 0 to 7 multicolour
.;ECD6 00                       sprite 0 to 7 x expand
.;ECD7 00                       sprite 0 to 7 sprite collision
.;ECD8 00                       sprite 0 to 7 foreground collision
.;ECD9 0E                       border colour
.;ECDA 06                       background colour 0
.;ECDB 01                       background colour 1
.;ECDC 02                       background colour 2
.;ECDD 03                       background colour 3
.;ECDE 04                       sprite multicolour 0
.;ECDF 00                       sprite multicolour 1
.;ECD0 01                       sprite 0 colour
.;ECE1 02                       sprite 1 colour
.;ECE2 03                       sprite 2 colour
.;ECE3 04                       sprite 3 colour
.;ECE4 05                       sprite 4 colour
.;ECE5 06                       sprite 5 colour
.;ECE6 07                       sprite 6 colour
;                              sprite 7 colour is actually the first character of "LOAD" ($4C)
```

```text
; VIC-II register bit summaries (as in ROM comments)

; Vertical control ($D011)
; bit 7: raster compare bit 8 (MSB)
; bit 6: 1 = enable extended colour text mode
; bit 5: 1 = enable bitmap graphics mode
; bit 4: 1 = enable screen, 0 = blank screen
; bit 3: 1 = 25 row display, 0 = 24 row display
; bits 2-0: vertical scroll count

; Raster compare ($D012)
; low 8 bits here; MSB in $D011 bit 7

; Light-pen X/Y ($D013/$D014)
; light-pen coordinate registers (low/whatever format VIC uses)

; Horizontal control ($D016)
; bits 7-6: unused
; bit 5: 1 = VIC reset (chip reset), 0 = VIC on
; bit 4: 1 = enable multicolor mode
; bit 3: 1 = 40 column display, 0 = 38 column display
; bits 2-0: horizontal scroll count

; Memory control ($D018)
; bits 7-4: video matrix base address
; bits 3-1: character data base address
; bit 0: unused

; Interrupt flags ($D019)
; bit 7: 1 = interrupt (any)
; bits 6-4: unused
; bit 3: 1 = light pen interrupt
; bit 2: 1 = sprite-to-sprite collision interrupt
; bit 1: 1 = sprite-to-foreground collision interrupt
; bit 0: 1 = raster compare interrupt

; Interrupt enable ($D01A)
; bits 7-4: unused
; bit 3: 1 = enable light pen
; bit 2: 1 = enable sprite-to-sprite collision
; bit 1: 1 = enable sprite-to-foreground collision
; bit 0: 1 = enable raster compare

; Colour registers ($D020-$D02E)
; $D020 = border colour
; $D021 = background colour 0
; $D022 = background colour 1
; $D023 = background colour 2
; $D024 = background colour 3
; $D025 = sprite multicolour 0
; $D026 = sprite multicolour 1
; $D027-$D02E = sprite 0-7 colours
```

## Key Registers
- $D000-$D00F - VIC-II - Sprite 0–7 Y positions ($D000–$D007) and Sprite 0–7 X low bytes ($D008–$D00F)
- $D010 - VIC-II - Sprite 0–7 X MSB bits (bit per sprite)
- $D011 - VIC-II - Control register 1 (vertical fine scroll, 25/24 rows, bitmap/extended text, raster MSB)
- $D012 - VIC-II - Raster compare (low)
- $D013-$D014 - VIC-II - Light-pen X,Y
- $D015 - VIC-II - Sprite enable bits (enable/disable sprites 0–7)
- $D016 - VIC-II - Control register 2 (horizontal fine scroll/control: VIC reset, multicolor, 40/38 columns, horizontal scroll)
- $D017 - $D018 - VIC-II - Sprite Y expand / Memory control (video matrix & character data base)
- $D019 - VIC-II - Interrupt flags (clear/status)
- $D01A - VIC-II - Interrupt enable register
- $D01B-$D01F - VIC-II - Sprite priority, sprite multicolour, X expand, sprite collision and foreground collision registers (sprite attribute/collision area)
- $D020-$D02E - VIC-II - Border, background 0–3, multicolour 0–1, sprite 0–7 colours

## References
- "screen_line_address_low_bytes" — expands on screen memory mapping and line addresses used with VIC-II initialization
- "auto_load_run_keyboard_buffer" — expands on the 'LOAD' token referenced where sprite 7 colour overlaps the auto load/run buffer (ASCII 'L' = $4C)

## Labels
- D011
- D012
- D016
- D018
- D019
