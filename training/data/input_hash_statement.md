# INPUT# (BASIC)

**Summary:** INPUT# is a Commodore 64 BASIC I/O statement for reading whole variables (up to 80 characters) from an already OPENed device/file. Terminators: CR (CHR$(13)), comma (,), semicolon (;), colon (:); numeric fields with non-numeric input cause BAD DATA, strings >80 cause STRING TOO LONG, and device #3 reads a whole logical line and advances the cursor.

## Description
Type: I/O statement  
Format: INPUT# <file number> , <variable list>

- Purpose: Read whole variables from an open file or device (faster than GET#, which reads one character at a time).
- Requirement: The file/device must be OPEN before using INPUT# (see OPEN statement).
- Terminators: INPUT# considers a variable finished when it reads a RETURN code (CHR$(13)), comma (,), semicolon (;), or colon (:). When writing data to a file that must include those characters, quote marks may be used when writing (see PRINT#).
- Variable types:
  - Numeric variable: If non-numeric characters are received, a BAD DATA error occurs.
  - String variable: INPUT# reads up to 80 characters; any string longer than 80 characters triggers STRING TOO LONG.
- Device #3 (the screen): INPUT# reads an entire logical line from the screen and moves the cursor down to the next line.

## Source Code
```basic
10 INPUT#1,A
20 INPUT#2,A$,B$
```

## References
- "open_statement" — explains requirement to OPEN a file/device before using INPUT#
