# DIRECT vs PROGRAM modes and SET 1 / SET 2 character sets — Commodore 64

**Summary:** Describes BASIC operation modes (DIRECT and PROGRAM) and the two built-in C64 character sets (SET 1 and SET 2), including how the SHIFT and C= keys select graphic/top symbols and how to toggle sets (C= + SHIFT).

## BASIC Modes: DIRECT and PROGRAM
- DIRECT Mode: Enter BASIC statements without line numbers; statements are executed when <RETURN> is pressed.
- PROGRAM Mode: All BASIC statements must have line numbers. Multiple statements may appear on one logical program line, but each logical screen line is limited to 80 characters; if a statement exceeds the 80-character logical line it must be continued on a new line with a new line number.
- Always type NEW and press <RETURN> before starting a new program.

## Character sets (SET 1 and SET 2)
- The Commodore 64 contains two complete character sets available from the keyboard or in programs.
- SET 1:
  - Default unshifted: upper‑case alphabet and digits 0–9.
  - Hold <SHIFT>: produces the graphic characters printed on the right side of the front of the keys.
  - Hold <C=> (Commodore key): produces the graphic characters printed on the left side of the front of the keys.
  - Hold <SHIFT> on keys that do not have graphic symbols: produces the symbol printed at the top portion of the key.
- SET 2:
  - Default unshifted: lower‑case alphabet and digits 0–9.
  - Hold <SHIFT>: produces upper‑case alphabet.
  - Hold <C=>: produces the graphic characters printed on the left side of the front of the keys.
  - Hold <SHIFT> on keys that do not have graphic symbols: produces the symbol printed at the top portion of the key.

## Key mapping behavior and switching
- Key-face regions:
  - Left-side glyphs on key fronts → selected with <C=>.
  - Right-side glyphs on key fronts → selected with <SHIFT> when SET 1 is active.
  - Topmost glyphs on keys without graphics → selected with <SHIFT>.
- To toggle between the two internal character sets (SET 1 ↔ SET 2): press <C=> and <SHIFT> together.

## References
- "screen_display_codes_table" — expands on character set symbols and special characters