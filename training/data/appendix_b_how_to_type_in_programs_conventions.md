# Appendix B: Listing conventions for typing programs

**Summary:** Defines listing notation for Commodore 64 program entry: braces { } for special characters and repeat counts, underlining for shifted keys, [<>] for the Commodore key, {A} for CTRL-A, and the double-quote " quote mode used for programmable cursor control and insertion.

## Notation
- Braces { } enclose special characters or actions:
  - {DOWN} = press the cursor down key.
  - {5 SPACES} = press the space bar five times.
- Repeats: a leading number indicates repetition: {10 _N_} means press the (shifted) N key ten times.
- Underlining denotes a shifted key (hold SHIFT while pressing the key). Example: _S_ means SHIFT+S (appears as the heart symbol on a C64).
- Special brackets [<>] mean hold the Commodore key (lower-left key) while pressing the enclosed key. A leading number repeats that combination.
- Solitary letters in braces are control characters (hold CTRL while typing the letter). Example: {A} = CTRL-A.

## Quote mode
- Enter quote mode by typing the quote character (double quote, SHIFT-2). In quote mode cursor-control keys insert their control codes (used for program-controlled cursor movement and screen control).
- While in quote mode, moving the cursor left/right/up/down via the CRSR keys produces visible control-symbols (e.g., reverse-video glyphs) rather than moving the cursor interactively.
- The DEL key is the only editing key that is not programmable; DEL still functions to backspace and edit a line while in quote mode.
- Exit quote mode by typing another quote or, most simply, by pressing RETURN. Inserting spaces into a line (INSerT spaces) also places you into quote mode.

## References
- "appendix_b_cursor_and_color_control_table" — expands on the table showing how to type cursor and color control keys