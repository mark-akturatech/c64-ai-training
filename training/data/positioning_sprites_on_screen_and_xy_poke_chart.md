# Sprite X-Y Positioning and X MSB (VIC-II)

**Summary:** How to position VIC-II hardware sprites by writing the X and Y registers ($D000..$D00F) and how to use the sprite X-MSB register ($D010) to reach horizontal positions >255; includes the V+offset formula (V+$N*2) and MSB bit masks (1,2,4,8,16,32,64,128).

**Positioning sprites on the screen**
The VIC-II sprite system uses X (horizontal) and Y (vertical) coordinates that position the upper-left corner of each 24×21 pixel sprite. Each sprite has a dedicated X and Y register pair; the X register stores the low 8 bits (0..255) of the horizontal position, and the dedicated MSB register supplies the ninth bit for positions >= 256.

Register addressing follows the pattern described in the source using a base V (VIC-II base $D000). For sprite N (0..7):
- X register = V + (N * 2)
- Y register = V + (N * 2) + 1

The X low byte covers 0..255. To place a sprite beyond X=255 (i.e., X >= 256), set the corresponding bit in the VIC-II X-MSB register (V+16 / $D010). Each bit in $D010 corresponds to a sprite (bit 0 → sprite 0, bit 1 → sprite 1, etc.). The MSB bit values are 1, 2, 4, 8, 16, 32, 64, 128 for sprites 0..7 respectively.

Note: The displayed sprite origin is the sprite’s top-left pixel; the sprite graphic occupies a 24×21-pixel rectangle anchored at the (X,Y) you write.

## Source Code
```text
Sprite register mapping (VIC-II base $D000)

General formulas:
  X register (low byte) = $D000 + (N * 2)
  Y register             = $D000 + (N * 2) + 1
  X MSB register         = $D010  ; bits 0..7 = sprites 0..7

Sprite -> addresses:
  Sprite 0: X = $D000, Y = $D001
  Sprite 1: X = $D002, Y = $D003
  Sprite 2: X = $D004, Y = $D005
  Sprite 3: X = $D006, Y = $D007
  Sprite 4: X = $D008, Y = $D009
  Sprite 5: X = $D00A, Y = $D00B
  Sprite 6: X = $D00C, Y = $D00D
  Sprite 7: X = $D00E, Y = $D00F

X MSB register:
  $D010 - bit assignments:
    bit 0 = sprite 0 (mask 1)
    bit 1 = sprite 1 (mask 2)
    bit 2 = sprite 2 (mask 4)
    bit 3 = sprite 3 (mask 8)
    bit 4 = sprite 4 (mask 16)
    bit 5 = sprite 5 (mask 32)
    bit 6 = sprite 6 (mask 64)
    bit 7 = sprite 7 (mask 128)

Sprite size:
  24 pixels across × 21 pixels down (upper-left corner anchored at X,Y).
```

## Key Registers
- $D000-$D00F - VIC-II - Sprite 0–7 X (even offsets) and Y (odd offsets) position registers
- $D010 - VIC-II - Sprite X MSB register (bit 0 = sprite0 ... bit 7 = sprite7; masks 1,2,4,8,16,32,64,128)

## References
- "sprite_position_registers_and_addresses" — expands on register addresses $D000..$D010
- "sprite_horizontal_positioning_and_X_MSB_explanation" — expands on handling positions beyond 255 with MSB register