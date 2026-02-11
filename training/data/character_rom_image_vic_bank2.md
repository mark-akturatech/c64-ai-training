# Character ROM Image — VIC-II (Memory Bank 2) $9000-$9FFF

**Summary:** Character generator ROM image located at $9000-$9FFF (36864–40959) presented to the VIC-II when using memory bank 2; VIC-II can access the built-in character ROM only when configured to use bank 0 or bank 2 — otherwise character shapes must be supplied in RAM.

**Description**
This chunk documents the 8K character ROM image area that the VIC-II sees when the C64 is configured to use the third 16K memory block (bank 2). The ROM image at $9000-$9FFF contains the character generator bytes (glyph bitmaps) the VIC-II will fetch for text/charset graphics when that bank is active.

Notes from the source:
- The scenario is relevant to PET emulation, where the PET text screen resides at $8000 ($8000 = 32768 decimal); in that setup the VIC-II maps the character ROM into $9000-$9FFF (see source).
- The character ROM is available to VIC-II only in memory banks 0 or 2. If the VIC-II is switched to one of the other two banks, there is no character ROM presented and the program must supply character shapes in RAM (a user-provided character table).

No character bitmap data (the 8K ROM bytes) are included in this chunk — only the location and behavioral rules.

## Key Registers
- $9000-$9FFF - Character ROM image (VIC-II character generator ROM presented when VIC-II uses memory bank 2)

## References
- "character_rom_image_vic_bank0" — expands on both bank 0 and bank 2 presenting the character ROM to VIC-II
