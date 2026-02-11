# TAN (numeric)

**Summary:** TAN is a Commodore 64 BASIC floating-point function that returns the tangent of a numeric expression in radians. If the computed tangent overflows the floating-point range, BASIC reports the error ?DIVISION BY ZERO.

**Description**
TAN(<numeric>) — returns the tangent of <numeric>, where <numeric> is interpreted in radians. The function is a floating-point operation provided by Commodore 64 BASIC. If the computed tangent overflows the floating-point range, BASIC reports the error ?DIVISION BY ZERO.

Example behavior: TAN(0.785398163) returns 1 (tangent of π/4).

## Source Code
```basic
10 XX=.785398163: YY=TAN(XX):PRINT YY
```
Output:
```text
1
```

## References
- "sin_function" — expands on SIN and COS related trigonometric functions
