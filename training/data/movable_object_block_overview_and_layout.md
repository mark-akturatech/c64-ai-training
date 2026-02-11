# Movable Object Block (MOB)

**Summary:** MOB (Movable Object Block) — up to 8 unique MOBs, each defined by 63 bytes and displayed as a 24×21 dot array (504 bits). Bytes are indexed 00–62 (three bytes per row), enabling per-pixel movable objects for smooth onscreen movement and game graphics.

## Description
The MOVABLE OBJECT BLOCK (MOB) is a special display object that bypasses the tile/character constraints of character and bitmap modes. Key facts:

- Count: up to 8 unique MOBs simultaneously.
- Memory per MOB: 63 bytes (63 × 8 = 504 bits).
- Display resolution per MOB: 24 (pixels) × 21 (rows) = 504 pixels.
- Byte layout: the 63 bytes are arranged as 21 rows × 3 bytes (3 bytes × 8 bits = 24 horizontal pixels). Byte indices progress row-wise: bytes 00–02 are the top row, 03–05 the next, ... , 60–62 the bottom row.
- Purpose: MOBs provide independently positionable, per-pixel graphics (sprite-like) suitable for smooth movement and gaming graphics because they are not constrained to character-cell boundaries.

The source references additional chunks for enabling/positioning MOBs and for MOB memory pointers.

## Source Code
```text
                              MOB DISPLAY BLOCK
                        +--------+--------+--------+
                        |  BYTE  |  BYTE  |  BYTE  |
                        +--------+--------+--------+
                        |   00   |   01   |   02   |
                        |   03   |   04   |   05   |
                        |    .   |    .   |    .   |
                        |    .   |    .   |    .   |
                        |    .   |    .   |    .   |
                        |   57   |   58   |   59   |
                        |   60   |   61   |   62   |
                        +--------+--------+--------+
```

## References
- "mob_enable_and_positioning" — how to enable MOBs and set their X/Y position
- "mob_memory_access_and_pointers" — where the 63 bytes per MOB are stored and how MOB pointers locate them
