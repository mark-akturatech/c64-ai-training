# IF...THEN... Statement (Commodore 64 BASIC)

**Summary:** Commodore 64 BASIC IF <expression> THEN <line number> | IF <expression> GOTO <line number> | IF <expression> THEN <statements> — conditional evaluation: when false the remainder of the line after THEN is ignored; when true the program either branches to the given line number or executes the statements that follow THEN. Multiple statements after THEN may be separated by colons.

## Semantics
The IF statement evaluates an expression (which may include variables, strings, numbers, comparisons, and logical operators). The word THEN must appear on the same line as IF. Behavior:

- If the expression is false, everything after THEN on that line is ignored and execution continues with the next program line.
- If the expression is true, control either:
  - branches to the line number after THEN (IF <expression> THEN <line number>), or
  - executes one or more BASIC statements that follow THEN on the same line (IF <expression> THEN <statements>).
- The alternate syntax IF <expression> GOTO <line number> is shorthand equivalent to IF <expression> THEN GOTO <line number>.
- Multiple statements after THEN are separated by colons (:) and execute in sequence when the condition is true.

Common uses: validation of input, conditional inline statements, combining increments/branches in a single line.

## Source Code
```basic
100 INPUT "TYPE A NUMBER"; N
110 IF N <= 0 GOTO 200
120 PRINT "SQUARE ROOT=" SQR(N)
130 GOTO 100
200 PRINT "NUMBER MUST BE >0"
210 GOTO 100
```

```basic
100 FOR L = 1 TO 100
110 IF RND(1) < .5 THEN X=X+1: GOTO 130
120 Y=Y+1
130 NEXT L
140 PRINT "HEADS=" X
150 PRINT "TAILS= " Y
```

## References
- "on_statement" — expands on ON statement as an alternative to multiple IFs