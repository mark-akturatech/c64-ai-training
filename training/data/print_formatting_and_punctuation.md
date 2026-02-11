# PRINT punctuation, character-set switching, and printer control codes (C64 BASIC)

**Summary:** How BASIC PRINT punctuation (semicolon, comma, quotes) affects output formatting on the C64; CHR$ control codes for character-set switching and printer control (e.g. CHR$(17), CHR$(145), CHR$(10), CHR$(13)); behavior of logical lines vs. screen lines and the line-link table.

## PRINT punctuation behavior
- Semicolon (;) after a PRINTed expression suppresses the automatic RETURN (no newline) and does not insert a space between subsequent items. It therefore concatenates output on the same logical line.
- Comma (,) separates output into tabbed columns. On the C64 this produces four columns of 10 characters each (column widths: 10 chars). A trailing comma (i.e. comma as the last print separator) can also suppress the automatic RETURN.
- Quote marks (") delimit literal text in PRINT statements; everything between matching quotes is printed verbatim (except for embedded CHR$ sequences expressed via concatenation).
- RETURN (the concept in BASIC) moves to the next logical BASIC line. Logical BASIC lines can span multiple screen lines; the mapping between logical lines and physical screen lines is maintained in the line link table in screen memory.

## Character-set switching during PRINT
- You can PRINT characters that change the active character set by outputting their CHR$ value. The character codes for switching character sets are printed like any other character.
- When working with one character set, individual PRINTed lines can temporarily switch to the other set by sending the appropriate control character:
  - CHR$(17) — cursor-down character: switches from upper/graphics to upper+lower case set.
  - CHR$(145) — cursor-up character: switches from upper+lower case to upper/graphics set.
- These control characters affect the interpretation of subsequent bytes sent to the screen or printer until another switch code or reset is encountered.

## Printer control characters (summary)
- The printer accepts control codes printed like ordinary characters; specific values begin/end printer modes (double-width, reverse), control tab/positioning, and support graphics modes. See the Source Code section for the full table of CHR$ values and purposes.

## Logical lines, screen lines, and the line link table
- A BASIC logical line may occupy one or more physical screen lines. The screen memory stores text and an associated line-link table that chains logical lines across screen rows.
- For details about the screen memory layout and exact line-link table addresses, see the referenced memory_map_part3_screen_video_rom_ram documentation.

## Source Code
```basic
OPEN 1,4: REM UPPER CASE/GRAPHICS
OPEN 1,4,7: REM UPPER AND LOWER CASE
```

```text
TABLE of Printer Control Character Codes:
+----------+------------------------------------------------------------+
| CHR$ CODE|                         PURPOSE                            |
+----------+------------------------------------------------------------+
|    10    |   Line feed                                                |
|    13    |   RETURN (automatic line feed on CBM printers)             |
|    14    |   Begin double-width character mode                        |
|    15    |   End double-width character mode                          |
|    18    |   Begin reverse character mode                             |
|   146    |   End reverse character mode                               |
|    17    |   Switch to upper/lower case character set                 |
|   145    |   Switch to upper case/graphics character set              |
|    16    |   Tab to position in next 2 characters                     |
|    27    |   Move to specified dot position                           |
|     8    |   Begin dot-programmable graphic mode                      |
|    26    |   Repeat graphics data                                     |
+----------+------------------------------------------------------------+
```

## References
- "memory_map_part3_screen_video_rom_ram" — expands on Screen memory and line link table location
