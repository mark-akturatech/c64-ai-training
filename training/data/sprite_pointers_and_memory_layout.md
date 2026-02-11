# Sprite pointer format and memory

**Summary:** Sprite definitions are 64 bytes and must start on $0040 boundaries; a 16K VIC bank holds 256 definitions so the sprite pointer is one byte which, when multiplied by 64, yields the sprite definition start address. Sprite definitions must reside in the currently selected VIC memory bank and not in areas where the VIC sees the character-generator ROM.

## Sprite Pointers
Each sprite pattern (definition) occupies exactly 64 bytes, therefore every sprite definition starts on a $0040 boundary in memory. The VIC chip is given a single-byte sprite pointer for each sprite; that byte is an index into the 64-byte slots of the currently selected 16K VIC bank. Multiply the pointer value by 64 to get the starting address of the sprite definition in that bank (e.g., pointer $20 -> $20 * 64 = $0800).

The sprite definition must be placed within the VIC’s currently selected graphics memory bank for the sprite to be displayed. If the definition lies outside the visible bank (or in an area where the VIC maps the character-generator ROM), the sprite will not be fetched/displayed correctly.

## References
- "vidbas_graphics_base_table" — expands on how current bank / graphics base affects where sprites can live
