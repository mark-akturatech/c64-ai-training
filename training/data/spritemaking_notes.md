# Sprite memory, pointers, control and colors (C64)

**Summary:** This document provides detailed information on sprite memory allocation, pointer settings, control registers, and color configurations for the Commodore 64's VIC-II chip. It includes explanations of sprite pointer locations, alternative memory allocations, VIC-II control registers for sprite enablement and positioning, and sprite color registers. Additionally, it offers BASIC examples for manipulating sprite visibility, positioning, and color settings.

**Sprite Memory and Pointers**

Sprite graphics are stored in 64-byte blocks, with each sprite utilizing 63 bytes for pixel data; the remaining byte is unused but must be allocated. The sprite pointer is a single byte that selects the 64-byte block (pointer × 64 = start address). In BASIC, sprite pointers are set by POKEing the eight pointer bytes in RAM:

- Pointer bytes (decimal) 2040–2047 correspond to sprite pointers for sprites 0–7 (hex $07F8–$07FF).
- Common choices for sprite data storage include:
  - Cassette buffer blocks 13–15 (pointer values 13–15 → addresses 832–1023) for a few sprites.
  - Higher RAM areas (e.g., pointer values ≈192–198 → addresses 12288–12798) to avoid BASIC program overwrites.
- Multiple sprites can share the same pointer byte to display identical shapes, differing only in position and color.

*Formula:*


**Turning Sprites On/Off (Sprite Enable Register)**

- The VIC-II sprite-enable register is located at $D015 (decimal 53269). Each bit corresponds to one sprite (bit 0 = sprite 0, bit 1 = sprite 1, … bit 7 = sprite 7).
- Writing a value to this register overwrites all sprite-enable bits; to change a single sprite without affecting others, use read-modify-write operations with PEEK and bitwise AND/OR.

**Examples (BASIC):**

- Turn off sprite 0 only:


  *(Change 1 to 2, 4, 8, 16, 32, 64, 128 for sprites 0–7 respectively.)*

- Re-enable sprite 0 without affecting others:


  *(Change OR 1 to OR 2, OR 4, etc., for other sprites.)*

**X Position Behavior (9-bit X)**

- The low X position byte (0–255) is POKEed to the sprite X position register.
- The VIC-II X MSB register at $D010 (decimal 53264) contains the most significant bit (9th bit) for each sprite's X position.
- To position a sprite beyond X=255 on the far right, set the appropriate bit in $D010, then POKE a new X low byte in the 0–63 range to reach the far-right columns. To return to the normal 0–255 range, clear the corresponding bit in $D010 and use X values 0–255.

**Y Position Ranges and Visibility**

- Sprite Y positions range from 0 to 255. The visible vertical area depends on the VIC display start, but typically:
  - Y positions 50–229 correspond to visible scanlines.
  - Y positions 0–49 are off the top of the screen.
  - Y positions 230–255 are off the bottom of the screen.

**Sprite Colors**

- Sprite color registers are located at $D027–$D02E (decimal 53287–53294). Each register sets the primary color for the corresponding sprite.
- Color codes (0–15):


- To set sprite 0's color to white:


  *(Adjust the register address for other sprites.)*

**Memory Allocation Recommendations and BASIC Interaction**

- Reserve a separate 64-byte block per sprite to avoid overlap; only 63 bytes are used for sprite pixel data, but pointers select 64-byte boundaries.
- Recommended pointer placements:
  - For 1–3 sprites, use cassette buffer blocks 13–15 (addresses 832–1023).
  - For more sprites or longer BASIC programs, place sprite data higher in RAM (e.g., pointer value 192 → address 12288–12350 for sprite 0; pointer 193 → 12352–12414 for sprite 1, etc.).
- Placing pointers too low in memory risks BASIC program overwrites; set pointers to unused high RAM areas when necessary.
- To make multiple sprites share the same shape, point multiple sprite pointer bytes to the same block.

## Source Code

```
pointer_byte × 64 = sprite data start address
```

  ```
  POKE 53269, PEEK(53269) AND 254
  ```

  ```
  POKE 53269, PEEK(53269) OR 1
  ```

  ```
  0 = BLACK
  1 = WHITE
  2 = RED
  3 = CYAN
  4 = PURPLE
  5 = GREEN
  6 = BLUE
  7 = YELLOW
  8 = ORANGE
  9 = BROWN
  10 = LIGHT RED
  11 = DARK GREY
  12 = MEDIUM GREY
  13 = LIGHT GREEN
  14 = LIGHT BLUE
  15 = LIGHT GREY
  ```

  ```
  POKE 53287, 1
  ```


```text
Table: Alternative Sprite Memory Pointers and Memory Locations

Put in Memory (Set pointers)    SPRT 0    SPRT 1    SPRT 2
If you're using 1 to 3 sprites, you can use these memory locations in the cassette buffer (832 to 1023), but for more than 3 sprites, we suggest using locations from 12288 to 12798.

Example table entries:
  POKE 2040,13  -> Sprite 0 pointer = 13  -> sprite pixel locations 832 to 894
  POKE 2041,14  -> Sprite 1 pointer = 14  -> sprite pixel locations 896 to 958
  POKE 2042,15  -> Sprite 2 pointer = 15  -> sprite pixel locations 960 to 1022

Higher memory example:
  POKE 2040,192 -> Sprite 0 pointer = 192 -> sprite pixel locations 12288 to 12350
  POKE 2041,193 -> Sprite 1 pointer = 193 -> sprite pixel locations 12352 to 12414
```

```basic
Example BASIC snippets:

' Turn off just sprite 0:
POKE 53269, PEEK(53269) AND 254

' Re-enable sprite 0 without affecting other sprites:
POKE 53269, PEEK(53269) OR 1

' Example pointer POKEs:
POKE 2040,13
POKE 2041,14
POKE 2042,15

' Example color POKE (make sprite 0 white):
POKE 53287,1
```

```text
Color codes:
0-BLACK     4-PURPLE        8-ORANGE        12-MED. GREY
1-WHITE     5-GREEN         9-BROWN         13-LT. GREEN
2-RED       6-BLUE          10-LT. RED      14-LT. BLUE
3-CYAN      7-YELLOW        11-DARK GREY    15-LT. GREY
```

## Key Registers

- $07F8–$07FF (decimal 2040–2047) – RAM – Sprite pointer table (pointer byte × 64 = sprite data start)
- $D010 (decimal 53264) – VIC-II – Sprite X MSB (high/9th X bit per sprite; used for positions beyond 255)
- $D015 (decimal 53269) – VIC-II – Sprite enable bits (individual sprite on/off bits 0–7)
- $D027–$D02E (decimal 53287–53294) – VIC-II – Sprite color registers 0–7

## References

- Commodore 64 Programmer's Reference Guide: Programming Graphics – Sprites
- Retro Game Coders: How C64 Sprites Work
- C64-Wiki: Sprite
- Retrocomputing Stack Exchange: When does the VIC-II read the sprite data?

## Labels
- BLACK
- WHITE
- RED
- CYAN
- PURPLE
- GREEN
- BLUE
- YELLOW
- ORANGE
- BROWN
- LIGHT_RED
- DARK_GREY
- MEDIUM_GREY
- LIGHT_GREEN
- LIGHT_BLUE
- LIGHT_GREY
