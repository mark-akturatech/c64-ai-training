# COMMODORE 64 — Chapter 6: Input/Output Guide (Output to TV / PRINT basics)

**Summary:** Describes BASIC output to the TV using the PRINT statement, printable/control character behavior (CHR$ values, e.g. RETURN = CHR$13), and cursor-positioning functions TAB and SPC. Covers PRINT punctuation semantics (semicolon behavior) and references the character-code table in Appendix C.

## Output to TV
PRINT is the BASIC statement that sends text to the TV screen (the display device). Format and placement of text are controlled by character codes and BASIC functions; the visual result is what the human operator interprets.

- Use formatting (colors, placement, upper/lower case, and PETSCII graphics) to make output readable.
- Control character codes embedded in PRINT affect cursor movement, cleared screen, color changes, and insertion/deletion of spaces (see Appendix C for the full code table).
- The RETURN (ENTER) key corresponds to CHR$13.

## Control characters and PRINT punctuation
- <CRSR> key (cursor-control character): does not display a visible glyph; it moves the cursor position (cursor control via PETSCII).
- TAB(n): positions the cursor at column n (counting from the left edge of the screen).
- SPC(n): advances the cursor right n spaces from its current position.
- Semicolon (;) in PRINT:
  - Separates two items without inserting an extra space.
  - If placed at the end of a PRINT line it suppresses the newline — the cursor remains after the last printed character instead of advancing to the next line.
- Character-code table and additional control codes are listed in Appendix C (not included here).

## References
- "output_to_tv_section" — expands on Output to TV (chapter content)
- "rs232_interface_description" — expands on RS-232 interface (later in chapter)
