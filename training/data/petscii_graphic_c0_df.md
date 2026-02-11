# PETSCII Graphic Characters / Uppercase Letters ($C0-$DF)

**Summary:** PETSCII codes $C0-$DF (decimal 192–223) are graphic characters in uppercase/graphics mode and produce uppercase letters in lowercase/uppercase mode; their screen-code equivalents are $40–$5F (subtract $80 from PETSCII).

## Overview
This chunk documents the PETSCII byte range $C0–$DF (dec 192–223). Behavior:
- Uppercase/graphics mode: each code is a graphic glyph (horizontal line, CBM block/line graphics, special symbols).
- Lowercase/uppercase mode: the same byte values map to uppercase letters or shifted symbols (the table below shows the lowercase/uppercase output for each code).
- Screen-code conversion: PETSCII $C0–$DF converts to C64 screen codes $40–$5F by subtracting $80 (PETSCII -> ScreenCode = value - $80).

Notes:
- These graphic/uppercase copies are also mirrored elsewhere (see referenced chunk "petscii_graphic_or_upper_60_7f" for the $60–$7F copies).
- The lo/up column in the table lists the character produced when the C64 is in lowercase/uppercase mode (e.g., $C0 -> Shift-@, $C1 -> A, …, $DA -> Z, etc.).

## Source Code
```text
Dec  Hex   up/gfx              lo/up
---  ----  ------------------  -----
192  $C0   Horizontal line     Shift-@
193  $C1   Graphic character   A
194  $C2   Graphic character   B
195  $C3   Graphic character   C
196  $C4   Graphic character   D
197  $C5   Graphic character   E
198  $C6   Graphic character   F
199  $C7   Graphic character   G
200  $C8   Graphic character   H
201  $C9   Graphic character   I
202  $CA   Graphic character   J
203  $CB   Graphic character   K
204  $CC   Graphic character   L
205  $CD   Graphic character   M
206  $CE   Graphic character   N
207  $CF   Graphic character   O
208  $D0   Graphic character   P
209  $D1   Graphic character   Q
210  $D2   Graphic character   R
211  $D3   Graphic character   S
212  $D4   Graphic character   T
213  $D5   Graphic character   U
214  $D6   Graphic character   V
215  $D7   Graphic character   W
216  $D8   Graphic character   X
217  $D9   Graphic character   Y
218  $DA   Graphic character   Z
219  $DB   Graphic character   Shift-+
220  $DC   Graphic character   CBM--
221  $DD   Graphic character   Shift--
222  $DE   Graphic character   Pi symbol
223  $DF   Graphic character   CBM-+
```

Additional references:
- "petscii_graphic_or_upper_60_7f" — expands on copies located at $60–$7F
- "petscii_to_screen_conversion" — expands on conversion: PETSCII $C0–$DF -> Screen Code $40–$5F (subtract $80)

## References
- "petscii_graphic_or_upper_60_7f" — covers the mirrored copies located at $60–$7F
- "petscii_to_screen_conversion" — covers PETSCII-to-screen-code conversion details (subtract $80)