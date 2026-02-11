# RUN (BASIC command)

**Summary:** RUN — BASIC command to start a program in memory; performs an implied CLR (clears variables) before execution unless resumed with CONT or GOTO; accepts an optional <line-number> (RUN [<line-number>]) and raises UNDEF'D STATEMENT if the specified line does not exist.

## Usage
Type: Command  
Format: RUN [<line-number>]

- RUN starts the program currently in memory.  
- If a <line-number> is given, execution begins at that line; otherwise it begins at the program's first line.  
- RUN performs an implied CLR (clears all variables) before starting. To avoid the implied CLR when resuming a halted program, use CONT or GOTO instead.

## Behavior and termination
- RUN may be invoked from direct mode or from within a program.  
- If RUN is used inside a program with a <line-number> that does not exist, BASIC reports the error UNDEF'D STATEMENT.  
- A running program returns control to direct mode when one of the following occurs:
  - An END statement is executed.
  - A STOP statement is executed.
  - The last program line is executed.
  - A BASIC error occurs during execution.

## Errors
- UNDEF'D STATEMENT — produced when RUN <line-number> is given and that line number is not present in the program.

## Examples
- `RUN`        (starts at first line of program)  
- `RUN 500`    (starts at line 500)  
- `RUN X`      (starts at line whose number is the value of variable X; UNDEF'D STATEMENT if no such line)

## References
- "cont_command" — CONT as alternative to RUN to resume without CLR