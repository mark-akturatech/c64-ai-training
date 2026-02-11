# Commodore 64 Screen Codes (screen memory $0400-$07E7)

**Summary:** Screen codes are the byte values stored in screen memory ($0400-$07E7) that the VIC‑II uses to select glyphs; they differ from PETSCII codes. Codes $00-$7F select normal characters, while $80-$FF are the reverse‑video equivalents (bit 7 set) of $00-$7F; character appearance depends on the current character set mode (up/gfx or lo/up).

## Explanation
- Screen memory range: $0400-$07E7. Each byte in this range is a screen code (index into the active character ROM/RAM) used by the VIC‑II to draw the displayed glyph.
- Screen codes are not the same as PETSCII character codes. PETSCII is a character encoding used by software and I/O; screen codes are the values placed in screen memory to display a specific glyph from the character ROM/RAM.
- Character set/display modes:
  - up/gfx = uppercase/graphics mode (the default C64 character set mapping used for the standard display).
  - lo/up  = lowercase/uppercase mode (alternate character set mapping providing lowercase letters).
  The same screen code will select different glyphs depending on which character set mode is active.
- Reverse video: the high bit (bit 7) toggles reverse video. Values $80-$FF are exactly the reverse‑video forms of $00-$7F; i.e., set bit 7 to display the corresponding character in reverse video.
- Practical note (brief): to display the same glyph in reverse video, OR the screen code with $80.

## Source Code
```text
Screen memory range:
  $0400 - $07E7  (1000 bytes on standard 40x25 screen; exact usable range depends on layout)

Reverse‑video mapping:
  Screen code N (hex $00-$7F)  -> Normal
  Screen code N | $80 (hex $80-$FF) -> Reverse video (same glyph, bit 7 set)

Display mode names:
  "up/gfx"  = uppercase/graphics character set mode (default)
  "lo/up"   = lowercase/uppercase character set mode
```

## Key Registers
- $0400-$07E7 - Screen memory - bytes containing screen codes used by the VIC‑II to index glyphs; bit 7 = reverse video

## References
- "petscii_to_screen_conversion" — mapping and rules converting PETSCII to screen codes
- "screen_codes_reverse_80_ff" — examples and explanation of reverse‑video mapping (bit 7)