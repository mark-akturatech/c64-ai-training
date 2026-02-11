# VIC-II Sprites — Multicolor, Positioning, Enable, Colors, and Registers

**Summary:** Sprite setup and control on the VIC-II (C64) including sprite enable ($D015), horizontal/vertical position registers ($D000-$D010), MSB horizontal-extension register ($D010), sprite color registers ($D027-$D02E), sprite multicolor select and registers ($D01C, $D025-$D026), and Background Color Registers used by multicolor text/bitmap modes ($D021-$D024).

**Sprite setup and operation**
Sprites on the C64 require several distinct steps before they appear on screen:
- Place the sprite shape bytes into memory. Each sprite requires 64 bytes of memory, even though only 63 bytes are used for the shape; the 64th byte is unused but must be allocated. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_3/page_131.html?utm_source=openai))
- Set the Sprite Data Pointer to point to the memory block containing the sprite shape. The sprite pointers are located at memory addresses 2040–2047 ($07F8–$07FF), corresponding to sprites 0–7. Each pointer holds a value between 0 and 255, which, when multiplied by 64, gives the starting address of the sprite data within the current VIC-II memory bank. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_3/page_134.html?utm_source=openai))
- Enable the sprite in the Sprite Display Enable Register ($D015). Each bit in this register corresponds to a sprite; setting a bit to 1 enables the corresponding sprite. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_3/page_134.html?utm_source=openai))
- Set horizontal and vertical positions for the sprite via the Sprite Horizontal/Vertical Position Registers ($D000–$D00F). Each sprite has an X and Y position register. ([c64-wiki.com](https://www.c64-wiki.com/wiki/Page_208-211?utm_source=openai))
- (Optional) Set the 9th bit of the horizontal position for a sprite in the Most Significant Bit of X Coordinate register ($D010). This register allows for horizontal positions beyond 255 by providing the 9th bit for each sprite's X coordinate. ([c64-wiki.com](https://www.c64-wiki.com/wiki/Page_208-211?utm_source=openai))
- Set a color for the sprite in the Sprite Color Registers ($D027–$D02E). Each sprite has a dedicated color register. ([c64-wiki.com](https://www.c64-wiki.com/wiki/Page_208-211?utm_source=openai))
- Optionally enable multicolor mode for the sprite using the Sprite Multicolor Mode Register ($D01C) and supply the two multicolor values in the Sprite Multicolor Registers ($D025–$D026). Each bit in $D01C corresponds to a sprite; setting a bit to 1 enables multicolor mode for the corresponding sprite. ([c64-wiki.com](https://www.c64-wiki.com/wiki/Page_208-211?utm_source=openai))
- Optional features: expand horizontally/vertically to double size, collision detection (sprite-to-sprite and sprite-to-background), and priority (whether the sprite is drawn in front of or behind background graphics).

Multicolor behavior:
- Multicolor sprites use pairs of bits per double-width dot, reducing horizontal resolution (dots doubled).
- The color choices per multicolor pixel are: Background Color Register 0, the sprite's own color register, or one of the two Sprite Multicolor Registers ($D025–$D026).
- Multicolor text/bitmap modes are separately controlled by VIC-II bits (e.g., bit 4 of $D016 for multicolor text mode) and use Background Color Registers grouped by character-code ranges in Extended Background Color Mode ($D021–$D024).

Animation and shape changes:
- Moving a sprite = change its horizontal/vertical position registers.
- Changing the sprite shape on-the-fly = change the Sprite Data Pointer to point to another block of shape bytes.

**Positioning, ranges, and visible area**
Vertical:
- Vertical position values: 0–255. Value denotes the Y position of the top line of the sprite's 21-line height.
- Visible scan lines for the C64 display: lines 50–249 (200 visible lines).
  - Vertical ≤ $1D (29) → sprite fully above visible area.
  - Vertical = $1E (30) → bottom line begins to appear at top of screen.
  - Vertical = $E6 (230) → bottom line begins to be lost at bottom edge.
  - Vertical = $FA (250) → sprite fully off bottom edge.

Horizontal:
- Horizontal registers are 8-bit (0–255). To cover 320-dot visible width, a ninth bit is stored in the MSB register at $D010 (each sprite assigned one bit).
- If a sprite's MSB bit is set, add 256 to its 8-bit horizontal register to compute final horizontal position (range 0–511).
- Horizontal position value denotes the leftmost dot of the sprite's 24-dot width.
- Visible display dot positions: 24–344 correspond to full sprite visibility.
  - At position 321 ($141), the rightmost dot goes past the right edge of the visible area, and the sprite begins to disappear off-screen. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_3/page_131.html?utm_source=openai))
- Example (from source): to set Sprite 5 to horizontal 30:
  - POKE 53258,30 (sprite 5 horizontal register)
  - Clear bit 5 in MSB register: POKE 53264,PEEK(53264) AND (255-16)
  - If bit 5 is left set, the displayed position will be 256 higher (286 instead of 30).

**Sprite color registers and multicolor registers**
- Sprite Color Registers ($D027–$D02E) — one byte per sprite, selects the sprite color in single-color mode (or used as one of the possible colors in multicolor mode).
- Sprite Multicolor Registers ($D025–$D026) — provide two shared multicolor values used when sprites are in multicolor mode.
- Sprite Multicolor Select ($D01C) — selects which sprites use multicolor mode.
- Background Color Registers ($D021–$D024) — used by Extended Background Color Mode to select backgrounds for groups of character codes; they also appear among possible multicolor values in some modes.

**Optional features mentioned**
- Expand registers: double width, double height, or both (per-sprite expand bits).
  - Horizontal expansion: $D01D — each bit corresponds to a sprite; setting a bit to 1 doubles the width of the corresponding sprite. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_3/page_137.html?utm_source=openai))
  - Vertical expansion: $D017 — each bit corresponds to a sprite; setting a bit to 1 doubles the height of the corresponding sprite. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_3/page_137.html?utm_source=openai))
