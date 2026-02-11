# GET# (BASIC I/O statement)

**Summary:** GET# reads characters one-at-a-time from an open device or file (GET-like input from non-keyboard sources). Key terms: GET#, device/file number, OPEN, device #3 (screen), CHR$(13), variable list.

## Description
TYPE: I/O statement  
FORMAT: GET# <file number>, <variable list>

- Action: Reads characters one at a time from the specified open device or file. Functionally equivalent to GET (keyboard input), except the source is the opened device/file.
- Return values: If no character is received, the target variable is set to an empty string ("") for string variables or 0 for numeric variables.
- Separators: Characters normally used to separate data in files (for example a comma , or the RETURN key code, ASCII 13) are returned as ordinary characters by GET#; they are not treated specially by the statement.
- Device #3 (TV/screen) behavior: When used with device number 3, GET# reads characters from the screen buffer one by one. Each GET# advances the cursor one position to the right. The character at the logical end of the line is changed to CHR$(13) (the RETURN key code).
- Requirements: The device/file must be OPENed before using GET# (see "open_statement").

## Source Code
```basic
5 GET#1, A$
10 OPEN 1,3: GET#1, Z7$
20 GET#1, A, B, C$, D$
```

## References
- "open_statement" — must OPEN a file/device before using GET#
- "print_hash" — related I/O statements PRINT# and INPUT#