# INT (numeric) — BASIC function

**Summary:** INT(<numeric>) returns the integer value of a numeric expression in Commodore BASIC: for positive numbers it removes the fractional part (truncation), for negative numbers any fractional part causes the result to be the next lower integer (floor). Syntax: INT (<numeric>).

## Description
Action: Returns the integer value of the expression.

- Positive inputs: the fractional part is discarded (e.g., INT(99.4343) → 99).
- Negative inputs: any non-zero fractional part causes the result to be the next lower integer (e.g., INT(-12.34) → -13).
- Syntax: INT(<numeric>) — accepts any numeric expression.

Example behavior is shown below.

## Source Code
```basic
120 PRINT INT(99.4343), INT(-12.34)

 99       -13
```

## References
- "BASIC function reference" — INT function description