# COMMODORE 64 - SIN(numeric)

**Summary:** SIN is a Commodore 64 BASIC floating-point function that returns the sine of a numeric argument in radians. Searchable terms: SIN, radians, COS relationship (COS(x) = SIN(x + π/2)), BASIC example.

## Description
TYPE: Floating-Point Function

FORMAT: SIN(<numeric>)

Action: Returns the sine of the <numeric> argument, in radians. The source notes the relation COS(x) = SIN(x + 3.14159265/2) (π ≈ 3.14159265).

Example behavior: calling SIN with a numeric literal or numeric expression evaluates the sine and returns a floating-point value.

## Source Code
```basic
235 AA=SIN(1.5):PRINT AA
 .997494987
```

## References
- "tan_function" — expands on TAN and its relation to SIN/COS
