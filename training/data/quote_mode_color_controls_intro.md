# Commodore 64 — Quote-mode color controls (CTRL / C= + color keys)

**Summary:** In BASIC quote mode (inside "..." strings), holding the CTRL or C= (Commodore) key while pressing one of the color keys inserts a special reversed character (a color-control token) into the quoted text. When the string is subsequently PRINTed, the token changes the printed text color. Searchable terms: quote mode, CTRL, C=, color keys, PRINT, color-control token.

**Color Controls**

Holding the CTRL or C= key while pressing any of the eight color keys inserts a special reversed character—a color-control token—into the current quoted string. The token is visible as a reversed glyph while editing the string; it is not a normal printable character. When the string containing that token is PRINTed from BASIC, the token causes the text color to change to the corresponding color for that key.

- The mechanism operates inside quoted strings only (quote mode).
- The editing-time glyph is a reversed character used to represent the control token; the runtime effect is a color change when printed.

**Key-to-Color Mapping**

The Commodore 64 provides 16 text colors, accessible via specific key combinations:

| Key Combination | Color Name  | CHR$ Code |
|-----------------|-------------|-----------|
| CTRL + 1        | Black       | 144       |
| CTRL + 2        | White       | 5         |
| CTRL + 3        | Red         | 28        |
| CTRL + 4        | Cyan        | 159       |
| CTRL + 5        | Purple      | 156       |
| CTRL + 6        | Green       | 30        |
| CTRL + 7        | Blue        | 31        |
| CTRL + 8        | Yellow      | 158       |
| C= + 1          | Orange      | 129       |
| C= + 2          | Brown       | 149       |
| C= + 3          | Light Red   | 150       |
| C= + 4          | Dark Gray   | 151       |
| C= + 5          | Medium Gray | 152       |
| C= + 6          | Light Green | 153       |
| C= + 7          | Light Blue  | 154       |
| C= + 8          | Light Gray  | 155       |

*Note:* The CHR$ codes correspond to the PETSCII values for each color-control token. ([c64-wiki.com](https://www.c64-wiki.com/wiki/Color?utm_source=openai))

**Example BASIC Usage**

To insert color-control tokens into a quoted string and observe the color changes upon printing:


In this example:

- `CHR$(5)` inserts the token for white text.
- `CHR$(28)` inserts the token for red text.
- `CHR$(30)` inserts the token for green text.
- And so on for other colors.

When the program is RUN, each line of text will be displayed in its respective color. ([retroshowcase.gr](https://retroshowcase.gr/manuals/Commodore_64_manual.pdf?utm_source=openai))

**Numeric/CHR$ Values for Programmatic Insertion**

To programmatically insert color-control tokens into strings, use the CHR$ function with the corresponding PETSCII code:

- Black: `CHR$(144)`
- White: `CHR$(5)`
- Red: `CHR$(28)`
- Cyan: `CHR$(159)`
- Purple: `CHR$(156)`
- Green: `CHR$(30)`
- Blue: `CHR$(31)`
- Yellow: `CHR$(158)`
- Orange: `CHR$(129)`
- Brown: `CHR$(149)`
- Light Red: `CHR$(150)`
- Dark Gray: `CHR$(151)`
- Medium Gray: `CHR$(152)`
- Light Green: `CHR$(153)`
- Light Blue: `CHR$(154)`
- Light Gray: `CHR$(155)`

For example, to print the word "HELLO" in red:


This will display "HELLO" in red text. ([retroshowcase.gr](https://retroshowcase.gr/manuals/Commodore_64_manual.pdf?utm_source=openai))

## Source Code

```basic
10 PRINT "NORMAL TEXT"
20 PRINT CHR$(5) "WHITE TEXT"
30 PRINT CHR$(28) "RED TEXT"
40 PRINT CHR$(30) "GREEN TEXT"
50 PRINT CHR$(31) "BLUE TEXT"
60 PRINT CHR$(129) "ORANGE TEXT"
70 PRINT CHR$(144) "BLACK TEXT"
80 PRINT CHR$(149) "BROWN TEXT"
90 PRINT CHR$(150) "LIGHT RED TEXT"
100 PRINT CHR$(151) "DARK GRAY TEXT"
110 PRINT CHR$(152) "MEDIUM GRAY TEXT"
120 PRINT CHR$(153) "LIGHT GREEN TEXT"
130 PRINT CHR$(154) "LIGHT BLUE TEXT"
140 PRINT CHR$(155) "LIGHT GRAY TEXT"
150 PRINT CHR$(156) "PURPLE TEXT"
160 PRINT CHR$(158) "YELLOW TEXT"
170 PRINT CHR$(159) "CYAN TEXT"
```

```basic
PRINT CHR$(28) "HELLO"
```


## References

- "Commodore 64 User's Guide" — detailed explanation of color-control tokens and their usage in BASIC programs. ([retroshowcase.gr](https://retroshowcase.gr/manuals/Commodore_64_manual.pdf?utm_source=openai))
- "Color - C64-Wiki" — comprehensive list of color codes and their corresponding key combinations. ([c64-wiki.com](https://www.c64-wiki.com/wiki/Color?utm_source=openai))

## Labels
- BLACK
- WHITE
- RED
- CYAN
- PURPLE
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
