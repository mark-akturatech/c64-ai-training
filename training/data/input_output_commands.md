# Commodore 64 BASIC — INPUT/OUTPUT and DATA Statements

**Summary:** Describes BASIC I/O and DATA handling: INPUT (prompting with ? or custom prompt), GET (single-character input), DATA/READ/RESTORE for literal constants, and PRINT field formatting using ";" (suppress space) and "," (tab to next field).

## Commands
- INPUT A$ or INPUT A  
  - Prints "?" and waits for user entry. INPUT A$ accepts a string; INPUT A accepts a numeric value (expression).
- INPUT "prompt";A or INPUT "prompt";A$  
  - Prints the prompt string (no trailing space when using ";") and waits for user input. Can read either numeric or string into the specified variable.
- GET A$ or GET A  
  - Waits for the user to type a single character; no RETURN required. Assigns that character to A$ or the ASCII code to A (depending on usage).
- DATA A,"B",C  
  - Defines a list of literal constants embedded in the program for subsequent READ operations.
- READ A$ or READ A  
  - Retrieves the next value from the DATA list and assigns it to the named variable.
- RESTORE  
  - Resets the DATA pointer so subsequent READs begin again from the first DATA item.
- PRINT "A= ";A  
  - Prints the literal string "A=" followed immediately by the value of A; the semicolon suppresses the normal inter-item space.
- PRINT with ","  
  - Using a comma between printed items tabs to the next field (moves to the next print zone).

Notes:
- The semicolon at the end of a PRINT statement also suppresses the trailing newline, allowing subsequent PRINT output to continue on the same line.
- GET differs from INPUT by not requiring RETURN and by returning immediately after a single keystroke.

## Source Code
```basic
10 INPUT A$
20 INPUT A
30 INPUT "ABC";A
40 GET A$
50 GET A
60 DATA 10,"B",30
70 READ X$
80 READ Y
90 RESTORE
100 PRINT "A= ";A
110 PRINT "A= ",A
``` 

## References
- "arrays_and_string_functions" — expands on string functions used when processing user input and printing
- "program_flow_statements" — expands on control-flow constructs that use input/output in program logic