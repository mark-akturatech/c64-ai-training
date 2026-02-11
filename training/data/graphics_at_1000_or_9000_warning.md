# Graphics placed in $1000-$1FFF or $9000-$9FFF appear as ROM charset

**Summary:** The VIC-II will always see the ROM (standard CBM) character set when character/sprite/bitmap data is located in $1000-$1FFF or $9000-$9FFF; do not place custom charsets or sprite data there. See $D018 (VIC-II character memory pointer) for proper charset placement.

## Graphics at $1000 or $9000
If your sprites, bitmaps, or custom charsets look like they are using the standard CBM charset, they were likely placed in memory between $1000 and $1FFF or $9000 and $9FFF. These ranges will be interpreted by the VIC-II as the ROM charset regardless of what you have stored there, so custom character and sprite data placed in those areas will appear as the default PET/CBM characters.

This behavior commonly explains why music/data is often placed at $1000 (programmers avoid using that area for graphics). For correct placement and how to point the VIC-II at a custom charset, see documentation on $D018.

## Key Registers
- $D018 - VIC-II - Character memory pointer (selects where VIC fetches charset/screen memory)

## References
- "changing_charset_and_d018" — expands on proper placement of charsets and how $D018 points the VIC-II to them

## Labels
- D018
