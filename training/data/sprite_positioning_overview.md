# Sprite positioning (VIC-II)

**Summary:** VIC-II sprite positioning utilizes per-sprite X and Y position registers, along with an X Most Significant Bit (MSB) register ($D010), to provide a 9-bit horizontal coordinate system accommodating the 320-pixel screen width. Position values specify the upper-left corner of the sprite; sprites may be placed on or off the visible screen.

**Positioning**

Each hardware sprite has independent X and Y position registers. Given the visible screen width of 320 pixels, a 9-bit value is required for the X coordinate. The lower 8 bits are stored in the per-sprite X register, while the MSB is stored in the X MSB register ($D010). The specified position corresponds to the upper-left corner of the sprite bitmap. Sprites can be positioned anywhere on the visible screen or off-screen in any direction.

- **X coordinate:** 9-bit value (low 8 bits in the per-sprite X register, MSB in the X MSB register).
- **Y coordinate:** Stored in the per-sprite Y register (8-bit value).
- **Sprite anchor point:** Upper-left corner.
- **Off-screen placement:** Allowed in both horizontal and vertical directions.

## Source Code

```text
Table 7-5: Sprite Position Registers

| Sprite # | X Position Register | Y Position Register |
|----------|---------------------|---------------------|
| 0        | $D000               | $D001               |
| 1        | $D002               | $D003               |
| 2        | $D004               | $D005               |
| 3        | $D006               | $D007               |
| 4        | $D008               | $D009               |
| 5        | $D00A               | $D00B               |
| 6        | $D00C               | $D00D               |
| 7        | $D00E               | $D00F               |

X MSB Register ($D010) Bit Mapping:

| Bit # | Description                  |
|-------|------------------------------|
| 0     | MSB of Sprite 0 X position   |
| 1     | MSB of Sprite 1 X position   |
| 2     | MSB of Sprite 2 X position   |
| 3     | MSB of Sprite 3 X position   |
| 4     | MSB of Sprite 4 X position   |
| 5     | MSB of Sprite 5 X position   |
| 6     | MSB of Sprite 6 X position   |
| 7     | MSB of Sprite 7 X position   |
```

## Key Registers

- **$D000-$D00F:** VIC-II Sprite X and Y position registers for sprites 0 through 7.
- **$D010:** VIC-II Sprite X MSB register (holds the MSB for each sprite's X position).

## References

- Commodore 64 Programmer's Reference Guide: Programming Graphics - Sprites
- C64-Wiki: Sprite