# DEF FN — User-Defined Functions in C64 BASIC

**Summary:** DEF FN defines a user function in Commodore 64 BASIC using the syntax DEF FN <name>(<variable>) = <expression>; function names are FN plus a 1–2 character identifier and DEF must execute once before the function is used (otherwise UNDEF'D FUNCTION error).

## Syntax
DEF FN <name> ( <variable> ) = <expression>

- <name> is written as FN followed by a 1–2 character identifier (see Naming rules).
- <variable> is a single variable name used inside the expression (optional to reference).
- <expression> is any mathematical formula acceptable to BASIC.

## Naming rules
- Function name format: FN + identifier.
- Identifier length: 1 or 2 characters.
- First character of the identifier must be a letter.
- Second character (if present) may be a letter or a digit.
- Example valid names: FNA, FNAA, FNA9 (but note identifier length limit).

## Execution rules and behavior
- The DEF statement must be executed at least once before calling the function. Calling a user function before its DEF has executed produces the runtime error: UNDEF'D FUNCTION.
- Once a DEF FN statement has executed, subsequent executions of the same DEF are ignored (the definition is already stored).
- When called, the function name is used like a numeric variable; its value is computed automatically from the expression.
- The argument supplied in parentheses at call time is used only if the function expression references the parameter variable. If the parameter is not used in the definition, the argument has no effect (the result depends solely on the expression's other variables/constants).

## Examples
(Examples are provided below in the Source Code section; these demonstrate defining functions and calling them. Note: the examples include cases where the parameter is unused and where it is used.)

## Source Code
```basic
10 DEF FN A(X)=X+7
20 DEF FN AA(X)=Y*Z
30 DEF FN A9(Q)=INT(RND(1)*Q+1)

40 PRINT FN A(9)
50 R=FN AA(9)
60 G=G+FN A9(10)
```

- Line 20 (DEF FN AA) defines a function that does not use its parameter X; calls like FN AA(9) ignore the 9 and return Y*Z.
- Line 30 uses INT and RND(1) to build a function that does use its parameter Q.

## References
- "fn_function_reference" — expands on calling a user-defined FN after DEF