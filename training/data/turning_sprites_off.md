# Disable a sprite by clearing its bit in VIC-II register $D015 (53269)

**Summary:** Disable a VIC-II sprite by clearing its bit in register $D015 (decimal 53269) using BASIC POKE/PEEK and an AND mask; sprite number SN is 0..7. Also note: turning a sprite on sets its bit (OR 2^SN).

## Turning sprites off
Bits 0–7 of VIC-II control register $D015 (decimal 53269) are the sprite-enable bits for sprites 0–7. A bit = 1 enables the corresponding sprite; a bit = 0 disables it. To disable a single sprite without affecting the other bits, clear that sprite's bit while preserving the rest of the register value by ANDing with a mask that has that bit zeroed: (255 - 2^SN). SN is the sprite number 0..7.

(Short: to enable, set the bit with OR 2^SN.)

## Source Code
```basic
POKE 53269,PEEK(53269)AND(255-2^SN)   ' Disable sprite SN (SN = 0..7)
POKE 53269,PEEK(53269)OR(2^SN)        ' Enable sprite SN (turn-on variant)
```

Example:
```basic
POKE 53269,PEEK(53269)AND(255-2^3)    ' Disable sprite 3
```

## Key Registers
- $D015 - VIC-II - Sprite enable bits (bit0..bit7 correspond to sprites 0..7; 1 = on, 0 = off) (decimal 53269)

## References
- "turning_sprites_on_register" — expands on turning sprites on using OR (2^SN)

## Labels
- D015
