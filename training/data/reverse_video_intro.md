# PETSCII Screen Codes — Reverse Video ($80-$FF)

**Summary:** PETSCII/C64 screen codes $80-$FF are the reverse-video equivalents of $00-$7F; obtain the reverse-video version by adding $80 (decimal 128) to the base code.

## Reverse-video rule
Codes $80-$FF directly map to the corresponding codes $00-$7F as their reverse-video forms. To convert any PETSCII/screen code in the $00-$7F range to its reverse-video counterpart, add $80 (hex) — that is, add 128 (decimal).

This mapping applies across the full screen-code set: letters, BASIC symbols, punctuation, digits, graphics characters, and CBM symbols (details in the referenced mapping tables).

## References
- "reverse_video_letters_and_basic_symbols" — reverse @ and A-Z (start of the table)
- "reverse_video_punctuation_numbers_space" — punctuation, space and digits
- "reverse_video_graphics_and_cbm_symbols" — graphic and CBM symbol mappings
