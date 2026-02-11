# PETSCII Screen Codes $00-$1F (Dec 0–31)

**Summary:** Screen codes $00-$1F (decimal 0–31) map to the @ sign and the Latin letters A–Z (VIC-II screen codes) and their lowercase equivalents in lo/up mode; table lists each code with the character displayed in up/gfx and lo/up modes. Also includes the punctuation and cursor symbols at the upper end ($1B–$1F).

## Screen codes $00-$1F
These are the VIC-II screen-code values used for text display on the C64 for codes 0 through 31 ($00–$1F). In the default "up/gfx" mapping they represent @ and uppercase A–Z; when the screen is in "lo/up" (lowercase/uppercase) mode the same codes display lowercase a–z where applicable. Codes $1B–$1F are punctuation/cursor symbols (bracket, pound sign, bracket, up arrow, left arrow). See the cross-reference for PETSCII offsets $40–$5F (subtract $40 to convert to these screen codes).

## Source Code
```text
SCREEN CODES: @ AND LETTERS ($00-$1F)

Dec  Hex   up/gfx  lo/up
---  ----  ------  -----
  0  $00   @       @
  1  $01   A       a
  2  $02   B       b
  3  $03   C       c
  4  $04   D       d
  5  $05   E       e
  6  $06   F       f
  7  $07   G       g
  8  $08   H       h
  9  $09   I       i
 10  $0A   J       j
 11  $0B   K       k
 12  $0C   L       l
 13  $0D   M       m
 14  $0E   N       n
 15  $0F   O       o
 16  $10   P       p
 17  $11   Q       q
 18  $12   R       r
 19  $13   S       s
 20  $14   T       t
 21  $15   U       u
 22  $16   V       v
 23  $17   W       w
 24  $18   X       x
 25  $19   Y       y
 26  $1A   Z       z
 27  $1B   [       [
 28  $1C   Pound sign
 29  $1D   ]       ]
 30  $1E   Up arrow
 31  $1F   Left arrow
```

## References
- "petscii_letters_40_5f" — expands on PETSCII $40–$5F; subtract $40 to convert those PETSCII codes to the screen codes shown here.