# VIC-II Sprite Position Registers: SPR2X/SPR2Y/SPR3X/SPR3Y

**Summary:** VIC-II sprite position registers for sprite 2 and sprite 3: SPR2X $D005, SPR2Y $D006, SPR3X $D007, SPR3Y $D008 (sprite horizontal/vertical position registers, low 8 bits).

## Description
These four VIC-II registers store the horizontal (X) and vertical (Y) position bytes for sprites 2 and 3. SPR2X/SPR2Y correspond to sprite 2; SPR3X/SPR3Y correspond to sprite 3. The X registers contain the low 8 bits of the horizontal coordinate (the high X bit is stored separately in the XMSB register). Values are written/read as single-byte positions used by the VIC-II for sprite rendering.

## Source Code
```text
SPR2X    SPRITE 2 HORIZONTAL    $D005
SPR2Y    SPRITE 2 VERTICAL      $D006
SPR3X    SPRITE 3 HORIZONTAL    $D007
SPR3Y    SPRITE 3 VERTICAL      $D008
```

## Key Registers
- $D005-$D008 - VIC-II - Sprite 2 & 3 X/Y position registers (low 8 bits)

## References
- "sprite_position_registers_0_1" — expands on position registers for sprites 0 and 1 and the table header
- "sprite_position_registers_4_5" — expands on position registers for sprites 4 and 5
- "sprite_position_registers_6_7_and_xmsb" — expands on position registers for sprites 6 and 7 and the XMSB register

## Labels
- SPR2X
- SPR2Y
- SPR3X
- SPR3Y
