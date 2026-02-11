# First Hexadecimal Digit — ASCII 0x00–0x7F lookup chart

**Summary:** Compact visual lookup for 7-bit ASCII (hex 0x00–0x7F) showing control names and printable glyphs; columns are the first (high) hex digit (0–7) and rows are the second (low) hex digit (0–F). Useful for interpreting ASCII/PETSCII code layouts, control codes, and byte values (e.g., 0x20, 0x41, 0x7F).

## Chart layout
- Columns across the top are the first (high) hexadecimal digit (0–7).  
- Rows down the left are the second (low) hexadecimal digit (0–F).  
- Intersection of column and row gives the character name or glyph for that byte value.

Examples:
- 0x00 = NUL (column 0, row 0)
- 0x0A = LF  (column 0, row A)
- 0x20 = SP  (column 2, row 0)
- 0x41 = A   (column 4, row 1)
- 0x7F = DEL (column 7, row F)

Note: entries include control-code names (NUL, SOH, LF, CR, DEL, etc.) and printable characters. (PETSCII on the Commodore 64 uses different graphic mappings for some codes; this chart shows 7-bit ASCII.)

## Source Code
```text
                             First Hexadecimal Digit

                          +---+---+---+---+---+---+---+---+
                          | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
                      +---+---+---+---+---+---+---+---+---+
                      | 0 |NUL|DLE|SP | 0 | @ | P | ` | p |
                      +---+---+---+---+---+---+---+---+---+
                    S | 1 |SOH|DC1| ! | 1 | A | Q | a | q |
                    e +---+---+---+---+---+---+---+---+---+
                    c | 2 |STX|DC2| " | 2 | B | R | b | r |
                    o +---+---+---+---+---+---+---+---+---+
                    n | 3 |ETX|DC3| # | 3 | C | S | c | s |
                    d +---+---+---+---+---+---+---+---+---+
                      | 4 |EOT|DC4| $ | 4 | D | T | d | t |
                    H +---+---+---+---+---+---+---+---+---+
                    e | 5 |ENQ|NAK| % | 5 | E | U | e | u |
                    x +---+---+---+---+---+---+---+---+---+
                    a | 6 |ACK|SYN| & | 6 | F | V | f | v |
                    d +---+---+---+---+---+---+---+---+---+
                    e | 7 |BEL|ETB| ' | 7 | G | W | g | w |
                    c +---+---+---+---+---+---+---+---+---+
                    i | 8 |BS |CAN| ( | 8 | H | X | h | x |
                    m +---+---+---+---+---+---+---+---+---+
                    a | 9 |HT |EM | ) | 9 | I | Y | i | y |
                    l +---+---+---+---+---+---+---+---+---+
                      | A |LF |SUB| * | : | J | Z | j | z |
                    D +---+---+---+---+---+---+---+---+---+
                    i | B |VT |ESC| + | ; | K | [ | k | { |
                    g +---+---+---+---+---+---+---+---+---+
                    i | C |FF |FS | , | < | L | \ | l | | |
                    t +---+---+---+---+---+---+---+---+---+
                      | D |CR |GS | - | = | M | ] | m | } |
                      +---+---+---+---+---+---+---+---+---+
                      | E |SO |RS | . | > | N | ^ | n | ~ |
                      +---+---+---+---+---+---+---+---+---+
                      | F |SI |US | / | ? | O | _ | o |DEL|
                      +---+---+---+---+---+---+---+---+---+
```

## References
- "MACHINE - First Hexadecimal Digit chart" — ASCII 0x00–0x7F mapping (control names and printable glyphs)