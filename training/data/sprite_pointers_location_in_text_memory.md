# Sprite pointers location (VIC reads last 8 bytes of 1K text memory)

**Summary:** VIC-II reads the eight sprite pointers from the last eight bytes of the 1K text memory area at an offset of $03F8 from the text base address; e.g. default text base $0400 → first pointer at $07F8. Searchable terms: $03F8, VIC-II, sprite pointers, text memory, $0400, $07F8.

## Description
- The VIC-II obtains the eight sprite pointer bytes from the final eight bytes of the 1K block used for screen character memory. The pointer block is located at text_base + $03F8.
- Because only 1000 (decimal) of the 1024 (1K) text bytes are used for visible characters, the last 24 bytes of that 1K are unused for character display; the VIC uses eight of those bytes for sprite pointers so they do not interfere with on-screen characters.
- The eight sprite pointer bytes are contiguous: the first pointer is at text_base + $03F8, the second at text_base + $03F9, and so on up to text_base + $03FF.
- Example: with the common/default text base $0400 (text memory $0400–$07FF), the sprite pointer byte addresses are $07F8–$07FF; the first sprite pointer is at $07F8.
- General formula: sprite_pointer_n_address = text_base + $03F8 + n (where n = 0..7).

## References
- "standard_bitmapped_mode_and_color_storage" — expands on relationship between text memory and sprite pointers
