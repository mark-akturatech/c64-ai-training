# RETURN (BASIC statement)

**Summary:** RETURN is a BASIC statement that exits a subroutine entered with GOSUB and resumes execution at the next executable statement after the corresponding GOSUB; nesting requires each GOSUB to be matched by a RETURN.

## Description
TYPE: Statement  
FORMAT: RETURN

Action: The RETURN statement is used to exit from a subroutine called by a GOSUB statement. RETURN restarts the program at the next executable statement following the corresponding GOSUB. If subroutines are nested, each GOSUB must be paired with at least one RETURN statement. A subroutine may contain multiple RETURN statements, but the first one encountered will exit that subroutine.

## Source Code
```basic
10 PRINT"THIS IS THE PROGRAM"
20 GOSUB 1000
30 PRINT"PROGRAM CONTINUES"
40 GOSUB 1000
50 PRINT"MORE PROGRAM"
60 END
1000 PRINT"THIS IS THE GOSUB":RETURN
```

## References
- "gosub_and_stack_usage" — expands on GOSUB pushing the return address onto the stack and RETURN popping it