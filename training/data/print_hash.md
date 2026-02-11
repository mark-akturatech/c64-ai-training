# PRINT# — write to logical file (BASIC)

**Summary:** PRINT# writes variables and literals to a logical file opened with OPEN (device set by OPEN). Punctuation controls spacing and termination; on tape the comma behaves like semicolon (continuous stream). Use CHR$(13) to insert explicit carriage-returns; INPUT# reads back lines written by PRINT#.

## Behavior
- Purpose: Write data items to a logical file identified by the file-number used in OPEN. Output goes to the device-number specified in the OPEN.
- Syntax: PRINT#<file-number>[<variable>][<,/;><variable>]...
- Item types: Any BASIC expression type may be output.
- Punctuation effects:
  - Comma (,) and semicolon (;) between items behave as they do with PRINT on screen, except on tape files the comma acts like a semicolon (no print-zone spacing).
  - On tape files, items are written as a continuous stream of characters (commas do not insert zone spacing). Numeric items are followed by a space and, if positive, are preceded by a space.
- Line termination:
  - If the output-list is not terminated by punctuation, a carriage-return plus line-feed (CR+LF) is written at end of the data.
  - If the output-list ends with a comma or semicolon, the CR+LF is suppressed.
  - Regardless of punctuation, the next PRINT# begins output at the next available character position.
- Interaction with INPUT#:
  - The line-feed (LF) written when a list ends without terminating punctuation acts as a record separator for INPUT#, potentially causing an empty variable on the next INPUT# if not handled.
  - To control record breaks explicitly, include CHR$(13) (carriage-return) between items or at the end of a PRINT# line.
- Common pattern: Set a string variable to CHR$(13) (or CHR$(44) for comma, CHR$(59) for semicolon) and insert that between variables to control separators consistently when writing to tape or disk.

## Source Code
```basic
1) 
10 OPEN 1,1,1,"TAPE FILE"
20 R$=CHR$(13)                      (By changing the CHR$(13) to
30 PRINT#1,1;R$;2;R$;3;R$;4;R$;5     CHR$(44) you put a "," between
40 PRINT#1,6                         each variable. CHR$(59) would
50 PRINT# 1,7                        put a ";" between each variable.)

2)
10 CO$=CHR$(44):CR$=CHR$(13)
20 PRINT#1,"AAA"CO$"BBB",           AAA,BBB     CCCDDDEEE
   "CCC";"DDD";"EEE"CR$             (carriage return)
   "FFF"CR$;                        FFF(carriage return)
30 INPUT#1,A$,BCDE$,F$

3)
5 CR$=CHR$(13)
10 PRINT#2,"AAA";CR$;"BBB"          (10 blanks) AAA
20 PRINT#2,"CCC";                   BBB
                                     (10 blanks)CCC
30 INPUT#2,A$,B$,DUMMY$,C$
```

## References
- "open_statement_and_file_device_management" — expands on OPEN required before PRINT#
- "input_hash_statement" — expands on INPUT# reading data written by PRINT#
