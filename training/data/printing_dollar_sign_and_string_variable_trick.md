# PRINTing a dollar sign ($) next to numeric values in C64 BASIC

**Summary:** How to PRINT the dollar sign ($) beside numeric variables in Commodore 64 BASIC: put "$" as a quoted string or store it in a string variable (e.g. Z$="$") and PRINT Z$A; attempting to PRINT $C (unquoted) yields ?SYNTAX ERROR.

## Explanation
In Commodore 64 BASIC a numeric variable (for example C) holds only a numeric value and cannot contain character data such as the dollar sign. To display a $ next to a number you must output the $ as a string literal (in quotes) or as a string variable (names ending with $).

- Using a quoted string: PRINT "$" C — the "$" is a string constant, C is a numeric variable; the two are printed side by side (note: a single space in the source between "$" and C produces a space in the output).
- Using a string variable: assign the dollar sign to a string variable (for example Z$ = "$") and then PRINT Z$A to print the $ followed by numeric variable A.
- Attempting to write PRINT $C (without quotes or a string variable) is invalid syntax in BASIC and produces ?SYNTAX ERROR because $ by itself is not a valid token for concatenation with a numeric variable.

The text also suggests using RUN/STOP and RESTORE keys when entering the $ in a program (as described in the original source).

## Source Code
```basic
40 PRINT"$" C

10 Z$="$"
10 Z$="$": INPUT A
20 PRINT Z$A
```

(Example behavior described in source: if C = 100 then PRINT"$" C displays $ 100; PRINT $C without quotes gives ?SYNTAX ERROR.)

## References
- "string_constants_and_rules" — expands on string constant quoting rules
