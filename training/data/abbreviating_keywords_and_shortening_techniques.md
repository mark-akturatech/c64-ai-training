# BASIC Crunching Techniques: keyword tokenization, line-number shortening, colon-separated statements, REM removal

**Summary:** Explains keyword abbreviations and tokenization (BASIC keywords stored as single-byte tokens), why abbreviations do not reduce saved program size, how shortening line numbers reduces memory used by GOTO/GOSUB references, using colons to place multiple statements on one line (80-character limit), and removing REM statements to reclaim space.

## Keyword abbreviations and tokenization
Commodore BASIC converts keyword text into single-byte tokens when a line is entered (keywords are tokenized). Because the tokenizer replaces the keyword text with a single token, entering an abbreviation at the keyboard does not shrink the program file or memory usage in the saved program — the same token is stored either way. Line-number references inside statements (e.g., GOTO/GOSUB) are stored as their decimal digits in the program text (one byte per digit), so shorter numeric line labels reduce the bytes used by those references.

## Shortening program line numbers
During development many programmers use sparse numbering (100, 110, 120...) to allow insertion of lines. After a program is finished you can renumber lines to the smallest possible sequence (1, 2, 3...) to reduce program size because every digit used in referenced line numbers costs one byte. Renumbering affects bytes used by textual references (GOTO/GOSUB/etc.) — shorter labels directly reduce those bytes.

## Putting multiple instructions on each line
You may place several BASIC statements on the same line by separating them with colons (:). The only constraint is the 80-character maximum line length; colons and spaces count toward that limit. Grouping short statements onto one line saves overhead from extra line numbers and line headers, but be sure maintain readability while crunching.

## Removing REM statements
REM (remark) statements consume program memory. Removing REM lines after development reclaims space. Keep a separate copy with REMs intact if you plan later revisions or to preserve comments for others.

## Source Code
```basic
10 PRINT"HELLO...";            10 PRINT "HELLO...";:FOR T=1TO500:NEXT:
20 FOR T=1 TO 500: NEXT       20 PRINT"HELLO, AGAIN...":GOTO10
30 PRINT"HELLO, AGAIN..."
40 GOTO 10
```

## References
- "rem_statements_removal" — expands on removing REM statements after development
