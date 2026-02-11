# COMMODORE 64 - SYS <memory-location>

**Summary:** SYS statement (BASIC) transfers execution to a machine language routine at a numeric memory-location; the machine code must end with RTS so BASIC resumes. Searchable terms: SYS, BASIC, RTS, SYS 64738, POKE, machine language, memory-location.

## Description
TYPE: Statement  
FORMAT: SYS <memory-location>

Action: Transfers control from BASIC (direct or program mode) to a machine language program beginning at the numeric memory-location specified. The memory-location may point anywhere in memory (RAM or ROM). The machine language routine must terminate with an RTS (ReTurn from Subroutine) instruction so that, when finished, control returns to BASIC and execution continues with the statement following the SYS command.

Notes:
- SYS is commonly used to mix BASIC with machine language routines.
- The memory-location is given as a numeric expression.
- BASIC resumes after the machine routine returns via RTS.

## Source Code
```basic
SYS 64738

10 POKE 4400,96:SYS 4400
```

## References
- "usr_function" — expands on USR uses a pointer in RAM to call a machine routine and return a floating result
