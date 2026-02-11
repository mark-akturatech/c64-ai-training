# Intro to graphics on the C-64: VIC registers, screen memory and colour RAM

**Summary:** Introduces VIC-II (VIC) register importance for controlling display, default screen memory at $0400, and colour RAM at $D800 (per-character colour values). Searchable terms: VIC-II, $D000-$D02E, $0400, $D800, screen memory, colour RAM.

**VIC-II overview**
The VIC-II (commonly called "VIC") is the C‑64's video chip and must be programmed via its memory‑mapped registers to control what appears on the screen (raster position, display mode, screen/character base addresses, sprite enable/pointers, interrupt sources, etc.). Writing the correct values into the appropriate VIC registers is the primary method for changing display layout, character/bitmap mode, and enabling hardware sprites.

(VIC-II = video chip; registers are memory-mapped in the $D000 range.)

**VIC-II Registers**
The VIC-II chip has 47 registers mapped to memory addresses $D000 to $D02E. Below is a detailed list of these registers along with their bitfield definitions:

- **$D000-$D00F**: Sprite X and Y coordinates
  - $D000: Sprite 0 X-coordinate
  - $D001: Sprite 0 Y-coordinate
  - $D002: Sprite 1 X-coordinate
  - $D003: Sprite 1 Y-coordinate
  - $D004: Sprite 2 X-coordinate
  - $D005: Sprite 2 Y-coordinate
  - $D006: Sprite 3 X-coordinate
  - $D007: Sprite 3 Y-coordinate
  - $D008: Sprite 4 X-coordinate
  - $D009: Sprite 4 Y-coordinate
  - $D00A: Sprite 5 X-coordinate
  - $D00B: Sprite 5 Y-coordinate
  - $D00C: Sprite 6 X-coordinate
  - $D00D: Sprite 6 Y-coordinate
  - $D00E: Sprite 7 X-coordinate
  - $D00F: Sprite 7 Y-coordinate

- **$D010**: Most significant bits of sprite X-coordinates
  - Bit 0: Sprite 0 X MSB
  - Bit 1: Sprite 1 X MSB
  - Bit 2: Sprite 2 X MSB
  - Bit 3: Sprite 3 X MSB
  - Bit 4: Sprite 4 X MSB
  - Bit 5: Sprite 5 X MSB
  - Bit 6: Sprite 6 X MSB
  - Bit 7: Sprite 7 X MSB

- **$D011**: Control Register 1
  - Bit 0: Unused
  - Bit 1: Raster interrupt enable
  - Bit 2: Extended background color mode
  - Bit 3: Bitmap mode
  - Bit 4: Screen enable
  - Bit 5: 25-row select
  - Bit 6: Most significant bit of raster counter
  - Bit 7: Interlace mode

- **$D012**: Raster counter (least significant 8 bits)

- **$D013**: Light pen X-coordinate

- **$D014**: Light pen Y-coordinate

- **$D015**: Sprite enable
  - Bit 0: Sprite 0 enable
  - Bit 1: Sprite 1 enable
  - Bit 2: Sprite 2 enable
  - Bit 3: Sprite 3 enable
  - Bit 4: Sprite 4 enable
  - Bit 5: Sprite 5 enable
  - Bit 6: Sprite 6 enable
  - Bit 7: Sprite 7 enable

- **$D016**: Control Register 2
  - Bit 0: Unused
  - Bit 1: Unused
  - Bit 2: Unused
  - Bit 3: Unused
  - Bit 4: Multicolor mode
  - Bit 5: 38/40-column select
  - Bit 6: Unused
  - Bit 7: Unused

- **$D017**: Sprite Y expansion
  - Bit 0: Sprite 0 Y expand
  - Bit 1: Sprite 1 Y expand
  - Bit 2: Sprite 2 Y expand
  - Bit 3: Sprite 3 Y expand
  - Bit 4: Sprite 4 Y expand
  - Bit 5: Sprite 5 Y expand
  - Bit 6: Sprite 6 Y expand
  - Bit 7: Sprite 7 Y expand

- **$D018**: Memory setup
  - Bits 0-3: Character memory location
  - Bits 4-7: Screen memory location

- **$D019**: Interrupt status register
  - Bit 0: Raster interrupt
  - Bit 1: Sprite-background collision
  - Bit 2: Sprite-sprite collision
  - Bit 3: Light pen interrupt
  - Bits 4-7: Unused

