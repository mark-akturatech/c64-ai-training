# VIC-II Bank / Block 0 (addresses $0000-$3FFF) — C64 I/O Map

**Summary:** VIC-II bank/block 0 (addresses 0–16383 / $0000–$3FFF) is normally used for system variables and BASIC program text; default screen memory is at $400–$7FF ($1024–$2047). The VIC-II sees the character generator ROM at $1000–$1FFF, reducing available graphics RAM in this bank and leaving only small free areas for sprites/characters; BASIC memory pointers ($2C, $38) can be adjusted to free more space.

## Block 0 description
- Address range: $0000–$3FFF (0–16383). This bank is typically occupied by system variables and BASIC program text; default screen memory is located at $0400–$07FF (1024–2047).
- VIC-II visible ROM: The VIC-II views the character generator ROM in this bank at $1000–$1FFF (4096–8191), which makes that 4 KB region unavailable for VIC graphics data when this bank is selected.
- Free/usable areas within Block 0 (as stated):
  - $02A7–$02FF (679–767): unused — can hold one sprite shape (sprite number 11) or data for 11 characters.
  - $0334–$03FF (820–1023): includes the cassette I/O buffer but is available for graphics memory; large enough for three sprite shapes (sprite numbers 13, 14, 15) or character data for 25 characters (character numbers 103–127).
- Bitmap/graphics constraints: There is generally insufficient contiguous RAM in this bank for full bitmap graphics without moving BASIC memory. To obtain more graphics RAM, adjust BASIC memory pointers:
  - Start of BASIC pointer (address 44 decimal / $2C) — raising it can free low memory.
  - End of BASIC pointer (address 56 decimal / $38) — lowering it can reserve memory after BASIC text.
- Notes: The above free regions are limited and suitable only for small amounts of sprite or character data unless the VIC bank is switched or BASIC memory pointers are modified.

## References
- "vic_memory_block2_description" — comparison with Block 2 where RAM exists under BASIC ROM  
- "changing_vic_memory_banks_procedure" — steps to switch VIC bank to avoid conflicts with system usage