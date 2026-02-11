# INPUT (BASIC)

**Summary:** INPUT is a BASIC statement that prints a question mark (?) (optionally preceded by a quoted prompt), waits for line input terminated by RETURN, and stores values into one or more variables; requires a program buffer (cannot be used at the immediate prompt). Searchable terms: INPUT, "?", RETURN, semicolon, variables, ?EXTRA IGNORED, ?REDO FROM START.

## Usage and behavior
TYPE: Statement  
FORMAT: INPUT [ "<prompt>" ; ] <variable list>

- When executed the statement prints a question mark (?) on screen (the prompt text, if given, is printed before the question mark) and places the cursor one space to the right of the question mark. The machine waits for the operator to type an answer and press RETURN.
- A quoted string after INPUT (e.g. "PROMPT") is printed, then a semicolon (;) must follow before the variable list. The semicolon between the prompt and the variable list is required.
- The variable list is one or more legal BASIC variable names separated by commas. Each value entered is parsed and stored in the corresponding variable.
- If the operator presses RETURN without typing anything, the variable retains its previous value (blank RETURN leaves the variable unchanged).
- If fewer items are entered than variables required, the interpreter prompts again with additional question marks (e.g., ??) until the remaining variables are supplied.
- If more items are entered than variables listed, the interpreter responds with ?EXTRA IGNORED and the additional items are discarded.
- If a non-numeric string is entered when a numeric variable is expected, the interpreter responds with ?REDO FROM START.
- INPUT cannot be used outside a program because it requires a buffer (the same buffer used for command input).

## Source Code
```basic
100 INPUT A
110 INPUT B, C, D
120 INPUT "PROMPT"; E
```

- Example behaviors:
  - Typing nothing then RETURN at line 100: variable A remains unchanged.
  - At line 110, typing a single number then RETURN will produce a second question mark (??) waiting for remaining inputs.
  - At line 110, typing 4 values then RETURN produces ?EXTRA IGNORED.
  - At line 120 the text PROMPT appears before the question mark; semicolon separates prompt and variables.

## References
- "get_statement" — GET vs INPUT for keystroke reading
