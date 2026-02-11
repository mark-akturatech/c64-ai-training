# COMMODORE 64 - SYSTEM COMMANDS

**Summary:** Concise reference for BASIC system-level and I/O commands: LOAD/SAVE (tape and disk ,8), VERIFY, RUN (and RUN nnn), STOP, END, CONT, PEEK(X), POKE X,Y, SYS xxxxx, WAIT X,Y,Z (EOR/AND polling), and USR(X).

## System Commands
LOAD "name"  
- Loads a program from tape (cassette). Use device suffix for disk: LOAD "name",8

SAVE "name"  
- Saves a program to tape. For disk: SAVE "name",8

LOAD "name",8  
- Loads a program from disk drive device 8 (common disk command syntax: comma then device number).

SAVE "name",8  
- Saves a program to disk device 8.

VERIFY "name"  
- Verifies that the program on storage matches RAM (used after SAVE to check for write errors).

RUN  
- Executes the currently loaded BASIC program from its first line.

RUN nnn  
- Begins execution at line number nnn (basic form: RUN 100).

STOP  
- Immediately halts program execution (interactive BREAK).

END  
- Marks the end of a BASIC program or an END statement encountered during execution; execution stops.

CONT  
- Continues execution after a STOP/BREAK (returns to the line where execution was halted).

PEEK(X)  
- Returns the numeric byte value currently at memory address X (0–65535 addressing via expression).

POKE X,Y  
- Stores the byte value Y (0–255) into memory address X.

SYS xxxxx  
- Jumps to and begins executing machine code at absolute memory address xxxxx (decimal or expression). Often used for calling machine-language routines.

WAIT X,Y,Z  
- Polling instruction: the BASIC interpreter repeatedly reads memory location X; it computes (PEEK(X) XOR Z) AND Y. WAIT returns when that result is nonzero. Used for synchronization with hardware/status bytes.

USR(X)  
- Calls a machine-language subroutine with X passed as the numeric argument (calling convention depends on the loaded machine code); returns the numeric result to BASIC.

## References
- "operators_relational_and_logical" — expands on operators used in expressions and conditions (EOR/XOR, AND, comparison operators)
- "editing_and_formatting_commands" — expands on commands for editing and formatting program listings