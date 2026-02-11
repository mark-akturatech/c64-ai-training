# Other special reversed characters usable inside quotes

**Summary:** How to embed reversed-mode control characters inside quoted text on the C64: use spaces, press RETURN or SHIFT+RETURN, move back with the cursor, enable reverse-mode (RVS ON), and type the listed reversed-character keys (e.g., SHIFT+M, N, SHIFT+N, H, I). Searchable terms: RVS ON, SHIFT+RETURN, quote mode, reversed characters.

**Embedding reversed characters in quotes**

To insert special control characters (reversed-mode characters) inside a quoted string:

- Leave empty space(s) at the position where the special character should appear.
- Press RETURN (or SHIFT+RETURN) to accept the line, then move the cursor back to the blank positions with the cursor keys.
- Press RVS ON to enter reversed-character typing mode.
- Type the key listed for the desired function (see mapping below). The keypress in reversed mode inserts the corresponding control character into the quote.

Functions available via reversed-character keys:

- SHIFT+M (typed while RVS ON) inserts the SHIFT+RETURN control in the quoted text.
- N (typed while RVS ON) switches to lower-case.
- SHIFT+N (typed while RVS ON) switches to upper-case.
- H (typed while RVS ON) disables the case-switching keys.
- I (typed while RVS ON) enables the case-switching keys.

Do not forget to exit reversed mode when finished (press RVS OFF or whatever the normal toggle key is on your setup).

## Source Code

```text
    Function                    Type               Appears As

<SHIFT+RETURN>                  <SHIFT+M>          
switch to lower case            <N>                
switch to upper case            <SHIFT+N>          
disable case-switching keys     <H>                
enable case-switching keys      <I>                
```

## References

- "quote_mode_insert_mode_part2_and_warning" — practical considerations and warnings when embedding special control characters
- "quote_mode_color_controls_list_and_example" — other quote-mode control sequences (color and video)
