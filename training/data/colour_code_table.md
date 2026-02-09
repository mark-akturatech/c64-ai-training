# COLOUR CODE TABLE (KERNAL disassembly)

**Summary:** Table of 16 Commodore ASCII codes (one byte each) representing the 16 available colours (color0..colorF) in the KERNAL disassembly at $E8DA; searchable terms: $E8DA, ASCII, CHR$, set_colour_code, colour bytes (e.g. $1C = red), PRINT CHR$(28), POKE 646,2.

## Description
This table contains 16 single-byte Commodore ASCII codes used to represent the 16 available colours (labelled color0..colorF in the disassembly). The KERNAL routine set_colour_code uses the table (it compares the A register against these entries) to select the corresponding colour value. Example uses shown in the source: red is stored as $1C (decimal 28), so PRINT CHR$(28) will output the red colour code; the listing also shows an example poke: POKE 646,2.

Location in the disassembly: the table begins at $E8DA and defines entries color0..colorF in order.

## Source Code
```asm
                                *** COLOUR CODE TABLE
                                This is a table containing 16 Commodore ASCII codes
                                representing the 16 available colours. Thus red is
                                represented as $1c in the table, and would be obtained by
                                PRINT CHR$(28), or poke 646,2.
.:E8DA 90                       color0, black
.:E8DB 05                       color1, white
.:E8DC 1C                       color2, red
.:E8DD 9F                       color3, cyan
.:E8DE 9C                       color4, purple
.:E8DF 1E                       color5, green
.:E8E0 1F                       color6, blue
.:E8E1 9E                       color7, yellow
.:E8E2 81                       color8, orange
.:E8E3 95                       color9, brown
.:E8E4 96                       colorA, pink
.:E8E5 97                       colorB, grey1
.:E8E6 98                       colorC, grey2
.:E8E7 99                       colorD, light green
.:E8E8 9A                       colorE, light blue
.:E8E9 9B                       colorF, grey3
```

## References
- "set_colour_code" — compares A to this table to select COLOR