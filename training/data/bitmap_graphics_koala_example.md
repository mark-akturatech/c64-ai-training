# Bitmap graphics and Koala Paint example (C-64)

**Summary:** Explains C-64 bitmap basics (hires 320x200, multicolour 160x200, bitmap ~ $2000 bytes), Koala Paint file layout (bitmap, screen RAM, colour RAM) and the VIC-II registers used to enter bitmap/multicolour/hires modes ($D011, $D016, $D018, plus border/background $D020/$D021). Includes an example assembly routine that copies Koala data into $0400/$D800 and sets VIC registers.

**Bitmap Graphics**
Character sets use $0800 bytes and cannot set every pixel across the whole screen; full-screen bitmap modes require nearly $2000 bytes because the screen is 320×200 pixels in hires mode (1 bit per pixel) or 160×200 in multicolour mode (2 bits per pixel per pixel column effectively). If the picture is highly repetitive or sparse it may be represented by a custom charset + screen RAM (saving ~ $1800 bytes), but full per-pixel control requires the bitmap.

The bitmap data must be aligned to a $2000 boundary in memory: allowable bitmap start addresses are $2000, $4000, $6000, etc. Screen RAM (used for character-colour indexing in bitmap modes) and colour RAM must also be placed where the VIC-II expects them (screen memory is often at $0400 for this example; colour RAM at $D800-$DBFF). The VIC-II is told the locations and modes via its registers.

Koala Paint format packs three main blocks (typical layout used here):
- bitmap data (takes ~ $2000 bytes),
- screen RAM data (character indices; copied to $0400 in this example),
- colour RAM data (copied to $D800 in this example).
The exact offsets used in the example code assume a Koala picture already loaded in memory (see loading note below).

You must set these VIC-II registers to enable bitmap and multicolour/hires modes and to point the VIC to the screen/bitmap locations: $D011, $D016 and $D018. Border/background colours are in $D020/$D021.

Notes on addressing and Koala files:
- Koala pictures are often stored on disk to load at $6000; for this example the file must be loaded to $2000 (use the monitor load command shown below).
- Bitmap must be placed on a $2000-aligned address; screen RAM is usually a $0400-$07FF range; colour RAM is at $D800-$DBFF and holds one 4-bit colour nibble per character position.
- The example code copies Koala screen and colour data from their offsets (in this example: $3F40/$4328 etc.) into $0400/$D800, then sets VIC registers to bitmap/multicolour mode.

**Koala Paint File Format**
A Koala Paint file has a total size of 10003 bytes, structured as follows:

- **Offset 0-1**: Load address (2 bytes). Typically $6000, indicating the file is intended to load at memory address $6000.
- **Offset 2-8001**: Bitmap data (8000 bytes). This represents the pixel data for the image.
- **Offset 8002-9001**: Screen RAM data (1000 bytes). These bytes correspond to the screen memory, mapping characters to screen positions.
- **Offset 9002-10001**: Color RAM data (1000 bytes). Each byte contains color information for the corresponding screen position.
- **Offset 10002**: Background color (1 byte). This byte specifies the background color of the image.

When loaded into memory starting at $6000, the layout is as follows:

- **$6000-$7F3F**: Bitmap data (8000 bytes).
- **$7F40-$8327**: Screen RAM data (1000 bytes).
- **$8328-$870F**: Color RAM data (1000 bytes).
- **$8710**: Background color (1 byte).

This structure aligns with the C64's memory organization for bitmap graphics, facilitating direct usage by the VIC-II chip.

**Koala Paint example (what the code does)**
1. Set border and background to black via $D020 and $D021 (example sets #$00 directly; the Koala file holds an intended background colour which could be read from the file).
2. Copy screen RAM blocks from the Koala image source locations into the C-64 screen RAM at $0400 (four consecutive 1KB blocks in the example).
3. Copy colour RAM blocks from the Koala image source locations into $D800-$DBFF (four consecutive 64-byte blocks in the example).
4. Set VIC-II to bitmap + multicolour mode and point screen/bitmap pointers:
   - $D011 = #$3B (enter bitmap mode and configure relevant bits),
   - $D016 = #$18 (turn on multicolour mode),
   - $D018 = #$18 (point screen RAM at $0400 and bitmap at $2000).
5. Loop forever to keep the display running.

Load note: Koala images are often stored to load at $6000; in the monitor use:
l "filename",08,2000
to load the file at $2000 instead (so the example can use bitmap at $2000).

## Source Code
```asm
* = $0801

           lda #$00
           sta $d020
           sta $d021    ; set border and screen colour to black

           tax
copyloop:
           lda $3f40,x  ; copy screen RAM blocks (Koala -> $0400)
           sta $0400,x
           lda $4040,x
           sta $0500,x
           lda $4140,x
           sta $0600,x
           lda $4240,x
           sta $0700,x
           lda $4328,x  ; copy colour RAM blocks (Koala -> $D800)
           sta $d800,x
           lda $4428,x
           sta $d900,x
           lda $4528,x
           sta $da00,x
           lda $4628,x
           sta $db00,x
           dex
           bne copyloop

           lda #$3b     ; bitmap mode (VIC-II control)
           ldx #$18     ; multi-colour mode value for $D016
           ldy #$18     ; screen at $0400, bitmap at $2000 for $D018
           sta $d011
           stx $d016
           sty $d018

mainloop:
           jmp mainloop ; keep going...
```

## Key Registers
- $D000-$D02E - VIC-II - control registers (includes $D011 bitmap/raster/vertical scroll control; $D016 multicolour/column/bitmap control; $D018 memory pointers; $D020 border colour; $D021 background colour)
- $D800-$DBFF - Colour RAM - per-character (4-bit) colour entries used by character and bitmap modes
- $0400-$07FF - Screen RAM (example target) - character/colour indices for bitmap modes
- $2000-$3FFF - Bitmap area (must be $2000-aligned; example uses $2000)

## References
- "bitmap_screen_layout" — expands on C-64 bitmap memory layout and addressing non-linearity
- [Koala Paint picture ripping](https://fightingcomputers.nl/Guides/Koala-Paint-picture-ripping)
- [KoalaPainter - Wikipedia](https://en.wikipedia.org/wiki/KoalaPainter)