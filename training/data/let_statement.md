# LET (BASIC statement)

**Summary:** LET is a BASIC statement for assigning a value to a variable on the Commodore 64; the keyword LET is optional, and the format is [LET] <variable> = <expression>. It supports numeric and string variables; string concatenation uses the + operator.

**Description**
TYPE: Statement  
FORMAT: [LET] <variable> = <expression>

Action: Assigns the value of <expression> to <variable>. The LET keyword may be included for clarity but is optional (omitting LET saves memory in program listings). The equals sign (=) is sufficient to perform the assignment. The + operator concatenates string values when used with string variables (variables ending in $).

## Source Code
```basic
10 LET D = 12
20 LET E$ = "ABC"
30 F$ = "WORDS"
40 SUM$ = E$ + F$          (SUM$ would equal ABCWORDS)
```

## References
- "basic_statements" — other BASIC statement summaries (assignment, PRINT, INPUT)