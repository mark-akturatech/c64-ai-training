# PETSCII $60-$7F — Graphic / Uppercase Characters

**Summary:** PETSCII codes $60-$7F (decimal 96–127) are duplicates of $C0–$DF: in uppercase/graphics mode they are graphic characters (same glyphs as $C0–$DF); in lowercase/uppercase mode they become uppercase letters (also same as $C0–$DF). Screen-code conversion: PETSCII - $20 → Screen $40–$5F.

## PETSCII $60-$7F Details
- Codes $60–$7F are exact copies of PETSCII $C0–$DF (same glyphs and behavior).
- Mode behavior:
  - Uppercase/graphics mode: the bytes render graphic characters (line pieces, box/shape glyphs, symbols).
  - Lowercase/uppercase mode: the same byte values render uppercase ASCII letters.
- Conversion to C64 screen codes: subtract $20 from the PETSCII value. Example: PETSCII $60 → Screen $40.
- Notable entries in the range:
  - $60 (96) — Horizontal line (displayed as Shift-@ in some layouts), copy of $C0.
  - $7E (126) — Pi symbol, copy of $DE.
  - $7F (127) — CBM-+ symbol, copy of $DF.

## Source Code
```text
PETSCII GRAPHIC CHARACTERS / UPPERCASE LETTERS ($60-$7F)

In uppercase/graphics mode: graphic characters (same as $C0-$DF)
In lowercase/uppercase mode: uppercase letters (same as $C0-$DF)

NOTE: Codes $60-$7F are copies of codes $C0-$DF.

Dec  Hex   up/gfx              lo/up
---  ----  ------------------  -----
 96  $60   Horizontal line     Shift-@    (copy of $C0)
 97  $61   Graphic character   A          (copy of $C1)
 98  $62   Graphic character   B          (copy of $C2)
 99  $63   Graphic character   C          (copy of $C3)
100  $64   Graphic character   D          (copy of $C4)
101  $65   Graphic character   E          (copy of $C5)
102  $66   Graphic character   F          (copy of $C6)
103  $67   Graphic character   G          (copy of $C7)
104  $68   Graphic character   H          (copy of $C8)
105  $69   Graphic character   I          (copy of $C9)
106  $6A   Graphic character   J          (copy of $CA)
107  $6B   Graphic character   K          (copy of $CB)
108  $6C   Graphic character   L          (copy of $CC)
109  $6D   Graphic character   M          (copy of $CD)
110  $6E   Graphic character   N          (copy of $CE)
111  $6F   Graphic character   O          (copy of $CF)
112  $70   Graphic character   P          (copy of $D0)
113  $71   Graphic character   Q          (copy of $D1)
114  $72   Graphic character   R          (copy of $D2)
115  $73   Graphic character   S          (copy of $D3)
116  $74   Graphic character   T          (copy of $D4)
117  $75   Graphic character   U          (copy of $D5)
118  $76   Graphic character   V          (copy of $D6)
119  $77   Graphic character   W          (copy of $D7)
120  $78   Graphic character   X          (copy of $D8)
121  $79   Graphic character   Y          (copy of $D9)
122  $7A   Graphic character   Z          (copy of $DA)
123  $7B   Graphic character   Shift-+    (copy of $DB)
124  $7C   Graphic character   CBM--      (copy of $DC)
125  $7D   Graphic character   Shift--    (copy of $DD)
126  $7E   Graphic character   Pi symbol  (copy of $DE)
127  $7F   Graphic character   CBM-+      (copy of $DF)
```

## References
- "petscii_graphic_c0_df" — expands on original graphic character definitions in $C0-$DF (which $60-$7F copy)
- "petscii_to_screen_conversion" — expands on conversion: PETSCII $60-$7F -> Screen Code $40-$5F (subtract $20)