# READ (BASIC)

**Summary:** READ fills variables from DATA statements in order; variable types must match DATA constants or the BASIC error ?SYNTAX ERROR (reported at the DATA line) occurs. Reading past available DATA elements produces ?OUT OF DATA; RESTORE resets the DATA pointer.

## Syntax
READ <variable>[,<variable>]...
- TYPE: Statement
- Each variable in the input list must be separated by commas.
- Variable types must match the corresponding DATA constants (numeric vs string); mismatches cause ?SYNTAX ERROR reported at the DATA statement line.

## Description
- READ reads values from the program's DATA statements into the listed variables in sequence.
- READs traverse the DATA list across multiple DATA statements as needed; the read pointer advances with each value consumed.
- If fewer variables are specified than the number of values in the current DATA statement, subsequent READs resume from the next DATA element.
- If more READ statements are executed than there are DATA elements available, BASIC raises ?OUT OF DATA.
- Note: ?SYNTAX ERROR (type mismatch) is reported using the line number of the DATA statement containing the offending constant, not the READ statement that triggered the read.

## Source Code
```basic
110 READ A,B,C$
120 DATA 1,2,HELLO

100 FOR X=1 TO 10: READ A(X):NEXT

200 DATA 3.08, 5.19, 3.12, 3.98, 4.24
210 DATA 5.08, 5.55, 4.00, 3.16, 3.37

1 READ CITY$,STATE$,ZIP
5 DATA DENVER,COLORADO, 80211
```

## References
- "data_statement" — expands on DATA statements providing constants for READ
- "restore_statement" — expands on RESET READ pointer back to start of DATA
