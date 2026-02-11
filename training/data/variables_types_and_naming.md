# Variables: names, types, and default creation behavior (CBM BASIC)

**Summary:** CBM BASIC variable rules: names (letters+digits, first char must be a letter), only the first two characters are significant, keywords are forbidden inside names, numeric variables auto-created as 0 if referenced before assignment, strings auto-created as null, and type suffixes are % (integer) and $ (string) with no suffix meaning floating-point.

## Integer, floating-point and string variables
Variables represent data used by BASIC statements and may hold integers, floating-point numbers, or strings. If a variable name is referenced before any assignment, the BASIC interpreter will automatically create it:
- Numeric variables (integer or floating-point) are created with a value of 0.
- String variables are created with a null (empty) value.

Naming rules:
- Names may be any length, but only the first two characters are significant in CBM BASIC — therefore two distinct variables must not share the same first two characters.
- Allowed characters are letters (A–Z) and digits (0–9). The first character of a variable name must be a letter.
- Type declaration characters (%) and ($) may be used as the last character of the name:
  - % declares an integer variable.
  - $ declares a string variable.
  - No type suffix implies a floating-point variable.
- Variable names may NOT be the same as BASIC keywords, and they may NOT contain keywords in the middle of a name. (Keywords include BASIC commands, statements, function names, and logical operator names.) Using a keyword inside a variable name will produce a ?SYNTAX ERROR.

Examples of valid names and assignments are provided in the Source Code section.

## Source Code
```basic
A$="GROSS SALES"        (string variable)
MTH$="JAN"+A$           (string variable)
K%=5                    (integer variable)
CNT%=CNT%+1             (integer variable)
FP=12.5                 (floating-point variable)
SUM=FP*CNT%             (floating-point variable)
```

## References
- "arrays_overview_and_dimensions" — expands on array naming and element types.