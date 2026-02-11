# C64 Standard Text Mode and VIDBAS ($D018)

**Summary:** Describes the Commodore 64 power-up text mode (40×25 = 1000 characters), default screen RAM at $0400, and how the VIC-II VIDBAS register ($D018) selects the text memory base (upper 4 bits, on $0400 boundaries) and the character-generator / graphics memory area (lower 4 bits).

## Standard text mode
On power-up the C64 uses the standard text mode: 40 columns × 25 rows = 1000 character positions. The bytes that define which character is shown in each screen cell are stored in 1000 bytes of RAM beginning at $0400 by default.

The VIC-II uses the VIDBAS register ($D018) to locate both the text (screen) memory and the character-generator/graphics memory:
- Upper 4 bits of $D018 select the text (screen) memory base. The VIC will find the screen bytes only on $0400-aligned boundaries.
- Each byte in the chosen text memory is an index (0–255) into the character-generator area; therefore each screen position can reference one of 256 patterns.
- At power-up the character patterns referenced by the text bytes reside in the built-in character generator ROM.
- The lower 4 bits of $D018 select the character-generator / graphics memory area (referred to as graphics memory). This area can be changed to RAM (or other VIC-visible memory) so that the patterns referenced by screen bytes need not come from the ROM but from any VIC-accessible graphics memory.

## Key Registers
- $D000-$D02E - VIC-II - VIC-II video register range (includes $D018)
- $D018 - VIC-II - VIDBAS: upper 4 bits = text/screen memory base (on $0400 boundaries); lower 4 bits = character-generator / graphics memory base
- $0400 - RAM - Default start address of screen text memory (1000 bytes for 40×25)

## References
- "character_generator_rom_memory_maps_and_banking" — full details on the built-in character generator ROM, memory maps (Fig. 7-4/7-5), and how the VIC/CPU see the generator
- "txbas_grabas_and_address_calculation" — how to change text/graphics bases (TXBAS/GRABAS) and compute absolute addresses with the selected bank

## Labels
- VIDBAS
