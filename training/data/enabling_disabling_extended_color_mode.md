# VIC-II Extended Color Mode (bit 6 of $D011 / 53265)

**Summary:** Toggle VIC-II Extended Background Color Mode by setting/clearing bit 6 of register $D011 (decimal 53265). Use POKE/PEEK with mask OR 64 to enable and AND 191 to disable.

## Description
Bit 6 of the VIC-II control register at $D011 (decimal 53265) selects the Extended Background (Extended Color) mode when set to 1; clearing it returns to the normal mode. Use PEEK to preserve the other bits in the register when changing just bit 6.

- Enable: set bit 6 (1 << 6 = 64).
- Disable: clear bit 6 (AND with 0b10111111 = 191).

Do not overwrite $D011 directly without preserving its other bits; the provided PEEK/POKE idiom preserves all other bits.

## Source Code
```basic
! Enable Extended Color Mode (set bit 6)
POKE 53265,PEEK(53265)OR 64

! Disable Extended Color Mode (clear bit 6)
POKE 53265,PEEK(53265)AND 191
```

(Decimal masks: 64 = 0b01000000, 191 = 0b10111111)

## Key Registers
- $D011 - VIC-II - Control register (bit 6 = Extended Background / Extended Color Mode)

## References
- "extended_background_color_mode_description_and_limits" — expands on registers and code ranges used in extended color mode