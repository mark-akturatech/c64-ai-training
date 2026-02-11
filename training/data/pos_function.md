# POS (dummy) — returns current cursor position (0–79 logical columns)

**Summary:** POS(dummy) is a Commodore 64 BASIC integer function that returns the current cursor position (0–79 logical columns). On the 40-column C64 screen, positions 40–79 map to the second physical screen line; the dummy argument is ignored. Searchable terms: POS, CHR$, cursor position, 40-column screen, 80 logical columns.

## Description
TYPE: Integer Function  
FORMAT: POS(<dummy>)

Action: Returns the current cursor position as an integer from 0 (leftmost) to 79 (rightmost of an 80-character logical line). Because the C64 hardware displays 40 columns, positions 0–39 correspond to the first physical line and positions 40–79 correspond to the second physical line of the 40-column display. The numeric argument is ignored (present only for syntactic compatibility).

Typical use: check horizontal position before printing to avoid wrapping or to conditionally emit a carriage return (CHR$(13)).

## Source Code
```basic
1000 IF POS(0)>38 THEN PRINT CHR$(13)
```

## References
- "print_statement" — expands on POS usage in arranging printed output
