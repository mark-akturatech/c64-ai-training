# FN name(number) — user-defined function (BASIC)

**Summary:** FN name(number) (Commodore BASIC DEF FN) calls a previously DEFined formula by substituting the numeric argument into the formula; calling an FN before its DEFinition generates an UNDEF'D FUNCTION error. Terms: DEF, FN, UNDEF'D FUNCTION, argument substitution.

## Description
- DEF FN creates a single user-defined numeric function by assigning an expression to an FN name (the definition must appear earlier in the program or listing than any call).
- Calling FNname(expr) evaluates the expression by substituting the numeric argument into the parameter symbol used in the DEF (the parameter is a local placeholder inside the formula).
- If the program attempts to call an FN that has not yet been DEFined (no prior DEF FN line), the interpreter reports an error: UNDEF'D FUNCTION (the call must follow the DEF line).
- FN calls may appear in PRINT, LET, IF, FOR, and other expression contexts (they are evaluated as numeric expressions).
- The argument is passed by value (the expression in the call is evaluated, and that numeric result is substituted into the formula).

## Source Code
```basic
10 REM Example 1: define then call
20 DEF FNS(A)=A*A+1      : REM FNS(x) = x^2 + 1
30 PRINT FNS(4)          : REM prints 17
40 PRINT FNS(2+3)        : REM prints 26 (argument expression evaluated first)

100 REM Example 2: using FN in an expression
110 DEF FNT(X)=2*X-5     : REM FNT(x) = 2x - 5
120 LET V = FNT(10)      : REM V becomes 15
130 PRINT V

200 REM Example 3: calling before definition (error)
210 PRINT FNU(3)         : REM UNDEF'D FUNCTION error if no DEF FNU earlier
220 DEF FNU(N)=N/2
230 REM After the DEF the function could be used without error
240 PRINT FNU(6)          : REM prints 3
```

## References
- "def_statement" — expands on DEF to define FN functions
