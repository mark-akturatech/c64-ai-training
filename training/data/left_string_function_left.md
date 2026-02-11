# LEFT$ (string function)

**Summary:** LEFT$ is a Commodore 64 BASIC string function that returns the leftmost N characters of a string. Usage: LEFT$(<string>, <integer>) with integer in range 0–255; zero returns a null (zero-length) string, values greater than the string length return the whole string.

## Description
FORMAT: LEFT$ (<string>, <integer>)

Action: Returns a string composed of the leftmost <integer> characters from <string>. The integer argument must be between 0 and 255 inclusive. If <integer> is greater than the length of <string>, the entire string is returned. If <integer> is 0, a null string (zero-length) is returned.

Example purpose: extracting the word "COMMODORE" from "COMMODORE COMPUTERS" by taking the first 9 characters.

## Source Code
```basic
10 A$ = "COMMODORE COMPUTERS"
20 B$ = LEFT$(A$,9): PRINT B$
RUN

COMMODORE
```

## References
- "right_string_function_right$" — covers the complementary RIGHT$ function
- "mid_string_function_mid$" — covers MID$ for extracting substrings from the middle