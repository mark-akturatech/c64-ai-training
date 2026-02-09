# C64 Character Generator ROM — Character definition format

**Summary:** Character glyphs are 8x8 dot matrices stored as 8 bytes per character in the Character Generator ROM mapped at $D000 when I/O is switched out; each byte is one row (bits = dots). The ROM contains two 2K character sets (upper/graphics and upper+lower) for a total of 4K ($D000-$DFFF).

## Character definitions
Each character is an 8×8 grid. Storage layout and rules:
- One byte per row, 8 rows per character (8 bytes/char).
- Within each byte, bit = 1 means the dot is on; bit = 0 means the dot is off.
- Character generator ROM is mapped at decimal 53248 ($D000) when I/O is switched out.
- Character code 0 (the @ glyph) occupies $D000–$D007. The next character (as shown in the source) occupies $D008–$D00F.
- Address formula: character_address = $D000 + (character_code × 8). Example: character_code 0 → $D000-$D007.
- Size: 8 bytes × 256 characters = 2048 bytes (2 KB) per set; two sets = 4096 bytes (4 KB) total.

**[Note: Source may contain an error — it states “2K (2048 bits)”; this should read “2K (2048 bytes)”.]**

## Source Code
```text
IMAGE     BINARY       PEEK
 **      00011000       24
****     00111100       60
**  **   01100110      102
******   01111110      126
**  **   01100110      102
**  **   01100110      102
**  **   01100110      102
00000000  0

Addresses (as given in source):
 @ (character code 0):   $D000 - $D007
 A (next character):    $D008 - $D00F

Size calculation:
 8 bytes/char × 256 chars = 2048 bytes (2 KB) per character set
 2 character sets → 4096 bytes (4 KB) total
```

## Key Registers
- $D000-$DFFF - Character Generator ROM (VIC/ROM area) — 4 KB mapped when I/O is switched out; two 2K character sets (upper/graphics and upper+lower), 8 bytes per character.

## References
- "programmable_characters_overview_and_considerations" — expands on pointing the VIC-II to RAM for custom character sets (external cross-reference).