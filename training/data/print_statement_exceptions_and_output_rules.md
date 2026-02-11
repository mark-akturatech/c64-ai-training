# PRINT statement — continuation rules and spacing exceptions (C64 BASIC)

**Summary:** Rules for Commodore 64 BASIC PRINT concerning numeric-item spacing (numeric items get a trailing space; positive numbers are prefixed with a space), the effect of blanks versus punctuation (semicolon/comma) between items, trailing comma/semicolon line-continuation behavior, automatic CR/LF when list ends with no punctuation, and wrapping when output exceeds 40 columns.

## Behavior details
- Two numeric-format exceptions:
  1) A numeric item printed by PRINT is followed by an added space (a single space is output after numeric items).  
  2) Positive numeric values are printed with a leading space (a single space precedes positive numbers).

- Blanks (literal spaces) used between tokens:
  - A blank (or no punctuation) between two string constants or between string constants and variable names is treated as if a semicolon were present (i.e., it suppresses the automatic CR/LF and allows continuation on the same output line).
  - A blank placed between a string and a numeric item, or between two numeric items, does not act as a semicolon: it halts output and the second numeric item is not printed.

- Trailing punctuation behavior:
  - If the output-list ends with a comma or a semicolon, the next PRINT begins printing on the same line; spacing between items is handled "accordingly" by the interpreter.
  - If the output-list ends with no punctuation, the interpreter prints a carriage-return and line-feed (CR/LF) at the end of the data; the next PRINT begins on the following line.

- Screen width and wrapping:
  - When output is directed to the screen and printed data exceeds 40 columns, the output continues on the next screen line (automatic wrap to the following display row).

- Commentary:
  - The PRINT statement on the C64 BASIC is unusually rich in symbols, functions, and parameters; it has wide variety and complexity compared with other BASIC statements.

## References
- "print_statement_overview_part1" — introductory PRINT semantics
- "print_statement_examples" — example PRINT outputs demonstrating these rules
