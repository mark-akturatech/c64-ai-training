# EXP (function)

**Summary:** EXP(number) — BASIC numeric function returning e^number (e ≈ 2.71828183); raises ?OVERFLOW for arguments > 88.0296919. Used in Commodore 64 BASIC expressions and assignments.

## Description
Type: Function — Numeric.  
Format: EXP(<number>)

Action: Calculates e (the mathematical constant, approximately 2.71828183) raised to the power of the supplied numeric argument. If the argument is greater than 88.0296919 the interpreter produces a ?OVERFLOW error.

Return: numeric value (floating-point).

Examples of valid use: as a direct print expression or as part of an assignment/expression.

## Source Code
```basic
10 PRINT EXP(1)
20 X = Y * EXP(Z * Q)
```

## References
- "log_function" — natural logarithm (inverse of EXP)