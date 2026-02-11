# SGN (numeric)

**Summary:** SGN is a Commodore 64 BASIC integer function that returns -1, 0, or 1 depending on the sign of its numeric argument; usage: SGN(<numeric>).

## Description
TYPE: Integer Function  
FORMAT: SGN (<numeric>)

Action: SGN evaluates the numeric argument and returns an integer indicating its sign: 1 if the argument is positive, 0 if the argument is zero, and -1 if the argument is negative. The argument may be any numeric expression (numeric variable, literal, or expression). The return value is suitable for use in arithmetic expressions, IF/THEN comparisons, or branch constructs like ON ... GOTO.

Example usage shown in the source demonstrates combining SGN with ON ... GOTO to branch based on sign.

## Source Code
```basic
90 ON SGN(DV)+2 GOTO 100,200,300
REM (jump to 100 if DV = negative, 200 if DV = 0, 300 if DV = positive)
```

## References
- "BASIC functions" — SGN described as integer sign function