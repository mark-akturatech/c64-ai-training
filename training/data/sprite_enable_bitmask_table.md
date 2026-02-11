# Enabling VIC-II sprites (V+21 / $D015)

**Summary:** Use a bitmask POKE to the VIC-II sprite-enable register ($D015 / V+21) to turn individual sprites on or off; values 1,2,4,8,16,32,64,128 map to sprites 0–7 and may be ORed together (0 = all off, 255 = all on).

## Description
LINE 50 in the example sets the VIC-II sprite-enable register (POKE V+21, n) to enable sprites. Each sprite corresponds to one bit in the 8-bit register:

- Bit values: 1, 2, 4, 8, 16, 32, 64, 128 correspond to sprites 0..7 respectively.
- Any combination of sprites is enabled by summing (ORing) their bit values. Example: 129 = 128 + 1 enables sprites 7 and 0.
- 0 disables all sprites; 255 enables all sprites.
- Typical sequence: set sprite pointers and data first (see sprite pointer setup), then enable sprite bits with POKE V+21.
- (V = $D000, VIC-II register base)

## Source Code
```text
+------+------+------+------+------+------+------+------+------+-------+
|ALL ON|SPRT 0|SPRT 1|SPRT 2|SPRT 3|SPRT 4|SPRT 5|SPRT 6|SPRT 7|ALL OFF|
|  255 |   1  |   2  |   4  |   8  |  16  |  32  |  64  |  128 |   0   |
+------+------+------+------+------+------+------+------+------+-------+
```

```basic
POKE V+21,1     : REM turn on sprite 0
POKE V+21,128   : REM turn on sprite 7
POKE V+21,129   : REM turn on sprites 0 and 7 (128 + 1)
POKE V+21,0     : REM turn all sprites off
POKE V+21,255   : REM turn all sprites on
```

## Key Registers
- $D015 - VIC-II - Sprite enable bitmask (bits 0..7 enable sprites 0..7)
- $D027-$D02E - VIC-II - Sprite color registers (sprite 0..7) (see sprite color setup)

## References
- "sprite_program_overview_and_pointer_setup" — expands on setting the sprite pointers before enabling sprites
- "sprite_colors_and_direct_mode_editing" — expands on setting sprite colors after enabling sprites (V+39..V+46)