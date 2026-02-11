# NEW (BASIC command)

**Summary:** NEW deletes the current BASIC program and clears all variables from memory ($memory management, direct mode). Use NEW in direct mode before entering a new program; invoking NEW from within a program erases prior state and stops execution.

## Description
Type: Command  
Format: NEW

Action: The NEW command deletes the program currently in memory and clears all variables. Use NEW in direct mode to clear memory before typing a new program. If NEW is executed inside a running program (for example via a numbered line), it will erase everything in memory that was created earlier and stop program execution — this can make debugging difficult.

Warning: Not clearing an old program before typing a new one can cause a confusing mix of the two programs.

## Source Code
```basic
NEW

10 NEW
REM (Clears the program and all variables)
REM (Performs a NEW operation and STOPs the program.)
```

## References
- (none)
