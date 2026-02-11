# FN <name>(<number>) — call user-defined function (DEF FN)

**Summary:** FN calls a previously DEFined user function (DEF FN) and returns a numeric value; syntax FN <name>(<number>). If the named DEF FN has not been executed, an UNDEF'D FUNCTION error occurs; FN may be used in expressions, PRINT, IF and other control flow (direct mode allowed).

## Description
Type: Function — numeric.

Format: FN <name> ( <number> )

Action:
- References a previously executed DEF FN definition by name.
- Substitutes the supplied numeric expression into the function's parameter (if the definition expects one) and evaluates the formula.
- Returns the numeric result of that evaluation.
- Can be used in direct mode (the DEF FN must already have been executed in the current session).
- If the named DEF FN has not been defined, the interpreter raises UNDEF'D FUNCTION.

Usage contexts (examples shown in Source Code):
- In PRINT and other expressions: PRINT FN A(Q)
- Combined in arithmetic expressions: J = FN J(7) + FN J(9)
- In control flow / boolean tests: IF FN B7 (1+1) = 6 THEN END

## Source Code
```basic
PRINT FN A(Q)
1100 J = FN J(7)+ FN J(9)
9990 IF FN B7 (1+1)= 6 THEN END
```

## References
- "def_fn_user_defined_functions" — expands on DEF FN to create user-defined functions