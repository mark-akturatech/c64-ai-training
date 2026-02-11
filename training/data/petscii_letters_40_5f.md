# PETSCII Letters and Symbols ($40-$5F)

**Summary:** PETSCII codes $40-$5F map to the ASCII-like letter and symbol range (decimal 64–95). In VIC-II/C64 character-set modes: in uppercase/graphics mode these bytes produce uppercase letters/symbols; in lowercase/uppercase mode they produce lowercase letters/symbols; conversion to screen codes is done by subtracting $40 (yielding $00-$1F).

## Character mapping
This chunk documents PETSCII byte values $40-$5F (decimal 64–95). Behavior depends on the character-set mode selected on the C64:

- Uppercase/graphics mode: these bytes render as uppercase letters and symbols.
- Lowercase/uppercase mode: these bytes render as lowercase letters and symbols.
- The byte $40 is the at-sign (@) in both modes.
- $5C is the British pound symbol (¤/£) in PETSCII.
- $5E and $5F are the up-arrow and left-arrow glyphs respectively.

Screen-code conversion: PETSCII $40-$5F map to screen codes $00-$1F by subtracting $40 (screen_code = petscii - $40). Those resulting screen codes represent @ and letters in the screen-code table.

## Source Code
```text
PETSCII LETTERS AND SYMBOLS ($40-$5F)

Dec  Hex   up/gfx  lo/up
---  ----  ------  -----
 64  $40   @       @
 65  $41   A       a
 66  $42   B       b
 67  $43   C       c
 68  $44   D       d
 69  $45   E       e
 70  $46   F       f
 71  $47   G       g
 72  $48   H       h
 73  $49   I       i
 74  $4A   J       j
 75  $4B   K       k
 76  $4C   L       l
 77  $4D   M       m
 78  $4E   N       n
 79  $4F   O       o
 80  $50   P       p
 81  $51   Q       q
 82  $52   R       r
 83  $53   S       s
 84  $54   T       t
 85  $55   U       u
 86  $56   V       v
 87  $57   W       w
 88  $58   X       x
 89  $59   Y       y
 90  $5A   Z       z
 91  $5B   [       [
 92  $5C   Pound sign (British pound symbol)
 93  $5D   ]       ]
 94  $5E   Up arrow
 95  $5F   Left arrow
```

## References
- "petscii_to_screen_conversion" — PETSCII $40-$5F -> Screen Code $00-$1F (subtract $40)
- "screen_codes_letters_00_1f" — screen codes representing @ and letters ($00-$1F)