# GDCOL ($287) — Color of character under cursor

**Summary:** GDCOL at 647 ($287) stores the original color code of the character currently under the blinking cursor; used together with COLOR at 646 ($286) so the OS can restore the character's color when the cursor moves.

## Description
GDCOL holds the color code (original foreground color) of the character at the current cursor position. The blinking cursor temporarily uses the foreground color defined in the COLOR variable at 646 ($286), so the original color must be retained in GDCOL to allow restoration if the cursor moves without modifying the character.

(References to COLOR imply a 4-bit color index, 0-15.)

## Key Registers
- $0286-$0287 - RAM - COLOR (foreground used when cursor blinks) and GDCOL (original color of character under cursor)

## References
- "color_register_and_available_colors" — expands on COLOR register and available colors

## Labels
- GDCOL
- COLOR
