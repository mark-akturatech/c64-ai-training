# LIST (BASIC command)

**Summary:** LIST — BASIC system command to display program lines in memory on the screen (or redirected device). Syntax: LIST [[<first-line>]-[<last-line>]]; supports single-line, range, and open-ended ranges; CTRL slows scrolling, RUN/STOP aborts, LIST returns to READY. 

## Description
The LIST command displays all or part of the BASIC program currently in memory, using the screen editor for convenient editing after display. Output is normally to the screen; the CMD statement can redirect LIST output to an external device (for example printer or disk).

Syntax:
- LIST — list entire program.
- LIST <n> — list the single line numbered <n>.
- LIST <m>- — list from line <m> through the last line in the program.
- LIST -<n> — list from the first line through line <n>.
- LIST <m>-<n> — list lines <m> through <n>, inclusive.

Behavior and control:
- When LIST is used inside a program, BASIC executes it and then returns to the system READY prompt after the LIST finishes.
- Scrolling from the bottom to the top of the screen while listing can be slowed by holding the CTRL key.
- Typing RUN/STOP aborts an ongoing LIST.
- The listed output includes the line numbers as stored in program memory.

## Source Code
```basic
' Command format reference
' TYPE: Command
' FORMAT: LIST [[<first-line>]-[<last-line>]]

' Examples of LIST usage:
LIST            ' Lists the program currently in memory.
LIST 500        ' Lists line 500 only.
LIST 150-       ' Lists all lines from 150 to the end.
LIST -1000      ' Lists all lines from the lowest through 1000.
LIST 150-1000   ' Lists lines 150 through 1000, inclusive.

' Example: LIST used inside a program
10 PRINT "THIS  IS LINE 10"
20 LIST         ' Execution will LIST program, then BASIC returns to READY
30 PRINT "THIS  IS LINE 30"
```

## References
- "screen_editor" — expands on editing lines after LIST using the screen editor