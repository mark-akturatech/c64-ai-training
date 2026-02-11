# Sprite pointers (last 8 bytes of screen RAM)

**Summary:** Sprite pointers (8 bytes located by default at 2040..2047 / $07F8..$07FF in screen RAM) are VIC-II-controlled bytes that index 64-byte sprite definition blocks (63 bytes data + 1 placeholder). Use LOCATION = (BANK * 16384) + (SPRITE_POINTER_VALUE * 64). Note: ROM image areas in VIC-II BANK 0 & 2 cannot host sprite definitions; use BANK 1 or 3 if you need >128 distinct sprites.

## Sprite pointer layout
- Each of the 8 hardware sprites has one byte called a sprite pointer. Those 8 bytes are stored as the last 8 bytes of the 1 KB screen-memory block; by default this is addresses 2040..2047 ($07F8..$07FF). If you relocate screen memory, the sprite-pointer addresses move with it.
- Each sprite definition occupies 63 bytes of visible data plus a single placeholder byte, making a 64-byte block per sprite. The 64-byte size simplifies address math (64 = 2^6).
- A sprite pointer holds a value 0..255. Because each pointer refers to a 64-byte block, the pointer covers a 16 KB address range (256 * 64 = 16,384 bytes), i.e. one VIC-II 16K bank.

## Calculating sprite definition start address
- Formula:
  LOCATION = (BANK * 16384) + (SPRITE_POINTER_VALUE * 64)
  - BANK is 0..3 (the VIC-II 16K memory bank currently selected).
  - SPRITE_POINTER_VALUE is 0..255 (value stored in the sprite-pointer byte).
- Example from source:
  - If sprite pointer #0 (at location 2040) contains 14, the sprite definition starts at 14 * 64 = 896 (decimal).

## Bank restrictions
- When the VIC-II is viewing BANK 0 or BANK 2, the character ROM image is present at specific locations within that 16K view; those ROM areas cannot host sprite definitions.
- If you need more than 128 different sprite definitions (i.e., you must avoid ROM-overlapped areas), use a bank without the ROM image (BANK 1 or BANK 3).

## Key Registers
- $07F8-$07FF - Screen RAM (last 8 bytes of the 1K screen memory block) — Sprite pointers for sprites 0–7 (values 0..255)

## References
- "defining_sprite_size_and_layout" — sprite definition size (63 bytes) and 64-byte alignment
