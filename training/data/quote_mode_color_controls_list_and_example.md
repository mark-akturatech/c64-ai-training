# C64 Quote-Mode Color Control (CTRL/C= keys)

**Summary:** Mapping of quote-mode control keys (CTRL+1..8 and C=+1..+8) to on-screen colors for embedded PETSCII control characters inside quoted strings (quote-mode). Shows exact key → color mapping and a BASIC example using PRINT with embedded color controls.

## Description
In Commodore 64 quote-mode (embedding control characters inside string literals), pressing CTRL+1..CTRL+8 or C=+1..C=+8 inserts PETSCII control characters that change the text color that follows inside the same quoted string. CTRL+1..8 select the primary color set; the Commodore key (C=) plus 1..8 selects the alternate color palette. Use these key combinations directly while typing the string in the BASIC editor or include the resulting control characters programmatically.

Example usage: include the control character inside the quoted string passed to PRINT so subsequent characters use that color (quote-mode: control characters interpreted inside quotes).

## Source Code
```text
   KEY           COLOR                APPEARS AS

   <CTRL+1>         Black
   <CTRL+2>         White
   <CTRL+3>         Red
   <CTRL+4>         Cyan
   <CTRL+5>         Purple
   <CTRL+6>         Green
   <CTRL+7>         Blue
   <CTRL+8>         Yellow
   <C=+1>           Orange
   <C=+2>           Brown
   <C=+3>           Light Red
   <C=+4>           Grey 1
   <C=+5>           Grey 2
   <C=+6>           Light Green
   <C=+7>           Light Blue
   <C=+8>           Grey 3
```

```basic
10 PRINT "<CTRL+4>HELLO <CTRL+2>THERE"
```

## References
- "quote_mode_reverse_characters" — reverse-character technique related to color control encoding
- "quote_mode_insert_mode_part1" — insert mode interactions with reversed characters inside quotes
