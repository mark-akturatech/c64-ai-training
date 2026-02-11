# Commodore 64 — Simple Variables (Real, Integer %, String $)

**Summary:** Quick reference for C64 BASIC variable types: Real, Integer (%) and String ($); numeric/character ranges (Real: +-1.70141183E+38 / +-2.93873588E-39; Integer: +-32767; String: 0–255 chars), and naming rules (X = letter A–Z, Y = letter or digit 0–9; only first two characters significant).

## Variable Types and Naming Rules
Real
- Denoted by a plain name with no suffix.
- Range: ±1.70141183E+38 (max) and ±2.93873588E-39 (min, non-zero).

Integer
- Denoted by a trailing percent sign (%) on the variable name (e.g., XY%).
- Range: ±32767.

String
- Denoted by a trailing dollar sign ($) on the variable name (e.g., XY$).
- Length: 0 to 255 characters.

Naming rules
- Variable name form shown as XY where:
  - X must be a letter (A–Z).
  - Y may be a letter (A–Z) or a digit (0–9).
- Names may be longer than two characters, but only the first two characters are significant (only XY are recognized for identity and storage).
- Suffixes: use % for Integer, $ for String; Real has no suffix.

## Source Code
```text
COMMODORE 64 QUICK REFERENCE CARD

SIMPLE VARIABLES

Type     Name     Range

Real     XY       +-1.70141183E+38
                    +-2.93873588E-39
Integer  XY%      +-32767
String   XY$      0 to 255 characters

X is a letter (A-Z), Y is a letter or number (0-9). Variable names
can be more than 2 characters, but only the first two are recognized.
```

## References
- "array_variables" — expands on array variables and DIM requirements
- "operators_relational_and_logical" — expands on arithmetic, relational and logical operators used with variables