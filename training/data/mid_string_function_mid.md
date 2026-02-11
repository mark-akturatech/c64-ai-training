# MID$ (MID$(string, numeric-1 [, numeric-2]))

**Summary:** MID$ is a BASIC string function that returns a substring from a larger string using 1-based start positions and an optional length; numeric arguments range 0–255 and omission of the length returns to end of string.

## Description
TYPE: String Function  
FORMAT: MID$(<string>,<numeric-1>[,<numeric-2>])

- Action: Returns a substring taken from within <string>.  
- <numeric-1> (start) is a 1-based position within <string>. Both numeric arguments may be 0–255.  
- If <numeric-1> is greater than the length of <string>, or if <numeric-2> is zero, MID$ returns a null string.  
- If <numeric-2> is omitted, MID$ returns from <numeric-1> to the end of <string>.  
- If the remaining characters from <numeric-1> to the end of <string> are fewer than <numeric-2>, the rest of the string is used (no error).

Example purpose: assembling the display "GOOD EVENING" by concatenating A$ and a substring of B$.

## Source Code
```basic
10 A$="GOOD"
20 B$="MORNING EVENING AFTERNOON"
30 PRINT A$ + MID$(B$,8,8)
```
Output:
```
GOOD EVENING
```

## References
- "left_string_function_left$" — expands on LEFT$ for leftmost extraction
- "right_string_function_right$" — expands on RIGHT$ for rightmost extraction