# CONT (BASIC command)

**Summary:** CONT resumes execution of a BASIC program halted by STOP, END, or the RUN/STOP key and restores execution at the exact statement where it stopped; returns the error CAN'T CONTINUE if the program was edited, halted by an error, or an error was caused before issuing CONT.

## Description
TYPE: Command  
FORMAT: CONT

Action: Restarts execution of a program that was halted by a STOP or END statement or by pressing the <RUN/STOP> key. The program continues from the exact place it left off.

Notes and restrictions:
- While the program is stopped you may inspect or change variables or view the program listing; STOP statements can be used as breakpoints for debugging.
- The error message CAN'T CONTINUE occurs if:
  - the program was edited while stopped (even pressing <RETURN> on an unchanged line),
  - the program halted due to a runtime error,
  - you caused an error before typing CONT to resume.
- Use PRINT (for variables) while stopped to inspect state (example: PRINT C).

## Example
This example computes an approximation of PI using a simple series. RUN it, press <RUN/STOP> after it runs for a while, inspect with PRINT C, then type CONT to resume.

## Source Code
```basic
10 PI=0:C=1
20 PI=PI+4/C-4/(C+2)
30 PRINT PI
40 C=C+4:GOTO 20
```

Sample interaction (actual numeric values may differ):
```text
RUN
... (program running)
<RUN/STOP pressed>

BREAK IN 20  | NOTE: Might be different number.

PRINT C
... (shows current C value)

CONT
... (program resumes from line 20)
```

## References
- "stop_and_end_statements" — explains difference between STOP and END in BASIC.