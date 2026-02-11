# Standard Character Mode (C64)

**Summary:** Standard character mode (VIC-II) uses screen memory for character codes and color memory for per-character color; character patterns are 8x8 (8 bytes each). CHARACTER ADDRESS = SCREEN CODE*8 + (CHARACTER SET*2048) + (BANK*16384). Character patterns may come from ROM or programmable RAM; a full character set is 2K (ROM contains 4K for both upper/lower sets).

**Description**
Standard character mode is the C64’s default text/character display mode on power-up. Key points:

- **Character sourcing:** VIC-II can fetch character bitmaps from ROM or from RAM (programmable character sets). To use custom graphics, you place 8-byte character patterns in RAM and point VIC-II at that memory area by configuring the appropriate registers.
- **Per-cell attributes:** For each screen location, the VIC-II reads the screen memory byte (character code) and the color memory byte (foreground color for that character cell).
- **Character storage/layout:**
  - Each character is an 8x8 dot matrix.
  - Each row of 8 dots is stored as one byte; each bit in the byte corresponds to one dot in that row.
  - A character consists of 8 bytes (one per row) → 256 characters × 8 bytes = 2048 bytes (2K) per character set.
- **ROM layout:** Character ROM holds two 2K sets (commonly described as upper/lower sets), totaling 4K.
- **Address calculation:** VIC-II computes the start address of a character’s 8-byte pattern by combining the screen code, the character-set base, and the video bank base using the formula below.

  CHARACTER ADDRESS = SCREEN CODE*8 + (CHARACTER SET*2048) + (BANK*16384)

  (Here SCREEN CODE is the byte stored in screen memory; CHARACTER SET is the selected 2K character-set index; BANK is the selected 16K video bank index.)

## Key Registers
- **VIC-II Control Register 2 (53272/$D018):** This register controls the locations of screen memory and character memory within the selected 16K video bank.
  - **Bits 3-1:** Select the starting address of character memory in 2K increments within the current video bank.
    - 000: $0000-$07FF
    - 001: $0800-$0FFF
    - 010: $1000-$17FF (default; points to Character ROM in banks 0 and 2)
    - 011: $1800-$1FFF (points to Character ROM in banks 0 and 2)
    - 100: $2000-$27FF
    - 101: $2800-$2FFF
    - 110: $3000-$37FF
    - 111: $3800-$3FFF
  - **Bits 7-4:** Select the starting address of screen memory in 1K increments within the current video bank.
    - 0000: $0000-$03FF
    - 0001: $0400-$07FF (default)
    - 0010: $0800-$0BFF
    - 0011: $0C00-$0FFF
    - 0100: $1000-$13FF
    - 0101: $1400-$17FF
    - 0110: $1800-$1BFF
    - 0111: $1C00-$1FFF
    - 1000: $2000-$23FF
    - 1001: $2400-$27FF
    - 1010: $2800-$2BFF
    - 1011: $2C00-$2FFF
    - 1100: $3000-$33FF
    - 1101: $3400-$37FF
    - 1110: $3800-$3BFF
    - 1111: $3C00-$3FFF
- **CIA #2 Data Port A (56576/$DD00):** Bits 0 and 1 of this register select the 16K video bank for the VIC-II.
  - 00: Bank 3 ($C000-$FFFF)
  - 01: Bank 2 ($8000-$BFFF)
  - 10: Bank 1 ($4000-$7FFF)
  - 11: Bank 0 ($0000-$3FFF) (default)

## References
- "character_memory_overview" — expands on where character patterns are stored and how VIC-II computes addresses
- Commodore 64 Programmer's Reference Guide: Programming Graphics - Overview
- C64-Wiki: 53265

## Labels
- VICII_CONTROL_REGISTER_2
- CIA2_DATA_PORT_A
