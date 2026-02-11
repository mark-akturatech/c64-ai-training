# RESTORE (BASIC statement)

**Summary:** RESTORE resets Commodore 64 BASIC's internal DATA pointer so subsequent READ statements re-read DATA from the first DATA constant; searchable terms: RESTORE, DATA, READ, BASIC pointer.

## Description
Type: Statement  
Format: RESTORE

BASIC maintains an internal pointer to the next DATA constant to be READ. RESTORE resets that pointer to the first DATA constant in the program. RESTORE can be executed anywhere in the program to begin re-READing DATA from the start.

Examples in the source show using RESTORE to fill two arrays with identical data and to repeat a sequence of DATA reads.

## Source Code
```basic
100 FOR X=1 TO 10: READ A(X): NEXT
200 RESTORE
300 FOR Y=1 TO 10: READ B(Y): NEXT

4000 DATA 3.08, 5.19, 3.12, 3.98, 4.24
4100 DATA 5.08, 5.55, 4.00, 3.16, 3.37
```

```basic
10 DATA 1,2,3,4
20 DATA 5,6,7,8
30 FOR L= 1 TO 8
40 READ A: PRINT A
50 NEXT
60 RESTORE
70 FOR L= 1 TO 8
80 READ A: PRINT A
90 NEXT
```

## References
- "read_statement_and_data_interaction" — expands on READ/RESTORE usage