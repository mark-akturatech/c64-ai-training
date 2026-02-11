# Sprite fundamentals — pointers, layout, and banks

**Summary:** Covers the C‑64’s 8 hardware sprites, the sprite pointer bytes at $07F8..$07FF (pointer * $40 => sprite data address), sprite data size (63 bytes) and 64‑byte alignment, and the four VIC banks ($0000-$3FFF, $4000-$7FFF, $8000-$BFFF, $C000-$FFFF).

## Sprite Basics
The C‑64 provides 8 hardware sprites that can be moved independently without altering the background. The basic operations required to use a sprite are:
- point the sprite to a chunk of graphics data (its shape),
- set X/Y screen coordinates,
- set sprite colour,
- enable the sprite for display.

Sprite graphics are stored in memory blocks and referenced by one‑byte sprite pointers. Sprite enable/position/colour registers (VIC‑II) are separate from the pointer bytes and are covered in related reference material.

## Sprite Pointers
- Screen memory is 1000 bytes (40 × 25) when located at the default $0400, occupying $0400..$07E7.
- The next 24 bytes ($07E8..$07FF) are free; the final 8 bytes in that area, $07F8..$07FF, are the default sprite pointer bytes (first sprite = $07F8).
- Each sprite’s pointer is a single byte. That byte is an index into the current VIC bank and selects a 64‑byte aligned block:
  - sprite_address = VIC_bank_base + (pointer_byte * $40)
- A single sprite’s bitmap data is 63 bytes (24×21 bits = 504 bits = 63 bytes). Sprite data must be aligned to 64‑byte boundaries (start at $0000, $0040, $0080, $00C0, $0100, ...).
- Because pointer is one byte (0–255), you can address 256 different 64‑byte slots per VIC bank (256 * 64 = 16KB), which fills one VIC bank.
- VIC bank base addresses (where sprite pointers resolve within) are:
  - $0000-$3FFF, $4000-$7FFF, $8000-$BFFF, $C000-$FFFF (choose the bank that contains the screen memory).
- Example mappings:
  - pointer $00 → sprite data at VIC_bank_base + $0000
  - pointer $01 → VIC_bank_base + $0040
  - pointer $80 → VIC_bank_base + $2000
  - pointer $C0 → VIC_bank_base + $3000
- Example use: to animate 8 frames stored consecutively at $2000..$21FF (same VIC bank), set $07F8 = $80, then $81, $82 ... $87 and repeat.

## Key Registers
- $0400-$07E7 - Memory - Screen memory (default 1000 bytes, 40×25 characters)
- $07F8-$07FF - Memory - Sprite pointer bytes (sprite 0..7): pointer selects 64‑byte aligned sprite data block in current VIC bank (address = VIC_bank_base + pointer*$40)
- $0000-$3FFF - Memory range - VIC bank 0 (one possible VIC bank base)
- $4000-$7FFF - Memory range - VIC bank 1
- $8000-$BFFF - Memory range - VIC bank 2
- $C000-$FFFF - Memory range - VIC bank 3

## References
- "sprites_important_addresses" — VIC registers for enabling sprites and per‑sprite coordinates/colours
- "sprite_multiplexer" — techniques for reusing hardware sprites by changing Y and pointer mid‑frame
