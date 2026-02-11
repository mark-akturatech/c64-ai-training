# ABS

**Summary:** ABS is a BASIC numeric function on the Commodore 64: ABS(<expression>) returns the absolute value of a numeric expression. Searchable terms: ABS, ABS(<expression>), BASIC function.

## Description
Type: Function — Numeric  
Format: ABS(<expression>)

Action: Returns the absolute value of the number (the value without any sign). The absolute value of a negative number is that number multiplied by -1.

## Source Code
```basic
10 X = ABS (Y)
10 PRINT ABS (X*J)
10 IF X = ABS (X) THEN PRINT "POSITIVE"
```

## References
- "abs_function" — expands on ABS examples and use