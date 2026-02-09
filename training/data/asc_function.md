# ASC(<string>)

**Summary:** ASC is a Function‑Numeric that returns the Commodore ASCII code (0..255) of the first character of a string; raises ?ILLEGAL QUANTITY if the string is empty. Use CHR$(0) as a safe sentinel (CHR$ returns a character from a numeric code).

## Description
Format: ASC(<string>)

Action: ASC returns an integer 0–255 corresponding to the Commodore ASCII value of the first character in the supplied string (see Appendix C for the full code table). If the string is empty, the function triggers a ?ILLEGAL QUANTITY error. Many input routines (GET, GET#) read a CHR$(0) as a null character; appending CHR$(0) to a possibly empty string prevents the error by ensuring at least one character is present. ASC ignores any characters beyond the first — only the first character's code is returned.

## Source Code
```basic
10 PRINT ASC("Z")
20 X = ASC("ZEBRA")
30 J = ASC(J$)

' Avoid ILLEGAL QUANTITY when J$ may be empty:
30 J = ASC(J$ + CHR$(0))
```

## References
- "chr$_function" — CHR$ usage and creating characters by code (e.g., CHR$(0))