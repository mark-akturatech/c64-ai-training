# STOP (BASIC statement)

**Summary:** STOP halts BASIC program execution and returns to direct mode showing the error message "?BREAK IN LINE nnnnn"; variables and open files are preserved and execution can be resumed with CONT or by jumping with GOTO. Pressing the RUN/STOP key has the same effect as a STOP statement.

## Description
Type: Statement  
Format: STOP

Action: The STOP statement halts execution of the current BASIC program and returns control to direct mode. The system displays the BASIC message "?BREAK IN LINE nnnnn" (where nnnnn is the line number containing the STOP) and then shows READY. Any open files remain open and all program variables are preserved. Execution may be restarted with the CONT command (resumes at the point of interruption) or by using GOTO to jump to a specific line.

STOP may be used conditionally (for example within an IF ... THEN STOP) to break out when a runtime condition is met. Pressing the keyboard RUN/STOP key produces the same behavior as a STOP statement.

## Source Code
```basic
10 INPUT#1,AA,BB,CC
20 IF AA=BB AND BB=CC THEN STOP
30 STOP
```

Example behavior (when AA = -1 and BB = CC):
```text
BREAK IN LINE 20
```

Example behavior (for other data values):
```text
BREAK IN LINE 30
```

## References
- "end_statement" — expands on differences between END and STOP
- "cont_command" — expands on CONT to resume after STOP