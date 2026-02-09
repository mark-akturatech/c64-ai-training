# ATN

**Summary:** ATN(<number>) — Commodore 64 BASIC numeric function that returns the arctangent (radians) of a value; result range -pi/2..+pi/2. Commonly used with multiplication by 180/{pi} to convert to degrees.

## Description
TYPE: Function‑Numeric  
FORMAT: ATN(<number>)

Action: Returns the arctangent of the supplied number. The returned value is the angle in radians whose tangent equals the argument. The result is always within the range -pi/2 to +pi/2.

## Usage
- Supply any numeric expression as the argument: ATN(x).
- To convert the returned radians to degrees use multiplication by 180/{pi} (source shows {pi} as the pi symbol).

## Source Code
```basic
10 PRINT ATN(0)
20 X = ATN(J)*180/{pi} : REM CONVERT TO DEGREES
```

## References
- "abs_function" — expands on other numeric math functions (ABS, EXP, etc.)