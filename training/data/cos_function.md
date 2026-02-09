# COS (BASIC function)

**Summary:** COS is a Commodore 64 BASIC function that returns the cosine of a numeric expression (angle in radians). Usage examples include converting degrees to radians with COS(Y*{pi}/180).

## Description
TYPE: Function  
FORMAT: COS(<number>)

Action: Returns the cosine of <number>, where <number> is an angle expressed in radians. In examples the token {pi} denotes the constant π (pi).

## Source Code
```basic
10 PRINT COS(0)
20 X = COS(Y* {pi} /180) : REM CONVERT DEGREES TO RADIANS
```

## References
- "sin_and_trig_functions" — expands on other trig functions such as SIN, TAN