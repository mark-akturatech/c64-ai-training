# PETSCII Screen Codes $60-$7F (Dec 96–127) — Graphic characters

**Summary:** PETSCII/C64 screen codes $60-$7F (decimal 96–127) map to graphic characters in both PETSCII character-set modes; the range includes the non-breaking/solid space ($60), CBM letter graphics, block/line pieces, spade symbol, and other CBM graphics.

## Graphic characters ($60-$7F)
These screen codes (decimal 96–127, hex $60–$7F) are all graphic glyphs in both character-set modes on the C64 (the glyphs remain graphic regardless of the uppercase/graphics toggle). Notable entries include Shift-Space (non‑breaking/solid block) at $60, the spade suit at $74, vertical and horizontal line pieces at $75/$76, and the CBM-letter graphics used for box/shape drawing. The full per-code mapping is provided in the Source Code section below.

## Source Code
```text
SCREEN CODES: GRAPHIC CHARACTERS ($60-$7F)

Dec  Hex   Character Description
---  ----  ---------------------
 96  $60   Shift-Space (non-breaking space / solid block)
 97  $61   Graphic: CBM-K
 98  $62   Graphic: Shift-+
 99  $63   Graphic: CBM-I
100  $64   Graphic: CBM-T
101  $65   Graphic: CBM-@
102  $66   Graphic: CBM-L
103  $67   Graphic: CBM-Y
104  $68   Graphic: CBM-G
105  $69   Graphic: Shift-Pound
106  $6A   Graphic: CBM-J
107  $6B   Graphic: CBM-+
108  $6C   Graphic: CBM--
109  $6D   Graphic: CBM-H
110  $6E   Graphic: CBM-Z
111  $6F   Graphic: CBM-S
112  $70   Graphic: CBM-E
113  $71   Graphic: CBM-Q
114  $72   Graphic: CBM-W
115  $73   Graphic: Shift-*
116  $74   Graphic: CBM-A (spade suit)
117  $75   Graphic: Shift-up arrow (vertical line)
118  $76   Graphic: CBM-X (horizontal line)
119  $77   Graphic: CBM-V
120  $78   Graphic: CBM-N
121  $79   Graphic: CBM-C
122  $7A   Graphic: CBM-D
123  $7B   Graphic: CBM-F
124  $7C   Graphic: CBM-B
125  $7D   Graphic: Shift--
126  $7E   Graphic: CBM-period
127  $7F   Graphic: CBM-R
```

## References
- "petscii_graphic_a0_bf" — expands on PETSCII $A0-$BF map related to these screen codes ($60-$7F)