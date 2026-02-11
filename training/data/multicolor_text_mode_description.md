# Multicolor text mode (VIC-II bit 4 / $D016)

**Summary:** Multicolor text mode is enabled by bit 4 of VIC-II register $D016 (53270) and interprets each character-shape byte as four 2-bit pairs selecting one of four color sources (Background Color Register #0, #1, #2, or the Color RAM nybble). Characters render as 4 horizontal pixels (each pixel double-width), giving multicolor capability at reduced horizontal resolution; user-defined character sets are normally required for useful results.

## Description
When VIC-II multicolor text mode is enabled (bit 4 of $D016 set), each 8-bit character shape byte is not treated as eight independent 1-bit dots. Instead the byte is partitioned into four 2-bit pairs (bit-pairs). Each 2-bit value selects one of four possible color sources for that plotted horizontal "dot":

- 00 → Background Color Register #0
- 01 → Background Color Register #1
- 10 → Background Color Register #2
- 11 → Color RAM nybble (the 4-bit value stored in Color RAM corresponding to the screen position)

Because two bits now represent one horizontal pixel, each character becomes 4 pixels wide. To preserve visible width on the raster, each of those four pixels is drawn twice as wide as a normal high-resolution dot — so horizontal resolution is halved compared with standard text mode.

Practical consequences:
- Fine horizontal detail inside a character is lost relative to high-resolution text mode, so many glyphs will look blocky unless redesigned.
- To exploit the 4-color-per-pixel capability, custom character sets (user-defined characters) are typically created so that meaningful multicolor shapes align with the 4-pixel grid.
- The Color RAM nybble supplies per-character foreground color information (when the 2-bit pair equals 11).

## Key Registers
- $D016 - VIC-II - Bit 4: enable multicolor text mode (character shape bytes interpreted as four 2-bit pairs)
- $D000-$D02E - VIC-II - VIC-II register block (video control/status registers)
- $D800-$DBFF - Color RAM - one 4-bit nybble per screen position (used as the '11' color source in multicolor text mode)

## References
- "character_generator_rom_overview_and_bit_values" — how character shape bytes are interpreted differently in multicolor text mode  
- "employing_user_defined_characters_setup" — recommendation to use custom character sets for multicolor text

## Labels
- D016
