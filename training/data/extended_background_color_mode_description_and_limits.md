# Extended Background Color Mode (C64)

**Summary:** Extended background color mode (VIC-II) provides four background color registers ($D021-$D024) selectable by the top two bits (bits 6–7) of the character code; color RAM still holds the foreground color. Only the first 64 character codes (0–63) provide unique character bitmaps because two character-code bits select the background register.

## Description
Extended background color mode lets each character cell select one of four background colors independently from the foreground (color RAM). There are four background registers, each programmable to any of the 16 C64 colors. Color RAM continues to contain the foreground (ink) color exactly as in standard character mode.

Because two high bits of the 8-bit character code are repurposed to select which of the four background registers to use, only character codes 0–63 (the first 64 entries of the character set) can be used to display distinct glyph shapes. Character codes that differ only in bits 6–7 will display the same glyph but with a different background register/color.

Bits used:
- Character code bit7 and bit6 select the background register (00..11 = register 0..3).
- Bits 0–5 select the character glyph index (0..63).

Example behavior (short demonstration):
- POKE a 1 to screen shows glyph for code 1.
- POKE a 65 (1 with bit6 set) will show the same glyph as code 1 but using the background color assigned to register 1.

## Source Code
```text
+------------------------+---------------------------+
|     CHARACTER CODE     | BACKGROUND COLOR REGISTER |
+------------------------+---------------------------+
|  RANGE   BIT 7   BIT 6 |  NUMBER       ADDRESS     |
+------------------------+---------------------------+
|   0- 63   0       0    |    0       53281 ($D021)  |
|  64-127   0       1    |    1       53282 ($D022)  |
| 128-191   1       0    |    2       53283 ($D023)  |
| 192-255   1       1    |    3       53284 ($D024)  |
+------------------------+---------------------------+

Notes from original text:
- There are 4 registers for extended background color mode; each can be set to any of 16 colors.
- Color memory (color RAM) is used to hold the foreground color as in standard character mode.
- Only the first 64 characters of the character ROM or a user-defined character set can be used for distinct glyphs because two bits of the character code select the background register.
- Example: Character code for "A" is 1. In extended color mode POKE 1 shows "A"; POKE 65 shows the same "A" (not reversed) but on a different background color (register 1).
```

## Key Registers
- $D021-$D024 - VIC-II - Extended background color registers (background register 0..3). Addresses decimal: 53281 ($D021), 53282 ($D022), 53283 ($D023), 53284 ($D024).

## References
- "enabling_disabling_extended_color_mode" — how to toggle extended background color mode and related control bits

## Labels
- $D021
- $D022
- $D023
- $D024
