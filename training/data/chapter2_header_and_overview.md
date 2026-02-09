# BASIC LANGUAGE VOCABULARY (Chapter 2)

**Summary:** This chapter provides a comprehensive reference to the Commodore 64 BASIC language, including a list of keywords with their abbreviations and function types, detailed descriptions of each keyword, an overview of the keyboard layout and special character input, and an explanation of the screen editor's key mappings and behaviors.

**Introduction**

This chapter introduces the BASIC vocabulary used on the Commodore 64, detailing the set of reserved keywords, the available built-in functions (categorized as numeric or string), and the conventions for function arguments (numeric expressions for numeric functions; string expressions for string functions). It also covers keyword abbreviations and the impact of the keyboard and screen editor on keyword and special character entry.

**BASIC Keywords, Abbreviations, and Function Types**

The following table lists the BASIC language keywords, their accepted abbreviations, and classifies built-in functions by type (numeric or string). This serves as a primary reference for keyword spellings, abbreviation forms, and the syntactic role of each function.

| Keyword | Abbreviation | Function Type |
|---------|--------------|---------------|
| ABS     | A<SHIFT>B    | Numeric       |
| AND     | A<SHIFT>N    | Operator      |
| ASC     | A<SHIFT>S    | Numeric       |
| ATN     | A<SHIFT>T    | Numeric       |
| CHR$    | C<SHIFT>H    | String        |
| CLOSE   | CL<SHIFT>O   | Command       |
| CLR     | C<SHIFT>L    | Command       |
| CMD     | C<SHIFT>M    | Command       |
| CONT    | C<SHIFT>O    | Command       |
| COS     | C<SHIFT>O    | Numeric       |
| DATA    | D<SHIFT>A    | Command       |
| DEF     | D<SHIFT>E    | Command       |
| DIM     | D<SHIFT>I    | Command       |
| END     | E<SHIFT>N    | Command       |
| EXP     | E<SHIFT>X    | Numeric       |
| FN      | F<SHIFT>N    | Function      |
| FOR     | F<SHIFT>O    | Command       |
| FRE     | F<SHIFT>R    | Numeric       |
| GET     | G<SHIFT>E    | Command       |
| GOSUB   | GO<SHIFT>S   | Command       |
| GOTO    | G<SHIFT>O    | Command       |
| IF      | I<SHIFT>F    | Command       |
| INPUT   | I<SHIFT>N    | Command       |
| INT     | I<SHIFT>N    | Numeric       |
| LEFT$   | L<SHIFT>E    | String        |
| LEN     | L<SHIFT>E    | Numeric       |
| LET     | L<SHIFT>E    | Command       |
| LIST    | L<SHIFT>I    | Command       |
| LOAD    | L<SHIFT>O    | Command       |
| LOG     | L<SHIFT>O    | Numeric       |
| MID$    | M<SHIFT>I    | String        |
| NEW     | N<SHIFT>E    | Command       |
| NEXT    | N<SHIFT>E    | Command       |
| NOT     | N<SHIFT>O    | Operator      |
| ON      | O<SHIFT>N    | Command       |
| OPEN    | O<SHIFT>P    | Command       |
| OR      | O<SHIFT>R    | Operator      |
| PEEK    | P<SHIFT>E    | Numeric       |
| POKE    | P<SHIFT>O    | Command       |
| POS     | P<SHIFT>O    | Numeric       |
| PRINT   | ?            | Command       |
| READ    | R<SHIFT>E    | Command       |
| REM     | R<SHIFT>E    | Command       |
| RESTORE | R<SHIFT>E    | Command       |
| RETURN  | R<SHIFT>E    | Command       |
| RIGHT$  | R<SHIFT>I    | String        |
| RND     | R<SHIFT>N    | Numeric       |
| RUN     | R<SHIFT>U    | Command       |
| SAVE    | S<SHIFT>A    | Command       |
| SGN     | S<SHIFT>G    | Numeric       |
| SIN     | S<SHIFT>I    | Numeric       |
| SPC     | S<SHIFT>P    | Command       |
| SQR     | S<SHIFT>Q    | Numeric       |
| STATUS  | S<SHIFT>T    | Numeric       |
| STEP    | S<SHIFT>T    | Command       |
| STOP    | S<SHIFT>T    | Command       |
| STR$    | S<SHIFT>T    | String        |
| TAB     | T<SHIFT>A    | Command       |
| TAN     | T<SHIFT>A    | Numeric       |
| THEN    | T<SHIFT>H    | Command       |
| TO      | T<SHIFT>O    | Command       |
| USR     | U<SHIFT>S    | Numeric       |
| VAL     | V<SHIFT>A    | Numeric       |
| VERIFY  | V<SHIFT>E    | Command       |
| WAIT    | W<SHIFT>A    | Command       |

*Note: The abbreviation for the PRINT command is a question mark (?).*

**Description of BASIC Keywords (Alphabetical)**

Below are descriptions of selected BASIC keywords, including their syntax, arguments, return types, and abbreviations.

**ABS**

- **Type:** Function - Numeric
- **Syntax:** `ABS(expression)`
- **Description:** Returns the absolute value of the numeric expression.
- **Abbreviation:** A<SHIFT>B

**AND**

- **Type:** Operator
- **Syntax:** `expression AND expression`
- **Description:** Performs a bitwise AND operation between two expressions.
- **Abbreviation:** A<SHIFT>N

**ASC**

- **Type:** Function - Numeric
- **Syntax:** `ASC(string)`
- **Description:** Returns the ASCII code of the first character in the string.
- **Abbreviation:** A<SHIFT>S

**ATN**

- **Type:** Function - Numeric
- **Syntax:** `ATN(expression)`
- **Description:** Returns the arctangent of the numeric expression.
- **Abbreviation:** A<SHIFT>T

**CHR$**

- **Type:** Function - String
- **Syntax:** `CHR$(expression)`
- **Description:** Returns the character corresponding to the ASCII code provided.
- **Abbreviation:** C<SHIFT>H

**CLOSE**

- **Type:** Command
- **Syntax:** `CLOSE file_number`
- **Description:** Closes the file associated with the specified file number.
- **Abbreviation:** CL<SHIFT>O

**CLR**

- **Type:** Command
- **Syntax:** `CLR`
- **Description:** Clears all variables and closes all files.
- **Abbreviation:** C<SHIFT>L

**CMD**

- **Type:** Command
- **Syntax:** `CMD file_number`
- **Description:** Redirects output to the specified file number.
- **Abbreviation:** C<SHIFT>M

**CONT**

- **Type:** Command
- **Syntax:** `CONT`
- **Description:** Continues program execution after a STOP or END statement.
- **Abbreviation:** C<SHIFT>O

**COS**

- **Type:** Function - Numeric
- **Syntax:** `COS(expression)`
- **Description:** Returns the cosine of the numeric expression (in radians).
- **Abbreviation:** C<SHIFT>O

**DATA**

- **Type:** Command
- **Syntax:** `DATA constant[,constant]...`
- **Description:** Defines constants to be read by READ statements.
- **Abbreviation:** D<SHIFT>A

**DEF**

- **Type:** Command
- **Syntax:** `DEF FNname(parameter)=expression`
- **Description:** Defines a user-defined function.
- **Abbreviation:** D<SHIFT>E

**DIM**

- **Type:** Command
- **Syntax:** `DIM array_name(dimensions)`
- **Description:** Declares the dimensions of an array.
- **Abbreviation:** D<SHIFT>I

**END**

- **Type:** Command
- **Syntax:** `END`
- **Description