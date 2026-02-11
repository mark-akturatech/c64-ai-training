# String constants (Commodore 64 BASIC)

**Summary:** Rules for BASIC string constants on the C64: may contain letters, digits, blanks, punctuation and control characters up to the available 80-character line space; the double-quote (") cannot appear inside a quoted string — use CHR$(34) to insert a quote. Null (empty) strings are allowed.

## String constant rules
- A string constant is any sequence of characters enclosed in double quotes and may include blanks, letters, numbers, punctuation, commas, and control characters (for example, color or cursor control codes).
- Maximum length is limited by the space available on an 80-character line (i.e., the characters remaining after the line number and other required parts of the statement).
- The double-quote mark (") cannot be typed directly inside a quoted string because quotes delimit the string. To produce a quote character inside a string, use CHR$(34).
- A string may be empty (null string), written as "".
- You may omit the ending quote mark if the string is the last item on a line or if it is immediately followed by a colon (:).

## Source Code
```basic
""               (a null string)
"HELLO"
"$25,000.00"
"NUMBER OF EMPLOYEES"

REM NOTE: Use CHR$(34) to include quotes (") in strings.
```

## References
- "chr$_function" — expands on CHR$ function to create characters by code (e.g., CHR$(34) for the double-quote character)