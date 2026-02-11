# STR$ (numeric) — convert numeric to string

**Summary:** STR$ is a Commodore 64 BASIC string function that returns the string representation of a numeric expression (STR$(numeric)). Converted numbers have a trailing space; positive numbers are also given a leading space. Search terms: STR$, string conversion, trailing space, leading space, BASIC.

## Description
STR$(<numeric>) returns a string containing the decimal representation of the numeric expression passed as the argument. Behavior specifics from the source:
- Every numeric value converted to a string by STR$ has a trailing space character.
- Positive numbers are additionally preceded by a space character (leading space).
- The function is used in BASIC as STR$(numeric), and the returned string can be assigned to string variables.

The example demonstrates converting a floating-point value to a string and printing both the original numeric value and the resulting string value.

## Source Code
```basic
100 FLT = 1.5E4: ALPHA$ = STR$(FLT)
110 PRINT FLT, ALPHA$

(printed output)
15000     15000
```

## References
- "STR$ family" — basic string conversion functions (where available)