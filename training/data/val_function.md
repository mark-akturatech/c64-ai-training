# VAL(string) — BASIC numeric conversion

**Summary:** VAL(string) is a C64 BASIC numeric function that converts numeric text in a string to a numeric value (VAL). Parsing rules: the first non-blank character must be +, −, or a digit or the function returns 0; parsing stops at the first non-digit except for the decimal point (.) and exponent marker e.

## Description
Type: Numeric Function  
Format: VAL(<string>)

- Returns a numeric value representing the numeric contents of <string>.
- Leading blanks are ignored. If the first non-blank character is not +, −, or a digit, VAL returns 0.
- Conversion proceeds character by character and stops when the end of the string is reached or when a non-digit character is encountered, with two exceptions:
  - Decimal point (.) is accepted as part of the numeric token.
  - Exponential marker e (lowercase e) is accepted as part of the numeric token (for scientific notation).
- Behavior is consistent with C64 BASIC parsing rules for numeric literals.

## Example
The example shows validating ZIP$ ranges using VAL(ZIP$); non-numeric ZIP$ values (first non-blank not +/−/digit) evaluate to 0 and fail the range check.

## Source Code
```basic
10 INPUT#1, NAM$, ZIP$
20 IF VAL(ZIP$) < 19400 OR VAL(ZIP$) > 96699
   THEN PRINT NAM$ TAB(25) "GREATER PHILADELPHIA"
```

## References
- "BASIC LANGUAGE VOCABULARY" — BASIC function reference entry
