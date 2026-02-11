# RIGHT$

**Summary:** RIGHT$ is a Commodore 64 BASIC string function that returns the rightmost N characters of a string. Syntax: RIGHT$(<string>,<numeric>); <numeric> is an integer 0–255 — 0 returns the null string "", values greater than the string length return the entire string.

## Description
TYPE: String Function  
FORMAT: RIGHT$(<string>,<numeric>)

Action: RIGHT$ returns a substring taken from the rightmost end of the <string> argument. The length of the substring is defined by the <numeric> argument, which must be an integer in the range 0–255. If <numeric> is 0, a null string ("") is returned. If <numeric> is greater than the length of <string>, the entire string is returned.

Example behavior: with MSG$ = "COMMODORE COMPUTERS", RIGHT$(MSG$,9) produces "COMPUTERS".

## Source Code
```basic
10 MSG$="COMMODORE COMPUTERS"
20 PRINT RIGHT$(MSG$,9)
RUN

COMPUTERS
```

## References
- "left_string_function_left$" — LEFT$ complementary function (returns leftmost characters)
- "mid_string_function_mid$" — MID$ function (returns middle substrings)