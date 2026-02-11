# BASIC: Replace 'T' with a smiley by POKEing 8-byte character data

**Summary:** BASIC program that writes an 8-byte character bitmap into memory addresses 12448–12455 to replace the letter 'T' with a custom 8x8 PETSCII character (bytes given as decimal DATA values; each byte = one row, bits shown as 7..0).

## Description
This short BASIC example stores an 8-row bitmap (one byte per row) into consecutive memory locations 12448–12455. Each DATA value is a decimal representation of the 8 bits that make one row of the character matrix; the bit order is shown as 7 6 5 4 3 2 1 0 (bit 7 is the leftmost pixel in the printed diagram). After RUN, typing the character T will display the custom smiley glyph defined by those 8 rows.

Row index 0..7 corresponds to the first..last byte in the DATA statement (row 0 = first DATA value, row 7 = last DATA value).

## Source Code
```basic
10 FOR I=12448 TO 12455:READ A:POKE I,A:NEXT
20 DATA 60,66,165,129,165,153,66,60
```

Character matrix (visual, binary and decimal per row):

```text
         7 6 5 4 3 2 1 0      BINARY        DECIMAL
        +--------+
ROW 0   |  ****  |    00111100        60
ROW 1   | *    * |    01000010        66
ROW 2   |* *  * *|    10100101       165
ROW 3   |*      *|    10000001       129
ROW 4   |* *  * *|    10100101       165
ROW 5   |*  **  *|    10011001       153
ROW 6   | *    * |    01000010        66
ROW 7   |  ****  |    00111100        60
        +--------+
```

Quick usage: LOAD or type the two lines into BASIC, RUN, then type a few capital T characters to view the smiley.

## References
- "creating_character_patterns_and_worksheet" — worksheet and expanded guidance for designing custom characters
