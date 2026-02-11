# BASIC: Sprite 0 bitmap (832..894) and V=$D000 (53248) usage

**Summary:** Explains that sprite 0 bitmap occupies 63 bytes at RAM locations 832–894 ($0340–$037E) and that setting V=53248 (V=$D000) lets BASIC use POKE V+offset to address VIC-II registers (e.g. POKE V+21 = POKE 53269 = POKE $D015).

## Explanation
LINE 30 (as described) places the first hardware sprite (sprite 0) into 63 consecutive bytes of RAM starting at decimal 832 and ending at 894 (hex $0340–$037E). Each sprite bitmap requires 63 bytes of storage (63 bytes = 24 rows × 3 bytes, standard VIC-II sprite layout).

LINE 40 sets the BASIC variable V to 53248 (hex $D000), the base address of the VIC-II video chip registers. Using expressions like POKE V+offset lets the program write to VIC-II registers with smaller numeric literals and less source text (for tokenized BASIC), e.g.:
- POKE V+21 is equivalent to POKE 53248+21 or POKE 53269, which is POKE $D015.

This technique conserves program text space and makes register offsets easier to remember and type because you work with the register offset (small number) rather than the full absolute address.

## Key Registers
- $0340-$037E - RAM - Sprite 0 bitmap (63 bytes, sprite 0 occupies decimal 832..894)
- $D000-$D02E - VIC-II - video chip registers (base $D000; use V=53248 to address with V+offset)

## References
- "sprite_program_overview_and_pointer_setup" — expands on sprite pointers referencing these memory locations  
- "sprite_bitmap_memory_blocks_and_manual_editing" — expands on how the 63 bytes (832..894) map to 8-pixel blocks and how to POKE them
