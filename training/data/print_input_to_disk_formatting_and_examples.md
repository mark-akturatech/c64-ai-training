# PRINT# and INPUT# — sequential file formatting, CR/commas/semicolons, numeric storage

**Summary:** Behavior of PRINT# and INPUT# for sequential files on Commodore BASIC: PRINT# mirrors PRINT formatting (commas insert tabbed spaces, semicolons suppress spaces, a terminating CR/CHR$13 is written unless the PRINT# line ends with , or ;). INPUT# separates fields by CR, comma, or semicolon. Numeric data is written as text (STR$-style) with a leading space for positive numbers or a minus for negatives and a trailing "cursor right" character (source wording).

## PRINT# behavior (writing)

- PRINT# uses exactly the same formatting rules as PRINT to the screen; any punctuation and formatting behavior (commas, semicolons, CR insertion) applies when writing to a sequential disk file.
- Syntax: PRINT# file#, data-list
  - file# is the handle returned by OPEN (the file created/opened earlier).
  - data-list is the same as a normal PRINT list (variables and/or quoted strings).
- Commas (,) between items act like PRINT to screen: they insert spacing based on the tab stops (blank-fill), producing one or more space bytes in the file. This behavior causes files to contain wasted blank bytes when commas are used as separators.
- Semicolons (;) do not insert extra spaces; items are written directly adjacent.
- Every PRINT or PRINT# writes a terminating carriage-return (CR, CHR$13) automatically unless the PRINT/PRINT# statement ends with a comma or semicolon.
- Do not put a space between PRINT and # (use PRINT#). Do not abbreviate as ?#.

## INPUT# behavior (reading)

- Syntax: INPUT# file#, variable-list
- INPUT# reads data from a sequential file; the drive treats file bytes as a stream and requires separators to delimit fields.
- Recognized separators for INPUT# are: CR (CHR$13), comma, and semicolon. Use one of these characters in the file to separate fields so INPUT# can parse multiple variables.
- Common ways to produce separators:
  - Write one variable per PRINT# line (PRINT# 5, A$) — each line ends with CR, providing reliable separation.
  - Insert explicit separator characters into the data (e.g., Z$ = "," : PRINT# 5, A$; Z$; B$; Z$; C$).
- If no separators are present, INPUT# cannot distinguish field boundaries (the drive only supplies raw bytes).

## Numeric data format (written to file)

- Numeric values written by PRINT# are stored as text (as if STR$ were applied).
- Format described by source:
  - First character: space if positive, minus sign (-) if negative.
  - Then the digits (ASCII text) representing the number.
  - The source states "the last character is the cursor right character" (this likely refers to the CHR$(29) cursor-right byte that BASIC's STR$ function appends after the digits).
- Because positive numbers include a leading space, two character positions may be unused/wasted compared to a minimal ASCII representation.

## File-layout examples

- The textual examples and byte-layout diagrams below illustrate:
  - multiple items written on a single PRINT# line with semicolons (adjacent bytes, then CR),
  - items separated by explicit commas inserted into the file,
  - items separated by commas in a PRINT# list (which leave blank fill bytes due to tabbing).
- See Source Code for the exact BASIC sample lines and ASCII byte-maps.

## Source Code
```basic
OPEN 5,8,5,"0:TEST,S,W"
```

ASCII file layout diagram (general view from source):
```text
      |eof|   |   |   |   |   |   |   |   |   |   |   |   |   |   |
 -----+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---
 char | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10| 11| 12| 13| 14| 15|...
```

Example variables:
```basic
A$ = "HELLO": B$ = "ALL": C$ = "BYE"
```

File after:
```basic
PRINT# 5, A$; B$; C$
```
Resulting byte layout (adjacent, then CR):
```text
      | H | E | L | L | O | A | L | L | B | Y | E | CR|eof|
 -----+---+---+---+---+---+---+---+---+---+---+---+---+---+
 char | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10| 11| 12| 13|
```

File after writing commas explicitly between fields:
```basic
Z$ = ",": PRINT# 5, A$; Z$; B$; Z$; C$
```
Resulting byte layout:
```text
      | H | E | L | L | O | , | A | L | L | , | B | Y | E | CR|eof|
 -----+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+
 char | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10| 11| 12| 13| 14| 15|
```

File after:
```basic
PRINT# 5, A$, B$
```
(shows blank fill bytes from comma/tab spacing — source shows blanks between HELLO and ALL and a CR at end):
```text
      | H | E | L | L | O |   |   |   | A | L | L |   | CR|eof|
 -----+---+---+---+---+---+---+---+---+---+---+---+---+---+---+
 char | 1 | 2 | 3 | 4 | 5 | 6 |...| 11| 12| 13| 14|...| 23| 24|
```

Additional source text lines (from original):
```basic
'NOTE: Do not leave a space between PRINT and #, and do not try to
'abbreviate the command as ?#.  See the appendixes in the user manual
'for the correct abbreviation.
```

(End of quoted source examples and diagrams.)
```

## References
- "get_statement_and_file_examination_example" — expands on GET# to read files byte-by-byte for inspection
- "reading_directory_program_and_description" — expands on reading the directory as a sequential file