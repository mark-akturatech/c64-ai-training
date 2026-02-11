# User-defined characters: selecting VIC-II character memory and video bank

**Summary:** To use user-defined characters on the C64 you must select the 16K VIC-II video bank via CIA#2 Port A bits (CIA2 at $DD00) and set the 2K character memory pointer in the VIC-II register $D018 (decimal 53272); place your character shape data into the addressed 2K area (optionally copying ROM character data into RAM first).

## How it works
1. Select which 16K bank the VIC-II will use for video memory — this is controlled by CIA #2 Port A bits 0-1 (CIA2 base $DD00). The choice of bank determines which area of the CPU address space the VIC-II fetches character ROM/RAM and screen memory from.
2. Set the VIC-II 2K character memory pointer in register $D018 (decimal 53272). $D018 points at the 2K-aligned base within the chosen 16K bank where character (shape) data is located.
3. Supply the 2K of character shape data at that location in memory. You can create entirely new shapes or copy selected character glyphs from the ROM character generator into RAM and use those as a basis (see location 1 entry for a ROM-reading method).

Notes:
- The CIA2 Port A bank selection and VIC-II pointer together determine where the VIC-II fetches character data; both must be set correctly for user-defined characters to appear.
- Copying ROM character data requires reading from the ROM (see referenced ROM-reading method) and writing the 2K shape table into the chosen bank and offset.

## Key Registers
- $D000-$D02E - VIC-II - $D018 (53272) 2K character memory pointer (selects the 2K character shape base within the currently selected 16K video bank)
- $DD00-$DD0F - CIA 2 - Port A (bits 0-1) select the 16K video bank used by the VIC-II (affects where character/screen memory is fetched)

## References
- "cia2_porta_bits_video_bank_selection" — expands on selecting the 16K bank that will contain your character set
- "character_generator_rom_overview_and_bit_values" — expands on using ROM characters as a basis for user-defined sets

## Labels
- D018
- DD00
