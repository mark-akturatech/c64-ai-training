# Character graphics — screen memory and colour RAM (custom charsets)

**Summary:** Describes C64 character-graphics basics: default screen memory at $0400 (size $03E8), colour RAM fixed at $D800 (per-character colours), and the difference between screen codes and PETSCII; mentions $D018 as the VIC-II pointer to character/screen memory.

## Character graphics
Character graphics are an alternative to sprites for drawing on the C-64. You can replace the built-in character set with a custom charset (often updated in realtime) to produce graphics or effects; character cells need not look like text glyphs.

## Screen and Colour RAM
- Screen memory holds the screen codes that select which character glyph is shown in each 8x8 cell. By default screen memory begins at $0400 and is $03E8 bytes long (one byte per visible character cell). The default location can be moved via VIC-II setup ($D018 — see references).
- Screen codes are not identical to PETSCII text codes; prepare or export data as screen codes when writing directly to screen memory.
- Colour RAM is a separate 1‑byte-per-cell area located at $D800 and cannot be moved. Each byte selects the foreground colour for the corresponding character cell.
- Example (from source): to show an 'A' in the upper-left and make it yellow, put the screen code for 'A' (value 1 in this source example) at $0400 and the colour value for yellow (7) at $D800.

## Source Code
```basic
REM Example (BASIC) — upper-left character and colour
POKE 1024,1    : REM $0400 = 1024 decimal — put screen code 1 in top-left
POKE 55296,7   : REM $D800 = 55296 decimal — set top-left colour to 7 (yellow)
```

```text
Screen memory:
- Default base: $0400
- Length: $03E8 bytes (addresses $0400 - $07E7)

Colour RAM:
- Fixed base: $D800
- 1 byte per screen cell (per-character foreground colour)
```

## Key Registers
- $0400-$07E7 - Screen memory - screen codes for each character cell (size $03E8)
- $D800 - VIC-II (Colour RAM) - per-character foreground colour (fixed location)
- $D018 - VIC-II - pointer configuration for character set and screen memory (see reference)

## References
- "changing_charset_and_d018" — expands on pointing character set and screen memory via $D018