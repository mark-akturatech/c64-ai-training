# CBM BASIC — Keywords, Abbreviations, and Function Syntax

**Summary:** Explains Commodore 64 CBM BASIC keyword abbreviation entry (type enough letters, hold SHIFT on final letter), tokenization of keywords (single-character tokens; abbreviations do NOT save program memory), built-in function argument rules (parentheses must follow keyword with NO space), and that string-returning functions end with '$'.

**Abbreviations and tokenization**
- Abbreviations are entered by typing enough letters to uniquely identify a BASIC keyword, with the final letter or graphics character entered while holding the SHIFT key.
- Abbreviations are purely an input convenience. When a program is stored in memory, the BASIC interpreter converts all keywords (whether entered abbreviated or fully) into single-character tokens.
- Because of tokenization, using abbreviations does NOT reduce the memory used by a saved program.
- When a program is LISTed, all keywords appear in their fully spelled form (the abbreviation is not preserved in the stored text).
- Abbreviations can allow you to type more statements into a single program line (visually compressing the line on input), but they do not change the internal representation or token length of the keyword.

**Editing and screen-line limitations**
- The screen editor operates on an 80-character logical line. If a program line (after entering tokens/characters) exceeds the 80-character logical screen width, that line will NOT be editable when LISTed.
- If an overlong line cannot be edited directly after it is LISTed, you must either:
  1) retype the entire line (including any abbreviations), or
  2) break the statement into multiple program lines with their own line numbers.

**Built-in functions: types and argument syntax**
- Built-in BASIC functions are provided by the interpreter and may be used in direct mode or within programs (unlike user-defined functions which must be defined by the programmer).
- There are two function return types:
  1) **NUMERIC** — returns a numeric value (integer or floating-point). Numeric functions will convert between integer and floating-point formats as required.
  2) **STRING** — returns a string value; these function names terminate with a dollar sign ($).
- Function argument rules:
  - All arguments to built-in functions are enclosed in parentheses: `(...)`.
  - The left parenthesis must follow directly after the function name with NO SPACE between the last letter of the function keyword and the "(".
  - Parentheses and argument types are used to determine the required argument format (numeric vs. string). Some string functions may accept numeric arguments; numeric functions may accept expressions that evaluate to numeric values.
- User-defined functions are not treated as built-in functions and do not inherit the interpreter’s built-in calling/tokenization behavior.

**Table 2-1: Commodore 64 BASIC Keywords, Abbreviations, and Screen Appearance**

The following table lists the Commodore 64 BASIC keywords, their abbreviations, and how they appear on the screen when abbreviated.

