# Using the INPUT statement

**Summary:** Explains the Commodore 64 BASIC INPUT statement, using variables as storage compartments, difference between numeric and string variables ($ and % suffixes), valid variable name forms, prompt formatting (quotes), concatenated PRINT output, and example BASIC programs.

## Using INPUT
A variable is a storage compartment that holds a user's response from INPUT. Use a string variable (name ends with $) to store text (e.g., N$ for a name) and numeric variables (no $) to store numbers. Integer (whole-number) variables use the percent sign (%) suffix (e.g., A%) and are stored as 16-bit integers; if an entered numeric value is outside the signed 16-bit range (+32767 through −32768) the interpreter will report ?ILLEGAL QUANTITY.

Variable name forms (valid in Commodore BASIC):
- Single letter: A
- Two letters: AB
- Letter + number: A1 (or AI in source)
- Two letters + number: AB1

Shorter variable names use less memory; using letter/number combinations can help categorise data (for example A1, A2, A3).

Prompt and PRINT rules:
- Text messages and prompts must be enclosed in quotation marks ("...").
- Variables are written outside the quotes.
- You can print variables and text together in a single PRINT statement (concatenation/sequence of items). Example style in the source:
  PRINT A "TIMES 5 EQUALS" A*5
  (The example shows text between the variable and expression; strings are in quotes, variables/expressions outside.)

When performing calculations with user-supplied numbers, use numeric variables (not string variables). You may mix variables and literal numbers in expressions.

## Source Code
```basic
10 PRINT"YOUR NAME": INPUT N$
20 PRINT"HELLO",N$

10 PRINT"ENTER A NUMBER": INPUT A
20 PRINT A

10 PRINT"ENTER A WORD": INPUT A$
20 PRINT A$

10 PRINT"ENTER A NUMBER": INPUT A
20 PRINT A "TIMES 5 EQUALS" A*5

10 PRINT"TYPE 2 NUMBERS": INPUT A: INPUT B
```

Additional note preserved from source:
- If a numeric value entered is outside the range of +32767 thru -32768, the BASIC error message ?ILLEGAL QUANTITY will occur.

## References
- "string_expressions_and_concatenation" — expands on printing strings and variables together
