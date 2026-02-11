# Screen memory and color RAM (C64)

**Summary:** Describes Commodore 64 screen memory ($0400-$07E7, 1000 bytes), color RAM/“color memory” ($D800-$DBE7, 1000 bytes, 4-bit values 0–15), and the VIC-II register range ($D000-$D02E) used to select graphics modes.

## Screen & color memory
- The C64 text screen uses 1000 character cells. The common/default screen memory area is decimal 1024–2023 (hex $0400–$07E7). Each cell is one byte (8 bits) that stores a character code (0–255). The VIC-II translates that code into a character pattern from the active character set (256 characters).
- The companion color RAM contains one 4-bit color value per screen cell (0–15). The color memory for those 1000 screen positions is at decimal 55296–56295 (hex $D800–$DBE7) in the standard layout. Each color RAM byte holds the color in its low nibble (4 bits); only values 0–15 are used for the 16 hardware colors.
- The VIC-II reads screen memory and color RAM together to render the visible 40×25 character grid. Character graphics, colors, and many graphics-mode options are controlled through the VIC-II control registers.

## VIC-II graphics control
- The VIC-II chip registers (47 registers) determine graphics modes, screen base pointers, character memory pointers, sprite control, and raster/timing behavior. The VIC-II I/O block appears at $D000–$D02E; many graphics functions are changed by POKEing values into these registers (e.g., screen/charset pointers, bitmap mode bits, multicolor bits, etc.).
- The VIC-II base I/O range (decimal 53248–53294, hex $D000–$D02E) is the primary means to relocate/alter screen display behavior (see related chunks for register-by-register detail).

## Source Code
```text
Screen memory (standard text screen)
- Decimal: 1024 .. 2023
- Hex:     $0400 .. $07E7
- Size:    1000 bytes (1 byte per character cell; values 0..255 map to character codes)

Color RAM (color memory, per-screen-cell)
- Decimal: 55296 .. 56295
- Hex:     $D800 .. $DBE7
- Size:    1000 bytes (1 nibble per cell; values 0..15 used; low 4 bits)

VIC-II I/O registers (graphics control)
- Decimal: 53248 .. 53294
- Hex:     $D000 .. $D02E
- Count:   47 registers (control graphics modes, screen/charset pointers, sprites, raster IRQs, etc.)

Notes:
- Character set contains 256 characters (character codes 0..255).
- Color RAM is physically 4-bit-per-cell; software typically accesses it via $D800.. with POKE/PEEK (low nibble holds color index).
- Screen layout: 40 columns × 25 rows = 1000 visible cells.
```

## Key Registers
- $0400-$07E7 - RAM - Screen memory (1000 character codes, default text screen)
- $D800-$DBE7 - Color RAM - Color memory for screen cells (1000 nibbles, values 0–15)
- $D000-$D02E - VIC-II - Graphics/control registers (47 registers; select graphics modes, screen/charset pointers, sprites, raster)

## References
- "screen_memory" — how to relocate screen memory and related control registers
- "color_memory" — details and fixed location of color RAM at $D800