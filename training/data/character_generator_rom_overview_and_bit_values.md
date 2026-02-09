# Character Generator ROM ($D000-$DFFF)

**Summary:** The Character Generator ROM at $D000–$DFFF (53248–57343) contains 4096 bytes of 8×8 character bitmaps, with each character represented by 8 bytes. These bytes are stored sequentially in screen-code order, where each byte's bits (Bit 7 to Bit 0) correspond to the eight horizontal pixels of a character row.

**Overview**

The Character Generator ROM provides the 8×8 bitmap patterns for text and graphic characters. It occupies memory addresses $D000–$DFFF (53248–57343) and comprises 4096 bytes. Each character's bitmap is defined by eight consecutive bytes, with each byte representing one horizontal row of the 8×8 matrix.

Characters are stored sequentially in screen-code order. For example, the first eight bytes correspond to the character with screen code 0 (the '@' symbol), the next eight bytes to screen code 1 ('A'), and so on.

Bit numbering and pixel mapping:
- Each byte consists of 8 bits: Bit 7 is the leftmost pixel of the row, and Bit 0 is the rightmost.
- Bit values: Bit 7 = 128, Bit 6 = 64, ..., Bit 0 = 1.
- A bit value of 1 illuminates the corresponding pixel (using the color determined by the relevant nybble in Color RAM); a bit value of 0 leaves the pixel in the background color.

The ROM contains two complete character sets:
1. **Uppercase/Graphics Set:** Includes uppercase letters and graphical symbols.
2. **Uppercase/Lowercase Set:** Includes both uppercase and lowercase letters.

Each set occupies 2 KB (2048 bytes), totaling 4 KB for the entire ROM. The sets are organized as follows:
- **First 2 KB ($D000–$D7FF):** Uppercase/Graphics Set.
- **Second 2 KB ($D800–$DFFF):** Uppercase/Lowercase Set.

**Data Format and Ordering**

- **Size:** 4096 bytes total.
- **Characters:** 256 characters per set; each character is represented by 8 bytes, resulting in two complete 256-character sets.
- **Storage Order:** Character bitmaps are arranged in screen-code order. For any character code C, its bitmap is located at $D000 + (C * 8) for the first set and at $D800 + (C * 8) for the second set.
- **Pixel Mapping per Byte:** Each byte represents one 8-pixel horizontal row; Bit 7 corresponds to the leftmost column, and Bit 0 to the rightmost.
- **Color:** The character's foreground color is determined by the appropriate nybble in Color RAM, while the background uses the screen's background color.

**Example: Character 'A' Bitmap**

The character 'A' (screen code 1) is represented by the following 8 bytes in the Character Generator ROM:


In this representation:
- '1' indicates an illuminated pixel.
- '0' indicates a non-illuminated pixel.

**BASIC Program to Display Character Bitmaps**

The following BASIC program reads and displays the bitmap of a specified character from the Character Generator ROM:


This program:
1. Prompts the user to enter a character.
2. Retrieves the ASCII code of the character.
3. Reads the corresponding 8 bytes from the Character Generator ROM.
4. Displays the character's bitmap on the screen using PETSCII code 219 for filled pixels.

## Source Code

```text
Byte 0: 00011000  ; Binary: 00011000  (Decimal: 24)
Byte 1: 00111100  ; Binary: 00111100  (Decimal: 60)
Byte 2: 01100110  ; Binary: 01100110  (Decimal: 102)
Byte 3: 01111110  ; Binary: 01111110  (Decimal: 126)
Byte 4: 01100110  ; Binary: 01100110  (Decimal: 102)
Byte 5: 01100110  ; Binary: 01100110  (Decimal: 102)
Byte 6: 01100110  ; Binary: 01100110  (Decimal: 102)
Byte 7: 00000000  ; Binary: 00000000  (Decimal: 0)
```

```basic
10 INPUT "Enter character: "; A$
20 IF LEN(A$) = 0 THEN END
30 C = ASC(A$)
40 FOR I = 0 TO 7
50   POKE 1024 + I * 40, 32  ; Clear line
60   B = PEEK(53248 + C * 8 + I)
70   FOR J = 0 TO 7
80     IF B AND (128 / 2^J) THEN POKE 1024 + I * 40 + J, 219
90   NEXT J
100 NEXT I
110 GOTO 10
```


## Key Registers

- **$D000–$DFFF:** Character Generator ROM – 4096 bytes containing two 256-character sets, with 8 bytes per character, stored sequentially in screen-code order. Bit 7 to Bit 0 map to the leftmost to rightmost pixel columns, respectively.

## References

- "Commodore 64 Programmer's Reference Guide" – Detailed information on character graphics and memory mapping.
- "Commodore 64 User's Guide" – Appendix G: Screen code chart for character ordering.
- "VIC-II Graphics: Accessing ROM Font Images from Different Banks" – Explanation of how the VIC-II maps Character ROM into address space and techniques for copying ROM to RAM.