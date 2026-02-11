# Reverse characters (quote-mode)

**Summary:** Holding CTRL+9 inserts a reversed-character marker `<R>` inside quotes to start reverse-video (negative display) while printing in quote-mode; reverse printing is ended by CTRL+0, by printing a RETURN (CHR$(13)), or by terminating the PRINT without a trailing semicolon or comma.

## Reverse characters
Holding <CTRL> and pressing <9> will place the reversed-character `<R>` inside the quoted string in quote-mode. Once `<R>` is present, subsequent characters print in reverse video (a negative display). Reverse printing stops when one of the following occurs:
- Press <CTRL+0>.
- PRINT a RETURN character (CHR$(13)).
- End the PRINT statement without a trailing semicolon or comma (that is, finish the PRINT so it outputs a newline).

The `<R>` marker acts as an in-quote control character that toggles reverse-video output for following characters until one of the termination conditions above is met.

## References
- "quote_mode_overview_and_cursor_movement" — related quote-mode cursor-control programming  
- "quote_mode_color_controls_intro" — related color-control techniques in quote mode