# COLOR (646, $286)

**Summary:** OS variable at $0286 (decimal 646) that holds the current foreground color used by PRINT; the OS reads this location when printing and writes its value into color RAM. Changeable by CTRL/Commodore-logo key combos, CHR$ (PETSCII) characters, or POKE.

## Description
Printing a character places both the character's screen code into screen memory and a foreground color value into the corresponding location in color RAM. When a character is PRINTed, the Operating System fetches the color value to write into color RAM from address $0286 (decimal 646), the COLOR variable.

Methods to change the foreground color value stored at $0286:
- Pressing CTRL + 1–8 changes the stored value (corresponding to color codes 0–7).
- Pressing the Commodore logo key + 1–8 changes the stored value (corresponding to color codes 8–15).
- PRINTing the PETSCII equivalent character via CHR$ updates the value.
- POKE 646,<color> directly stores a color value into this location.

The table below lists the color codes (0–15), color names, PETSCII character codes to produce them via CHR$, and the key combinations that set them.

## Source Code
```text
POKE COLOR#   COLOR        CHR$   KEYS TO PRESS
 0        Black         144    CTRL-1
 1        White           5    CTRL-2
 2        Red            28    CTRL-3
 3        Cyan          159    CTRL-4
 4        Purple        156    CTRL-5
 5        Green          30    CTRL-6
 6        Blue           31    CTRL-7
 7        Yellow        158    CTRL-8
 8        Orange        129    Logo-1
 9        Brown         149    Logo-2
10        Lt Red        150    Logo-3
11        Dark Gray     151    Logo-4
12        Med Gray      152    Logo-5
13        Lt Green      153    Logo-6
14        Lt Blue       154    Logo-7
15        Lt Gray       155    Logo-8
```

## Key Registers
- $0286 - OS variable - Current foreground color for text (COLOR), read by the OS when PRINTing to determine color RAM value

## References
- "gdcol_color_under_cursor" — expands on GDCOL storing original color under the cursor
- "hibase_screen_memory_top_page" — expands on PRINT effects when HIBASE is changed to print to other memory (examples)