# GOTO / GO TO (Commodore 64 BASIC)

**Summary:** Unconditional jump statement in Commodore 64 BASIC: use GOTO <line number> or GO TO <line number> to transfer execution to a specific program line. A GOTO with no numeric argument is treated as GOTO 0; GOTO can create infinite loops (e.g., 10 GOTO 10) which are normally stopped with the RUN/STOP key.

## Description
TYPE: Statement  
FORMAT: GOTO <line number>  or  GO TO <line number>

Action: Executes an unconditional transfer of control to the specified program line number. The keyword GOTO (or the two-word form GO TO) must be followed by a line number; if no numeric argument is supplied the source states it is equivalent to GOTO 0. Because GOTO jumps by line number, it allows programs to execute out of numerical order and can be used to create loops; a self-referring line (for example, 10 GOTO 10) produces an infinite loop that must be interrupted (typically with the RUN/STOP key).

## Source Code
```basic
GOTO 100
10 GO TO 50
20 GOTO 999

10 GOTO 10      ' Example: infinite loop (must be stopped with RUN/STOP)
GOTO            ' (treated as GOTO 0 according to source)
```

## References
- "if_statement" — expands on conditional branching alternatives (IF...THEN... GOTO)
