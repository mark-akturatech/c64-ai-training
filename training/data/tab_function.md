# TAB(numeric) — BASIC TAB function (C64)

**Summary:** TAB(numeric) is a C64 BASIC string function that moves the PRINT cursor to a relative column on the current logical line (range 0–255); it only affects PRINT and has no effect with PRINT# (logical file). See "spc_function" for SPC vs TAB spacing differences.

## Description
TYPE: String Function  
FORMAT: TAB(<numeric>)

Action: The TAB function moves the cursor to a relative screen position on the current logical line, measured from the left-most position of that line. The numeric argument may be 0–255. TAB only takes effect when used with the PRINT statement; using TAB with PRINT# (output to a logical file) has no effect.

## Source Code
```basic
100 PRINT "NAME" TAB(25) "AMOUNT": PRINT
110 INPUT#1, NAM$, AMT$
120 PRINT NAM$ TAB(25) AMT$

REM Output example (columns produced by TAB):

NAME                         AMOUNT


G.T. JONES                   25.
```

## References
- "spc_function" — SPC vs TAB spacing functions