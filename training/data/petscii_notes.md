# PETSCII and Screen Codes — special cases ($00-$1F, $80-$9F, $60-$7F, $E0-$FE, $FF/$DE)

**Summary:** PETSCII character behavior for control/layout ranges ($00-$1F, $80-$9F), duplicate/alias ranges ($60-$7F → $C0-$DF and $E0-$FE → $A0-$BE), and the BASIC/pi token conversion pair ($FF ↔ $DE). Also notes keyboard buffer behavior for $DE (Shift‑up arrow).

## Behavior and special cases
- Control/layout ranges
  - Codes $00-$1F and $80-$9F are control/layout codes. Printing these does not place a visible glyph; instead they trigger changes in screen layout or behaviour (cursor movement, screen control functions, etc.).
- Duplicate/alias ranges (no distinct glyphs)
  - Codes $60-$7F are not independent characters: they are copies (aliases) of $C0-$DF.
  - Codes $E0-$FE are not independent characters: they are copies (aliases) of $A0-$BE.
  - Although you can attempt to print values in $60-$7F or $E0-$FE, they behave as the corresponding $C0-$DF or $A0-$BE codes.
- The $FF / $DE special case (BASIC token for the pi symbol)
  - $FF is the BASIC token used to represent the pi symbol in programs.
  - When BASIC prints the pi token, $FF is converted internally to screen code $DE for display.
  - When reading screen memory (fetching characters from the screen), $DE is converted back to the BASIC token $FF.
  - The keyboard buffer does not perform this screen↔token conversion: a typed Shift‑up arrow (the key that corresponds to pi/token) is stored as $DE in the keyboard buffer (not $FF).

## References
- "petscii_ff_special" — detailed behavior of code $FF and conversion to $DE  
- "petscii_control_00_1f" — examples and expansion for control codes $00-$1F  
- "petscii_control_80_9f" — examples and expansion for control codes $80-$9F