- **$D01A**: Interrupt control register
  - Bit 0: Raster interrupt enable
  - Bit 1: Sprite-background collision interrupt enable
  - Bit 2: Sprite-sprite collision interrupt enable
  - Bit 3: Light pen interrupt enable
  - Bits 4-7: Unused

- **$D01B**: Sprite data priority
  - Bit 0: Sprite 0 priority
  - Bit 1: Sprite 1 priority
  - Bit 2: Sprite 2 priority
  - Bit 3: Sprite 3 priority
  - Bit 4: Sprite 4 priority
  - Bit 5: Sprite 5 priority
  - Bit 6: Sprite 6 priority
  - Bit 7: Sprite 7 priority

- **$D01C**: Sprite multicolor mode select
  - Bit 0: Sprite 0 multicolor
  - Bit 1: Sprite 1 multicolor
  - Bit 2: Sprite 2 multicolor
  - Bit 3: Sprite 3 multicolor
  - Bit 4: Sprite 4 multicolor
  - Bit 5: Sprite 5 multicolor
  - Bit 6: Sprite 6 multicolor
  - Bit 7: Sprite 7 multicolor

- **$D01D**: Sprite X expansion
  - Bit 0: Sprite 0 X expand
  - Bit 1: Sprite 1 X expand
  - Bit 2: Sprite 2 X expand
  - Bit 3: Sprite 3 X expand
  - Bit 4: Sprite 4 X expand
  - Bit 5: Sprite 5 X expand
  - Bit 6: Sprite 6 X expand
  - Bit 7: Sprite 7 X expand

- **$D01E**: Sprite-sprite collision detection
  - Bits 0-7: Sprite-sprite collision flags

- **$D01F**: Sprite-background collision detection
  - Bits 0-7: Sprite-background collision flags

- **$D020**: Border color

- **$D021**: Background color 0

- **$D022**: Background color 1

- **$D023**: Background color 2

- **$D024**: Background color 3

- **$D025**: Sprite multicolor 0

- **$D026**: Sprite multicolor 1

- **$D027-$D02E**: Sprite colors
  - $D027: Sprite 0 color
  - $D028: Sprite 1 color
  - $D029: Sprite 2 color
  - $D02A: Sprite 3 color
  - $D02B: Sprite 4 color
  - $D02C: Sprite 5 color
  - $D02D: Sprite 6 color
  - $D02E: Sprite 7 color

**Screen memory and colour RAM**
- **Screen memory** (default $0400) holds character codes (one byte per character cell). Programs place values here to select which character/glyph is drawn in each tile on the text screen. The default screen memory range is $0400-$07E7, covering 1000 character cells (40 columns × 25 rows). ([c64-wiki.com](https://www.c64-wiki.com/wiki/Screen_RAM?utm_source=openai))

- **Colour RAM** (at $D800) parallels the screen memory: each screen cell has a corresponding colour entry in colour RAM that holds the foreground (ink) colour for that character. Colour RAM is accessed as a separate memory region and is typically modified to change per‑cell colours without altering character codes. The colour RAM range is $D800-$DBE7, covering 1000 bytes corresponding to the 1000 character cells on the screen. ([c64-wiki.com](https://www.c64-wiki.com/wiki/Color_RAM?utm_source=openai))

- The VIC must be configured so it references the correct screen memory and character/bitmap data locations; placing values into VIC registers tells the chip where to fetch the character set and screen memory used for display.

**Example code snippets**
Below are example code snippets demonstrating how to write to VIC registers and update screen/colour RAM:

In this example:
- The `LDA` instruction loads a value into the accumulator.
- The `STA` instruction stores the accumulator's value into the specified memory address.
- The first `LDA` and `STA` pair sets the VIC-II to use screen memory starting at $0400 and character memory at $2000.
- The second pair writes the character code for 'A' into the top-left corner of the screen.
- The third pair sets the colour of that character to white.

**Where this fits**
- Learning which VIC registers to write (and what values to use) is the immediate next step for controlled graphics output.
- Subsequent, related topics (in other chunks) cover hardware sprites, character graphics modes, and bitmap/KOALA image display.

## Source Code

```assembly
; Set screen memory to $0400 and character memory to $2000
LDA #$14        ; %00010100: Screen at $0400, Character at $2000
STA $D018       ; Store in VIC Memory Control Register

; Write character 'A' (PETSCII code 1) to top-left corner of screen
LDA #1          ; 'A' character code
STA $0400       ; Store in screen memory at $0400

; Set colour of character at top-left corner to white (colour code 1)
LDA #1          ; White colour code
STA $D800       ; Store in colour RAM at $D800
```

## Key Registers
