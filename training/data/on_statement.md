# ON <variable> GOTO/GOSUB

**Summary:** ON statement in C64 BASIC selects one target line (GOTO or GOSUB) from a comma-separated list based on an integer variable value (fraction truncated). Negative variable yields ?ILLEGAL QUANTITY; zero or out-of-range values are ignored and execution continues.

## Description
FORMAT: ON <variable> GOTO / GOSUB <line-number>[,<line-number>]...

- Action: Evaluates <variable> (fractional portion removed) and uses its integer value N to select the Nth line-number from the comma-separated list. If N is 1, control transfers to the first listed line; if N is 2, to the second, etc.
- If <variable> is negative, BASIC raises the error ?ILLEGAL QUANTITY.
- If <variable> is zero or greater than the count of items in the list, the ON statement is ignored and execution continues with the next statement.
- The ON statement can replace multiple IF...THEN statements that branch to specific line numbers (compact multi-way dispatch).

(Parenthetical: fractional portion truncated)

## Source Code
```basic
ON -(A=7)-2*(A=3)-3*(A<3)-4*(A>7)GOTO 400,900,1000,100
ON X GOTO 100,130,180,220
ON X+3 GOSUB 9000,20,9000
100 ON NUM GOTO 150,300,320,390
500 ON SUM/2 + 1 GOSUB 50,80,20
```

## References
- "if_then_statement" — expands on ON as alternative to multiple conditional IF statements
