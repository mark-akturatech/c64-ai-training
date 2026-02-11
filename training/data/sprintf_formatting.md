# .SPRINTF

**Summary:** .sprintf — ca65 builtin printf-style formatter that takes a format string as the first argument and returns a string; supports standard printf-style conversion specifiers but lacks length modifiers and variable field width.

## Description
.sprintf is a ca65 assembler builtin function that formats text using a printf-like format string. The first argument must be the format string; subsequent arguments depend on the conversion specifiers used in that format string. The function returns its result as a string (usable where ca65 expects string operands).

Limitations vs C printf:
- Length modifiers are not supported (no h, l, ll, etc.).
- Variable width (using * for field width or precision) is not supported.

Typical use is for generating identifiers, labels, or formatted constant strings at assembly time.

## Source Code
```asm
        num     = 3

        ; Generate an identifier:
        .ident (.sprintf ("%s%03d", "label", num)):
```

## References
- "identifier_generation" — related usage of .sprintf for generating identifiers (example in this section)
