# Color RAM ($D800-$DBFF) — usage in Text, Multicolor Text, and Bitmap modes

**Summary:** Color RAM at $D800-$DBFF (VIC-II) holds per-character color data used by text and multicolor modes; it is unused in high-resolution bitmap mode and treated differently in multicolor bitmap. The OS behavior on newer C64s sets Color RAM to the background color on screen clear (register $D021 / 53281), which can be used to initialize or hide text.

**Behavior overview**
- Color RAM is a fixed 1K area at $D800-$DBFF mapped to the 40×25 character cells; it is not relocatable (unlike Screen RAM).
- In plain text mode each byte in Color RAM selects the foreground color for its associated character cell.
- Color RAM can be used to hide characters by setting a character’s foreground color equal to the background color (or by changing the background to match the foreground).
- Newer C64 OSes set all Color RAM locations to the current background color when the screen is cleared (see OS behavior below); this makes POKEing character codes into Screen RAM appear invisible until Color RAM is changed.

**Text mode**
- Each Color RAM byte is a per-character foreground color (0–15 in principle, but see multicolor rules below).
- Use Color RAM to change colors of text without overwriting character codes.

**Multicolor text mode**
- Only the low three bits of the Color RAM byte are used for selecting colors (values 0–7).
- The fourth bit (bit 3, value 8) is a multicolor flag: Color RAM values >= 8 enable multicolor display for that character cell.
- When the multicolor flag is set, the effective color used for the multicolor "2-bit pair" (the extra per-cell multicolor entry) is (Color RAM value − 8). Characters with Color RAM < 8 are displayed normally.

**Bitmap modes**
- High-resolution (hi-res) bitmap mode: Color RAM is not used; bitmap graphics use the separate bitmap color map and VIC-II color registers instead.
- Multicolor bitmap mode: Color RAM is used to determine the color of the 2-bit pixel pairs for each 8×8 character cell (i.e., it contributes one of the available colors for that 8×8 area).

**OS behavior and practical trick**
- The OS change in newer C64s causes Color RAM to be filled with the current background color on a screen-clear operation. This explains why poked character codes may be invisible immediately after POKEing Screen RAM.
- To set all Color RAM bytes to a particular value quickly: set the background color via $D021 (53281), clear the screen (which fills Color RAM with that background color), then restore the background color to the desired value.

## Source Code
```basic
10 REM RAPID COLOR RAM CHANGE DEMO
20 FOR I = 0 TO 999
30 POKE 55296 + I, RND(1) * 16
40 NEXT I
50 GOTO 20
```

## Key Registers
- $D800-$DBFF - VIC-II - Color RAM (per-character foreground color / multicolor flag, fixed 1K mapped to screen cells)
- $D021 - VIC-II - Background (screen) color register (used by OS screen-clear behavior affecting Color RAM)

## References
- "bitmap_multicolor_plotting_and_sample" — expands on Color RAM usage in multicolor bitmap mode
- "648 ($288)" — referenced BASIC program that rapidly changes Color RAM (example)