# Programmable Character Set — Foreign Language

**Summary:** The Commodore 64 programmable character set lets you replace the standard character ROM with user-defined character bitmaps for foreign-language glyphs; this is implemented via the VIC-II character memory selection (e.g. $D018) and by loading custom PETSCII glyphs into RAM where the VIC-II will fetch them.

## Description
The C64 supports replacing the built‑in character set with a user-defined set so that foreign-language characters (accented letters, special punctuation, non‑Latin glyphs) can be displayed. The process requires two steps:
- Place the custom character bitmaps (the 8×8 character patterns used by the screen) into a RAM area accessible to the VIC‑II.
- Point the VIC‑II to that RAM area instead of the internal ROM so that character codes on the screen map to your custom glyphs.

Screen memory still holds the character codes (PETSCII values); only the character generator (bitmap) source is changed. This lets programs and BASIC listings display and print documents using user-defined characters for other languages.

## Key Registers
- $D018 - VIC-II - Selects character generator and screen/bitmap memory bank (points VIC-II to character ROM or to RAM containing a custom character set)

## References
- "graphics_and_art_modes" — expands on character graphics and custom character usage  
- "journals_creative_writing_and_storage" — expands on writing and printing documents in other languages

## Labels
- $D018
