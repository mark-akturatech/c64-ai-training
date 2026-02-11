# MOS 6567/6569 (VIC-II) 16-color palette

**Summary:** VIC-II fixed 16-color palette encoded as 4-bit values (0x0–0xF). Searchable terms: VIC-II, 4-bit palette, color values, $D020-$D02E.

## Color palette
The VIC-II uses a hard-wired palette of 16 displayable colors. Each color is represented by a 4-bit value (0–15, 0x0–0xF) which is written to VIC-II color registers (background/border and sprite color registers) to select on-screen colours.

The palette is fixed in hardware; software selects colors by writing the 4-bit index to the appropriate VIC-II registers (see $D020-$D02E for background/border and sprite color registers).

## Source Code
```text
VIC-II fixed 16-color palette (4-bit encoding)
Decimal  Hex   Name
0        $0    black
1        $1    white
2        $2    red
3        $3    cyan
4        $4    pink
5        $5    green
6        $6    blue
7        $7    yellow
8        $8    orange
9        $9    brown
10       $A    light red
11       $B    dark gray
12       $C    medium gray
13       $D    light green
14       $E    light blue
15       $F    light gray
```

## Key Registers
- $D020-$D02E - VIC-II - background, border and sprite color registers (background/border and sprite color register range)

## References
- "vic_registers_table" — expands on background and sprite color registers $D020-$D02E

## Labels
- BLACK
- WHITE
- RED
- CYAN
- PINK
- GREEN
- BLUE
- YELLOW
- ORANGE
- BROWN
- LIGHT_RED
- DARK_GRAY
- MEDIUM_GRAY
- LIGHT_GREEN
- LIGHT_BLUE
- LIGHT_GRAY
