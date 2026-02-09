# VIC-II 4-bit Color Codes (D3..D0)

**Summary:** VIC-II 4-bit color codes (D3..D0) map to hex/decimal values and C64 color names used in color RAM and VIC-II fields that store color nybbles (nybble = 4-bit value). Includes note that no-connect bits are read as 1.

## Color code description
The VIC-II color palette uses a 4-bit code (bits D3..D0, D3 = MSB, D0 = LSB) to select one of 16 colors. Each 4-bit pattern corresponds to a hexadecimal and decimal value and a human-readable color name. Per the original note, any hardware "no connect" lines are read as a logical 1 and should be treated as such when determining the 4-bit value.

**[Note: Source may contain an error — the original table lists the hex value for decimal 13 as '0'; the correct hex for decimal 13 is 'D'.]**

## Source Code
```text
NOTE: A dash indicates a no connect. All no connects are read as a "1"

COLOR CODES (D3 D2 D1 D0 => HEX => DEC => COLOR)
 D3 D2 D1 D0  HEX  DEC   COLOR
  0  0  0  0    0    0   BLACK
  0  0  0  1    1    1   WHITE
  0  0  1  0    2    2   RED
  0  0  1  1    3    3   CYAN
  0  1  0  0    4    4   PURPLE
  0  1  0  1    5    5   GREEN
  0  1  1  0    6    6   BLUE
  0  1  1  1    7    7   YELLOW
  1  0  0  0    8    8   ORANGE
  1  0  0  1    9    9   BROWN
  1  0  1  0    A   10   LT RED
  1  0  1  1    B   11   DARK GREY
  1  1  0  0    C   12   MED GREY
  1  1  0  1    D   13   LT GREEN
  1  1  1  0    E   14   LT BLUE
  1  1  1  1    F   15   LT GREY
```

## Key Registers
- (none) — this chunk documents color codes only; no specific register addresses are listed here.

## References
- "6566_vicii_pin_configuration_and_register_map" — expands on VIC-II register fields that store color nybbles
- "6566_vicii_character_display_and_color_modes" — explains how these color codes are used in character, bitmap and multicolor modes