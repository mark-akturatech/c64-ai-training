# VIC-II Sprite Position Registers ($D000-$D00F)

**Summary:** VIC-II sprite position registers $D000-$D00F hold the low 8 bits of sprite horizontal and vertical positions for sprites 0–7 (SP0X/SP0Y ... SP7X/SP7Y). Each pair of registers maps to a sprite's X (horizontal) and Y (vertical) low byte.

## Overview
These VIC-II registers provide the low-order byte (bits 0–7) of the on-screen position for each hardware sprite:

- Even addresses ($D000, $D002, ... $D00E) are the sprite Horizontal Position low byte (SPnX).
- Odd addresses ($D001, $D003, ... $D00F) are the sprite Vertical Position low byte (SPnY).
- They supply the least-significant 8 bits of the position; high-order bits/expansion (if used) are handled elsewhere (see additional references).

Use these registers to position sprites by writing the desired low 8 bits of the coordinate to the appropriate SPnX or SPnY register for sprite n (0–7).

## Source Code
```text
$D000        SP0X         Sprite 0 Horizontal Position
$D001        SP0Y         Sprite 0 Vertical Position

$D002        SP1X         Sprite 1 Horizontal Position
$D003        SP1Y         Sprite 1 Vertical Position

$D004        SP2X         Sprite 2 Horizontal Position
$D005        SP2Y         Sprite 2 Vertical Position

$D006        SP3X         Sprite 3 Horizontal Position
$D007        SP3Y         Sprite 3 Vertical Position

$D008        SP4X         Sprite 4 Horizontal Position
$D009        SP4Y         Sprite 4 Vertical Position

$D00A        SP5X         Sprite 5 Horizontal Position
$D00B        SP5Y         Sprite 5 Vertical Position

$D00C        SP6X         Sprite 6 Horizontal Position
$D00D        SP6Y         Sprite 6 Vertical Position

$D00E        SP7X         Sprite 7 Horizontal Position
$D00F        SP7Y         Sprite 7 Vertical Position
```

## Key Registers
- $D000-$D00F - VIC-II - Sprite 0-7 X/Y positions (low 8 bits)

## References
- "sprite_horizontal_and_vertical_position_registers_description" — overview of ranges and use

## Labels
- SP0X
- SP0Y
- SP1X
- SP1Y
- SP2X
- SP2Y
- SP3X
- SP3Y
- SP4X
- SP4Y
- SP5X
- SP5Y
- SP6X
- SP6Y
- SP7X
- SP7Y
