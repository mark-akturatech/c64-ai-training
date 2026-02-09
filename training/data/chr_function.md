# CHR$(<number>)

**Summary:** CHR$ converts a Commodore/PET (CBM) character code (0..255) to a one-byte string containing that PET/CBM character. Use with ASC to convert back and forth between character codes and strings; out-of-range values produce ?ILLEGAL QUANTITY.

## Description
TYPE: Function — returns a String.

FORMAT: CHR$(<number>)

Action: Returns a one-character string containing the PET/CBM character corresponding to the numeric code (0 through 255). The numeric argument must be between 0 and 255 inclusive; providing a value outside this range results in the runtime error message "?ILLEGAL QUANTITY". See the PET/CBM character table (Appendix C) for code-to-glyph mappings (e.g. CHR$(65) yields the character 'A', CHR$(13) yields a RETURN).

ASC is the complementary function that returns the numeric code for a one-character string (used to convert characters back to their numeric codes).

## Source Code
```basic
10 PRINT CHR$(65) : REM 65 = UPPER CASE A
20 A$=CHR$(13) : REM 13 = RETURN KEY
50 A=ASC(A$) : A$ = CHR$(A) : REM CONVERTS TO C64 ASCII CODE AND BACK
```

## References
- "asc_function" — expands on ASC returns numeric codes used by CHR$