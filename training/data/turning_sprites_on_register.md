# Sprite Enable (VIC-II $D015)

**Summary:** VIC-II SPRITE ENABLE register at $D015 (53269) controls sprite visibility; each bit 0–7 enables sprite 0–7. Use POKE/PEEK OR to set a sprite bit (example: POKE 53269,PEEK(53269) OR (2^SN)).

## Turning sprites on
The VIC-II control register at $D015 (decimal 53269) is the SPRITE ENABLE register. Each bit in this register corresponds to one hardware sprite; setting the bit to 1 enables that sprite for display. Bits map to sprite numbers: bit 0 = sprite 0, bit 1 = sprite 1, …, bit 7 = sprite 7.

To enable a specific sprite without disturbing other bits, OR the corresponding bit into $D015. The sprite number SN must be 0–7. Note: a sprite must be enabled in this register before it can be visible (enabling here does not position or supply data for the sprite — position and bitmap registers are separate).

## Source Code
```basic
10 REM Enable sprite 1 (sprite numbers 0-7)
20 POKE 53269, PEEK(53269) OR 2

30 REM General: enable sprite SN (0..7)
40 REM Replace SN with sprite number
50 POKE 53269, PEEK(53269) OR (2^SN)
```

```text
Register map (reference)
$D015  7 6 5 4 3 2 1 0
       S7 S6 S5 S4 S3 S2 S1 S0
S0 = Sprite 0 enable (bit0)
S1 = Sprite 1 enable (bit1)
...
S7 = Sprite 7 enable (bit7)
```

## Key Registers
- $D015 - VIC-II - Sprite enable bits 0-7 (bit0 = sprite0 ... bit7 = sprite7)

## References
- "turning_sprites_off" — how to clear bits in $D015 to disable sprites
- "sprite_position_registers_and_addresses" — position and bitmap registers used once sprites are enabled

## Labels
- $D015
