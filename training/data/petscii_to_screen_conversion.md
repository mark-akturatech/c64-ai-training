# PETSCII ↔ C64 Screen Codes (screen memory $0400-$07E7)

**Summary:** Conversion rules between PETSCII and C64 Screen Codes for direct screen memory access ($0400-$07E7), listing explicit PETSCII ranges and the arithmetic to convert to screen codes; also documents the +$80 rule for reverse-video screen bytes.

## Conversion Overview
PETSCII is the character encoding used by C64 I/O (PRINT, keyboard), while Screen Codes are the byte values stored in screen memory ($0400-$07E7) that the VIC-II interprets for display. Use the conversion formulas (below) when writing character values directly to screen memory or when translating between printable PETSCII and on-screen codes. The mapping ranges and subtraction offsets are given in the Source Code section; reverse-video is obtained by adding $80 to a screen code.

## Source Code
```text
PETSCII TO SCREEN CODE CONVERSION

PETSCII codes and Screen Codes are different numbering systems. The C64
uses PETSCII for I/O operations (PRINT, keyboard input) and Screen Codes
for direct screen memory access ($0400-$07E7).

Conversion formulas:

  PETSCII $20-$3F  -->  Screen Code $20-$3F  (same: space, digits, symbols)
  PETSCII $40-$5F  -->  Screen Code $00-$1F  (subtract $40: @, A-Z, etc.)
  PETSCII $60-$7F  -->  Screen Code $40-$5F  (subtract $20: graphics/letters)
  PETSCII $A0-$BF  -->  Screen Code $60-$7F  (subtract $40: graphic chars)
  PETSCII $C0-$DF  -->  Screen Code $40-$5F  (subtract $80: graphics/letters)

  Add $80 to any screen code for its reverse video equivalent.
```

## Key Registers
- $0400-$07E7 - Screen memory - Screen Codes (bytes written here determine characters shown by the VIC-II)

## References
- "screen_codes_intro" — expands on screen codes used in screen memory ($0400-$07E7)
- "screen_codes_reverse_80_ff" — expands on how to obtain reverse video by adding $80 to screen codes
- "petscii_printable_20_3f" — expands on unchanged mapping for $20-$3F (space/digits/symbols)