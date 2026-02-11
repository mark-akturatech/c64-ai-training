# COMMODORE 64 - Three concrete PRINT examples showing numeric and string printing, punctuation effects, concatenation/spacing, and resulting screen output examples.

**Summary:** Three small BASIC examples demonstrating PRINT with commas, semicolons, adjacency and string-variable concatenation on the C64; shows how punctuation affects spacing, line continuation, and concatenation (PRINT, ;, ,, string concatenation).

## Examples
1) Numeric fields with commas
- Program:
  - 5 X = 5
  - 10 PRINT -5*X,X-5,X+5,X^5
- Observed effect: multiple numeric expressions separated by commas are printed with column spacing between them (aligned into print zones).
- Resulting screen output (one line):
  - -25     0     10     3125

2) Semicolon line-continuation and mixed numeric/string printing
- Program:
  - 5 X=9
  - 10 PRINT X;"SQUARED IS";X*X;"AND";
  - 20 PRINT X "CUBED IS" X^3
- Observed effects:
  - The semicolon at the end of line 10 prevents PRINT from issuing a newline so line 20 continues on the same output line.
  - Items separated by semicolons are printed consecutively; space characters appear where the program text provides them (see line 20 below where spaces separate items).
- Resulting screen output (one line):
  - 9 SQUARED IS 81 AND 9 CUBED IS 729

3) String-variable adjacency and use of commas/semicolons
- Program:
  - 90 AA$="ALPHA":BB$="BAKER":CC$="CHARLIE":DD$="DOG":EE$="ECHO"
  - 100 PRINT AA$BB$;CC$ DD$,EE$
- Observed effects:
  - Adjacent string variables with no punctuation are concatenated directly (AA$BB$ → ALPHABAKER).
  - A semicolon before the next item prevents a newline (so CC$ and DD$ appear on same line separated only by program-provided spacing).
  - A comma causes column spacing before the following item (EE$ prints in a later column).
- Resulting screen output (one line):
  - ALPHABAKERCHARLIEDOG     ECHO

## Source Code
```basic
5 X = 5
10 PRINT -5*X,X-5,X+5,X^5
```
```text
-25     0     10     3125
```

```basic
5 X=9
10 PRINT X;"SQUARED IS";X*X;"AND";
20 PRINT X "CUBED IS" X^3
```
```text
9 SQUARED IS 81 AND 9 CUBED IS 729
```

```basic
90 AA$="ALPHA":BB$="BAKER":CC$="CHARLIE":DD$="DOG":EE$="ECHO"
100 PRINT AA$BB$;CC$ DD$,EE$
```
```text
ALPHABAKERCHARLIEDOG     ECHO
```

## References
- "print_statement_exceptions_and_output_rules" — punctuation and spacing rules for PRINT (comma/semicolon/adjacency behavior)