- Collision detection registers: report when a sprite overlaps another sprite or background graphics.
  - Sprite-to-sprite collision: $D01E — each bit corresponds to a sprite; a bit is set to 1 when the corresponding sprite collides with another sprite. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_3/page_144.html?utm_source=openai))
  - Sprite-to-background collision: $D01F — each bit corresponds to a sprite; a bit is set to 1 when the corresponding sprite collides with background graphics. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_3/page_144.html?utm_source=openai))
- Priority register: choose sprite priority vs. normal graphics (sprite in front of or behind other objects).
  - Sprite-background priority: $D01B — each bit corresponds to a sprite; setting a bit to 1 places the corresponding sprite behind background graphics, setting it to 0 places the sprite in front. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_3/page_144.html?utm_source=openai))

## Source Code
```text
Sprite shape bytes (full 63-byte example; shows bit patterns and equivalent decimal bytes):

000000000111111000000000 = 0, 126, 0
000000001111111100000000 = 0, 255, 0
000000011111111110000000 = 0, 255, 128
000000111111111111000000 = 0, 255, 192
000001111111111111100000 = 0, 255, 224
000011111111111111110000 = 0, 255, 240
000111111111111111111000 = 0, 255, 248
001111111111111111111100 = 0, 255, 252
011111111111111111111110 = 0, 255, 254
111111111111111111111111 = 0, 255, 255
111111111111111111111111 = 0, 255, 255
111111111111111111111111 = 0, 255, 255
111111111111111111111111 = 0, 255, 255
111111111111111111111111 = 0, 255, 255
111111111111111111111111 = 0, 255, 255
111111111111111111111111 = 0, 255, 255
111111111111111111111111 = 0, 255, 255
111111111111111111111111 = 0, 255, 255
111111111111111111111111 = 0, 255, 255
111111111111111111111111 = 0, 255, 255
111111111111111111111111 = 0, 255, 255
```

```text
Register references (as given in source, decimal and hex):
- Sprite Horizontal and Vertical Position Registers: 53248–53263  ($D000–$D00F)
- Most Significant Bit of X Coordinate: 53264  ($D010)
- Sprite Display Enable Register: 53269  ($D015)
- Sprite Multicolor Select: 53276  ($D01C)
- Sprite Multicolor Registers: 53285–53286  ($D025–$D026)
- Sprite Color Registers: 53287–53294  ($D027–$D02E)
- Background Color Registers (Extended Background Color Mode): 53281–53284  ($D021–$D024)
- Sprite Horizontal Expansion: 53277  ($D01D)
- Sprite Vertical Expansion: 53271  ($D017)
- Sprite-to-Sprite Collision: 53278  ($D01E)
- Sprite-to-Background Collision: 53279  ($D01F)
- Sprite-Background Priority: 53275  ($D01B)
```

## Key Registers
- $D000–$D00F - VIC-II - Sprite Horizontal and Vertical Position Registers (sprites 0–7)
- $D010 - VIC-II - Most Significant Bit of X Coordinate (9th bit for sprite X positions)
- $D015