# Copying and creating custom characters (copy ROM glyph to RAM; create via DATA/POKE)

**Summary:** Shows how to copy an individual character glyph from the ROM into RAM and replace another glyph (addresses used: $30D0, $31F0, $30A0), explains the 8-byte/8x8 encoding of C64 characters and the use of DATA/POKE to create a custom character; demonstrates bit inversion via 255-PEEK.

## Explanation
Characters on the C64 are stored as 8 bytes each: each byte represents one row of an 8x8 pixel matrix. A bit value of 1 turns the pixel on; 0 leaves it off. To change how a character looks on screen you can replace its 8-byte bitmap in the character memory (RAM) with another bitmap — either copied from ROM or assembled yourself.

Copying a single character from ROM and writing it into RAM (or vice versa) is done by reading the source bytes with PEEK and writing them with POKE. The example below copies a reversed 'Z' from the ROM area, inverts the bits (so black/white flips) using 255-PEEK, and pokes the result into a RAM character slot previously used by the '>' glyph. Note: this is purely visual — the character's PETSCII code and program semantics remain unchanged (typing or testing for '>' still uses the same code, it only looks different).

To make your own character you simply place eight byte values (0–255) into memory consecutively where the character bitmaps are held; the DATA/POKE example below shows creating a custom 8-row pattern.

Technical detail to remember from the source: the example only handled the first 64 characters in the set; other characters require different addressing.

## Source Code
```basic
FOR I=0 TO 7:POKE 12784+I,255-PEEK(I+12496):NEXT
```
- This loop reads 8 bytes starting at decimal 12496 (PEEK(I+12496)), inverts each byte with 255- value, and writes them to decimal 12784+I. (Decimal addresses in hex: 12496 = $30D0, 12784 = $31F0.)

Example BASIC program to create a character from DATA and POKE it into memory:
```basic
10 FOR I=12448 TO 12455: READ A: POKE I, A: NEXT
20 DATA 60, 66, 165, 129, 165, 153, 66, 60
```
- This writes the eight byte values 60,66,165,129,165,153,66,60 into decimal addresses 12448–12455 (hex $30A0–$30A7), forming an 8x8 bitmap.

Notes:
- Using 255-PEEK(byte) inverts all 8 bits of the byte (binary complement).
- Each byte corresponds to one horizontal row (most implementations use bit 7 as the leftmost pixel and bit 0 as the rightmost, consistent with how the VIC-II reads the character ROM/charset memory).

## Key Registers
- $30D0-$30D07 - Character ROM - source glyph bytes used in example (reversed Z read with PEEK)
- $31F0-$31F7 - Character RAM - destination glyph bytes overwritten (the '>' glyph replaced via POKE)
- $30A0-$30A7 - Character RAM - example location written by DATA/POKE program to create a custom glyph

## References
- "creating_character_patterns_and_worksheet" — expands on 8-row encoding and DATA statement character construction