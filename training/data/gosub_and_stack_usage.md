# GOSUB <line number>

**Summary:** GOSUB <line number> — BASIC statement that calls a subroutine and saves the return location on the program stack; RETURN (the statement, not the keyboard key) returns to the statement following the GOSUB. Stack for subroutine return addresses occupies 256 bytes, so the number of nested/queued GOSUB return addresses is limited.

## Description
GOSUB is a specialized form of GOTO that records where it was invoked. When the program executes a RETURN statement, execution resumes at the statement immediately following the originating GOSUB.

Primary uses:
- Reuse a multi-line routine from multiple places in a program instead of duplicating lines (saves program space).
- Similar purpose to DEF FN for formulas, but for several-line code blocks.

Behavior and cautions:
- The RETURN statement (not the <RETURN> key) must be reached for each GOSUB; otherwise return addresses remain on the stack.
- Each GOSUB saves the line number and the position within that program line in a special stack area that occupies 256 bytes of memory. This limits how many return addresses can be stored concurrently.
- Ensure each GOSUB will reach a corresponding RETURN (or otherwise clean up) to avoid exhausting the stack even if other memory is available.

## Source Code
```basic
100 PRINT "THIS PROGRAM PRINTS"
110 FOR L = 1 TO 500:NEXT
120 PRINT "SLOWLY ON THE SCREEN"
130 FOR L = 1 TO 500:NEXT
140 PRINT "USING A SIMPLE LOOP"
150 FOR L = 1 TO 500:NEXT
160 PRINT "AS A TIME DELAY."
170 FOR L = 1 TO 500:NEXT

100 PRINT "THIS PROGRAM PRINTS"
110 GOSUB 200
120 PRINT "SLOWLY ON THE SCREEN"
130 GOSUB 200
140 PRINT "USING A SIMPLE LOOP"
150 GOSUB 200
160 PRINT "AS A TIME DELAY."
170 GOSUB 200
180 END
200 FOR L = 1 TO 500 NEXT
210 RETURN
```

## References
- "return_statement" — expands on RETURN behavior and usage
- "stack_overflow_and_limits" — expands on stack limitations and effects on program