| Keyword | Abbreviation | Screen Appearance |
|---------|--------------|-------------------|
| ABS     | A<SHIFT>B    | A[GRAPHIC SYMBOL] |
| AND     | A<SHIFT>N    | A[GRAPHIC SYMBOL] |
| ASC     | A<SHIFT>S    | A[GRAPHIC SYMBOL] |
| ATN     | A<SHIFT>T    | A[GRAPHIC SYMBOL] |
| CHR$    | C<SHIFT>H    | C[GRAPHIC SYMBOL] |
| CLOSE   | CL<SHIFT>O   | CL[GRAPHIC SYMBOL] |
| CLR     | C<SHIFT>L    | C[GRAPHIC SYMBOL] |
| CMD     | C<SHIFT>M    | C[GRAPHIC SYMBOL] |
| CONT    | C<SHIFT>O    | C[GRAPHIC SYMBOL] |
| COS     | None         | COS               |
| DATA    | D<SHIFT>A    | D[GRAPHIC SYMBOL] |
| DEF     | D<SHIFT>E    | D[GRAPHIC SYMBOL] |
| DIM     | D<SHIFT>I    | D[GRAPHIC SYMBOL] |
| END     | E<SHIFT>N    | E[GRAPHIC SYMBOL] |
| EXP     | E<SHIFT>X    | E[GRAPHIC SYMBOL] |
| FN      | None         | FN                |
| FOR     | F<SHIFT>O    | F[GRAPHIC SYMBOL] |
| FRE     | F<SHIFT>R    | F[GRAPHIC SYMBOL] |
| GET     | G<SHIFT>E    | G[GRAPHIC SYMBOL] |
| GET#    | None         | GET#              |
| GOSUB   | GO<SHIFT>S   | GO[GRAPHIC SYMBOL] |
| GOTO    | G<SHIFT>O    | G[GRAPHIC SYMBOL] |
| IF      | None         | IF                |
| INPUT   | None         | INPUT             |
| INPUT#  | I<SHIFT>N    | I[GRAPHIC SYMBOL] |
| INT     | None         | INT               |
| LEFT$   | L<SHIFT>E    | L[GRAPHIC SYMBOL] |
| LEN     | L<SHIFT>N    | L[GRAPHIC SYMBOL] |
| LET     | None         | LET               |
| LIST    | L<SHIFT>I    | L[GRAPHIC SYMBOL] |
| LOAD    | L<SHIFT>O    | L[GRAPHIC SYMBOL] |
| LOG     | L<SHIFT>O    | L[GRAPHIC SYMBOL] |
| MID$    | M<SHIFT>I    | M[GRAPHIC SYMBOL] |
| NEW     | None         | NEW               |
| NEXT    | N<SHIFT>E    | N[GRAPHIC SYMBOL] |
| NOT     | None         | NOT               |
| ON      | None         | ON                |
| OPEN    | O<SHIFT>P    | O[GRAPHIC SYMBOL] |
| OR      | None         | OR                |
| PEEK    | P<SHIFT>E    | P[GRAPHIC SYMBOL] |
| POKE    | P<SHIFT>O    | P[GRAPHIC SYMBOL] |
| PRINT   | ?            | ?                 |
| PRINT#  | P<SHIFT>R    | P[GRAPHIC SYMBOL] |
| READ    | R<SHIFT>E    | R[GRAPHIC SYMBOL] |
| REM     | R<SHIFT>M    | R[GRAPHIC SYMBOL] |
| RESTORE | R<SHIFT>E    | R[GRAPHIC SYMBOL] |
| RETURN  | R<SHIFT>E    | R[GRAPHIC SYMBOL] |
| RIGHT$  | R<SHIFT>I    | R[GRAPHIC SYMBOL] |
| RND     | R<SHIFT>N    | R[GRAPHIC SYMBOL] |
| RUN     | R<SHIFT>U    | R[GRAPHIC SYMBOL] |
| SAVE    | S<SHIFT>A    | S[GRAPHIC SYMBOL] |
| SGN     | S<SHIFT>G    | S[GRAPHIC SYMBOL] |
| SIN     | S<SHIFT>I    | S[GRAPHIC SYMBOL] |
| SPC(    | S<SHIFT>P    | S[GRAPHIC SYMBOL] |
| SQR     | S<SHIFT>Q    | S[GRAPHIC SYMBOL] |
| STEP    | S<SHIFT>T    | S[GRAPHIC SYMBOL] |
| STOP    | S<SHIFT>O    | S[GRAPHIC SYMBOL] |
| STR$    | S<SHIFT>T    | S[GRAPHIC SYMBOL] |
| SYS     | S<SHIFT>Y    | S[GRAPHIC SYMBOL] |
| TAB(    | T<SHIFT>A    | T[GRAPHIC SYMBOL] |
| TAN     | T<SHIFT>A    | T[GRAPHIC SYMBOL] |
| THEN    | T<SHIFT>H    | T[GRAPHIC SYMBOL] |
| TO      | None         | TO                |
| USR     | U<SHIFT>S    | U[GRAPHIC SYMBOL] |
| VAL     | V<SHIFT>A    | V[GRAPHIC SYMBOL] |
| VERIFY  | V<SHIFT>E    | V[GRAPHIC SYMBOL] |
| WAIT    | W<SHIFT>A    | W[GRAPHIC SYMBOL] |

*Note: The [GRAPHIC SYMBOL] represents the graphical character displayed when the corresponding key is pressed with the SHIFT key held down.*

## Source Code
(omitted — no code or assembly listings provided in this chunk)

## References
- "how_to_use_syntax_conventions" — expands on syntax rules for parentheses and spacing