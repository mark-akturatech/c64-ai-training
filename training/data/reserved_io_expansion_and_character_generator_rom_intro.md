# Reserved I/O Expansion ($DE00-$DEFF), CIA #2 Images ($DF00-$DFFF) and Character Generator ROM ($D000-$DFFF)

**Summary:** Describes the reserved I/O expansion area at $DE00-$DEFF (Expansion Port pin 7) and the adjacent $DF00-$DFFF area (CIA #2 register images via Expansion Port pin 10), and documents the alternate Character Generator ROM at $D000-$DFFF (VIC-II character shapes, 4 KB = 4096 bytes, two 256-character sets, 8 bytes/character).

**Reserved I/O Expansion ($DE00-$DEFF)**
This 256-byte page (56832–57087, $DE00–$DEFF) is not used by the C64's internal hardware but is accessible from the Expansion Port (pin 7). Cartridges may decode and respond to addresses in this range to provide external control/status functions. Examples:
- CP/M module: writes to $DE00 toggle the Z‑80 microprocessor on/off (handing system control between 6502 and Z‑80).
- Simon's BASIC cartridge (16K at $8000–$BFFF) uses this area to switch the cartridge visible/active state: the cartridge copies part of itself into RAM and then uses reads/writes at $DE00 to enable/disable the cartridge.

Behavior: the CPU writes/reads these addresses and external cartridge logic interprets the accesses. The internal C64 hardware does not claim these addresses.

**CIA #2 Register Images via Expansion Port ($DF00-$DFFF)**
The page $DF00–$DFFF (57088–57343) is not used by C64 internal hardware but is accessible via Expansion Port pin 10. Commodore suggested using this space for inexpensive peripherals (example: a parallel disk drive). The area can be used to present images of CIA #2 registers to external hardware or to map peripheral registers for cartridge use.

**Alternate Character Generator ROM ($D000-$DFFF)**
The 4 KB Character Generator ROM (53248–57343, $D000–$DFFF) holds bitmap shape data used for text/graphics characters. Key facts:
- Size: 4096 bytes total.
- Organization: two complete 256-character sets (256 × 8 bytes × 2 = 4096). Each character is 8 bytes (one byte per row) representing an 8×8 dot matrix.
- Character order: bytes are arranged in the sequence of the screen code chart (see Appendix G for full chart). The first 8 bytes correspond to the first character in the screen code, next 8 to the second, etc.
- Bit ordering: within each byte, Bit 7 is the leftmost bit of the character row and Bit 0 is the rightmost. A bit value of 1 lights the corresponding pixel in that column for that row.
- Bit weights: Bit 0 = 1, Bit 1 = 2, Bit 2 = 4, Bit 3 = 8, Bit 4 = 16, Bit 5 = 32, Bit 6 = 64, Bit 7 = 128.
- Character sets in the ROM include uppercase/graphics and alternate sets (uppercase/reverse, lowercase/uppercase, and their reverse variants) as stored by Commodore.

Visibility note: the VIC-II reads character shape bytes from whichever 4K bank contains the character ROM image; where that image is visible depends on VIC-II memory banking (see separate documentation on VIC memory banks and character-ROM visibility).

## Source Code
```text
Memory ranges and descriptions:
- 56832-57087   ($DE00-$DEFF) - Reserved I/O Expansion (accessible via Expansion Port pin 7). Used by cartridges (e.g., CP/M module, Simon's BASIC) to control external logic or enable/disable cartridge.
- 57088-57343   ($DF00-$DFFF) - CIA #2 Register Images (accessible via Expansion Port pin 10). Can map peripheral registers or present CIA images.
- 53248-57343   ($D000-$DFFF) - Alternate Character Generator ROM (4 KB): contains 4096 bytes = two 256-character sets (8 bytes/character).

Character ROM organization:
- Total bytes: 4096
- Characters: 256 characters per set
- Bytes per character: 8 (one byte = one 8-bit row)
- Sets: two full 256-character sets in ROM (ordering follows screen code chart)

Bit-to-pixel mapping (per byte, one row of 8 pixels):
Bit index: 7 6 5 4 3 2 1 0
Pixel pos: left ..................... right
Bit values: 128 64 32 16 8 4 2 1

Example notes from source:
- First 8 bytes in ROM = shape for the first screen-code character (commercial at sign '@' in C64 screen code ordering).
- Next 8 bytes = shape for letter 'A', etc.
```

## Key Registers
- $DE00-$DEFF - Expansion Port / Reserved I/O Expansion (accessible via Expansion Port pin 7) — cartridge control area (e.g., CP/M module control, Simon's BASIC enable/disable).
- $DF00-$DFFF - Expansion Port / CIA #2 Register Images (accessible via Expansion Port pin 10) — space for peripheral register images or external CIA mapping.
- $D000-$DFFF - Character Generator ROM (alternate image, 4 KB) — VIC-II reads character shape bytes (8 bytes per character for 256 characters, two sets).

## References
- "character_rom_byte_examples_and_graphic_tools" — expands on examples of bytes forming character graphics and BASIC programs to display shapes
- "vic_memory_blocks_and_considerations_for_graphics" — expands on where Character ROM is visible to VIC-II depending on memory banking