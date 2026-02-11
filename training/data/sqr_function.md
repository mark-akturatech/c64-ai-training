# SQR (BASIC function)

**Summary:** SQR — Commodore 64 BASIC floating-point function that returns the square root of a numeric argument. Usage: SQR(<numeric>). Argument must be non-negative or the error ?ILLEGAL QUANTITY occurs.

**Description**
SQR evaluates the non-negative square root of its numeric argument and returns a floating-point result. If the argument is negative, BASIC raises the error message ?ILLEGAL QUANTITY. The function is used in expressions (e.g., PRINT SQR(x)) and accepts any numeric expression that evaluates to a non-negative value.

Type: Floating-Point Function  
Format: SQR(<numeric>)

Example behavior: with an argument J*5 the function returns the square root of that product; output shows typical floating-point decimal representation (sample shows 8 digits after the decimal for non-integer results).

## Source Code
```basic
10 S = 5
20 FOR J = 2 TO 5: PRINT J*S, SQR(J*5): NEXT
```

Sample console output:
```text
10   3.16227766
15   3.87298335
20   4.47213595
25   5

READY
```

## References
- "SQR(numeric) - BASIC" — example and error behavior