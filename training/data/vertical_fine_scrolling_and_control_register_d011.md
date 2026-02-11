# VIC-II $D011 — Vertical fine scroll & control bits

**Summary:** VIC-II control register $D011 (decimal 53265) — bits 0-2 vertical fine scroll (0–7 scanlines), bit 3 selects 24/25-row text height, bit 4 screen blanking, bit 5 bitmap mode enable (BMM), bit 6 extended color/text mode (ECM), bit 7 = MSB (9th bit) of raster compare (together with $D012). Raster, fine-scroll and mode-control terms: VIC-II, raster ($D012), vertical fine scroll, bitmap mode.

**Overview and behavior**

$D011 is a multifunction VIC-II control register used for vertical fine scrolling and display-mode control in addition to contributing the high bit for the raster comparator.

Bit meaning (low→high):
- Bits 0–2 (YSCROLL): vertical fine-scroll offset in scanlines (0–7). Shifts the displayed raster window vertically within character rows by 0..7 scanlines.
- Bit 3: selection of 24/25 text-row mode (affects number of text rows shown).
- Bit 4: screen blanking (blank display when set — disables visible output).
- Bit 5 (BMM): enable bitmap mode when set (character/bitmap addressing and interpretation change).
- Bit 6 (ECM): extended color/text mode (extended background/color behavior for characters).
- Bit 7: MSB (9th bit) of the raster compare value; combined with the 8-bit $D012 ($D012 holds low 8 bits) to compare against the current raster.

Vertical fine-scrolling behavior:
- YSCROLL moves the displayed window by 0–7 scanlines inside each 8-scanline character cell, producing smooth vertical motion without changing character memory layout.
- When YSCROLL steps past the last value (7→0 or 0→7 wrapping), the visible character grid must be advanced or rolled by one character row (coarse scroll). This requires moving the entire line(s) of character/color/bitmap data in memory to present the next row of content in the window—typically done in machine code because BASIC is too slow to maintain smooth motion.
- Fine scroll alone only shifts the window; it does not change which character rows are in the character map. To continue scrolling in the same direction when YSCROLL wraps, perform a coarse shift of display memory (move bytes/characters up or down one row) and then resume fine-scroll steps.
- Bit 7 usage: to trigger raster interrupts at lines beyond 0–255 you set the MSB in $D011 and the low 8 bits in $D012; the pair form a 9-bit raster compare value.

Default/power-up:
- The power-up default value for $D011 is $1B (00011011 in binary). This sets the screen to 25 rows, enables the display, and sets YSCROLL to 3. ([scribd.com](https://www.scribd.com/document/649803058/Commodore-64-Programmer-s-Reference-Guide?utm_source=openai))

## Source Code
```basic
10 FOR I=1 TO 50:FOR J=0 TO 7
20 POKE 53265,(PEEK(53265) AND 248) OR J:NEXT J,I
30 FOR I=1 TO 50:FOR J=7 TO 0 STEP -1
40 POKE 53265,(PEEK(53265) AND 248) OR J:NEXT J,I

10 POKE 53281,0:PRINT CHR$(5);CHR$(147):FOR I=1 TO 5:PRINT CHR$(17):NEXT
20 FOR I=1 TO 30
30 PRINT TAB(I-1);"        ";  ' (10 spaces)
40 WAIT 53265,128:POKE 53265,PEEK(53265) AND 248:PRINT TAB(I);"AWAY WE GO"
50 FOR J=1 TO 7
60 POKE 53265,(PEEK(53265) AND 248) + J
```

Notes on the BASIC listings:
- These examples repeatedly write only bits 0–2 (YSCROLL) while preserving the other bits in $D011 by masking with AND 248 (11111000b).
- WAIT 53265,128 pauses until bit 7 of $D011 is set (useful for synchronizing to raster activity).
- The examples demonstrate smooth fine-scroll motion within an 8-scanline character cell; to continue scrolling past the 7→0 wrap you must implement a coarse scroll (byte/character-line memory move), typically in machine language.

Machine-language coarse-scroll routine:
```assembly
; Coarse vertical scroll routine for the Commodore 64
; Assumes screen memory is at $0400 (default)
; Scrolls the screen up by one line

        LDX #0
ScrollLoop:
        LDA $0480,X        ; Load character from next line
        STA $0400,X        ; Store it in current line
        LDA $0580,X        ; Load color from next line
        STA $0500,X        ; Store it in current line
        INX
        CPX #120           ; 40 columns * 3 rows
        BNE ScrollLoop

        ; Clear the last line
        LDX #0
ClearLoop:
        LDA #32            ; Space character
        STA $07C0,X        ; Last line of screen memory
        LDA #1             ; Default color (white)
        STA $07E0,X        ; Last line of color memory
        INX
        CPX #40
        BNE ClearLoop

        RTS
```
This routine shifts the screen content up by one line (coarse scroll) and clears the last line. It operates on the default screen memory at $0400 and color memory at $D800. Adjust addresses if using different screen or color memory locations.

## Key Registers
- $D011 - VIC-II - Bits 0-2 vertical fine scroll (0–7 scanlines); bit 3 selects 24/25 row text mode; bit 4 screen blanking; bit 5 bitmap mode enable (BMM); bit 6 extended color/text mode (ECM); bit 7 = MSB (9th bit) of raster compare.

## References
- "raster_register_and_interrupts" — expands on Bit 7 being the high bit (9th) of raster compare at $D012.
- Commodore 64 Programmer's Reference Guide, Chapter 3: Programming Graphics. ([scribd.com](https://www.scribd.com/document/649803058/Commodore-64-Programmer-s-Reference-Guide?utm_source=openai))

## Labels
- D011
