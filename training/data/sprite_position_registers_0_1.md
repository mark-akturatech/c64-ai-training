# Sprite Position Registers (Table 7-5)

**Summary:** Position registers for VIC-II sprites SPR0 and SPR1: SPR0X $D000, SPR0Y $D001, SPR1X $D002, SPR1Y $D003 (searchable: $D000, $D001, $D002, $D003, VIC-II, SPR0X, SPR0Y, SPR1X, SPR1Y). Note: X uses a separate MSB register (see cross-references).

**Position registers**
This chunk reproduces Table 7-5 entries for the sprite position registers. Each listed register is one byte:
- X registers store the low 8 bits of the sprite's horizontal (screen) position (an additional MSB bit is provided by a separate X-MSB register — see referenced chunks).
- Y registers store the sprite's vertical (screen) position as an 8-bit value.

The four registers shown here correspond to sprite 0 and sprite 1 horizontal and vertical position low bytes.

## Source Code
```text
Table 7-5. The Position Registers for the Sprites.

Address   Name    Description
$D000    SPR0X   SPRITE 0 HORIZONTAL (low 8 bits)
$D001    SPR0Y   SPRITE 0 VERTICAL
$D002    SPR1X   SPRITE 1 HORIZONTAL (low 8 bits)
$D003    SPR1Y   SPRITE 1 VERTICAL
```

## Key Registers
- $D000-$D00F - VIC-II - Sprite 0-7 X/Y position registers (SPR0X/SPR0Y ... SPR7X/SPR7Y)

## References
- "sprite_position_registers_2_3" — expands on position registers for sprites 2 and 3
- "sprite_position_registers_4_5" — expands on position registers for sprites 4 and 5
- "sprite_position_registers_6_7_and_xmsb" — expands on position registers for sprites 6 and 7 and the X-MSB register

## Labels
- SPR0X
- SPR0Y
- SPR1X
- SPR1Y
