# Creating 8x8 Custom Characters

**Summary:** Describes two methods for producing custom 8x8 character shapes: manual conversion from an 8x8 pixel grid into eight byte values (bit-values summed per row), or use commercial character-editor programs to draw and export character data; includes storage note for the generated data.

## Methods
- Manual (grid → bytes): Draw the character on an 8×8 grid. For each of the eight rows, convert darkened pixels to their bit-values and add those bit-values to form one byte. Repeat for all eight rows to produce the 8-byte pattern for that character.
- Interactive (editor): Use a commercial character-graphics editor to draw the 8×8 glyph interactively; the editor exports the eight-byte pattern (or blocks of character data) directly.

## Storage
- Store one character as eight consecutive bytes; each byte represents one row of the 8×8 pixel glyph (bit = pixel on/off).
- Place the generated character data in the character ROM/RAM area appropriate to your text/bitmap mode (see referenced setup for placement details).

## Source Code
(omitted — no listings in source)

## Key Registers
(omitted — this chunk does not cover specific hardware registers)

## References
- "employing_user_defined_characters_setup" — where to place the generated character data