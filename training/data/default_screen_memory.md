# Default Screen Memory ($0400-$07FF)

**Summary:** Default screen memory area $0400-$07FF: screen RAM ($0400-$07E7, 1000 bytes), unused region ($07E8-$07F7, 16 bytes), and default sprite pointers ($07F8-$07FF, 8 bytes).

## Description
This chunk documents the C64's default VIC-related screen memory area in main RAM:

- $0400-$07E7 — Screen RAM (1000 bytes): contains the character codes displayed by the VIC-II (screen display memory).
- $07E8-$07F7 — Unused (16 bytes): reserved/unused region in the default screen block.
- $07F8-$07FF — Sprite Pointers (8 bytes): default sprite data pointers (one byte per sprite).

The block is the conventional default placement for the character screen and the built-in default sprite pointer table; programs may relocate VIC memory or sprite data by changing VIC bank/base registers and sprite pointer values.

## Source Code
```text
Default Screen Memory ($0400-$07FF)

$0400-$07E7  Screen RAM         Screen display memory (1000 bytes)
$07E8-$07F7  Unused             (16 bytes)
$07F8-$07FF  Sprite Pointers    Default sprite data pointers (8 bytes)
```

## Key Registers
- $0400-$07E7 - RAM - Screen RAM (screen display memory, 1000 bytes)
- $07E8-$07F7 - RAM - Unused region (16 bytes)
- $07F8-$07FF - RAM - Default sprite pointers (8 bytes)

## References
- "color_ram" — color RAM mapping at $D800-$DBFF
- "vic_sprite_registers" — VIC-II sprite coordinate registers at $D000-$D00F