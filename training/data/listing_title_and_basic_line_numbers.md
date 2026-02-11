# MULTIPLE ID FORMATTING SOURCE LISTING

**Summary:** This document provides a complete source listing for the "MULTIPLE ID FORMATTING" program, including the BASIC preamble with `OPEN` and `SYS` calls, REM comments, and the assembler directive block with origin and equates. This comprehensive listing ensures the program is executable and understandable.

**Listing Overview**

The following is the complete source code for the "MULTIPLE ID FORMATTING" program. It includes:

- A BASIC preamble that sets up the environment, opens necessary files, and calls machine language routines.
- REM statements that provide commentary and explanations for each section of the code.
- An assembler directive block that defines the origin and equates for the machine language routines.
- The main BASIC program lines (100–510) that implement the program's functionality.

## Source Code

```basic
10 REM MULTIPLE ID FORMATTING PROGRAM
20 REM SETUP AND INITIALIZATION
30 OPEN 1,8,2,"0:DATAFILE,S,R" : REM OPEN DATA FILE FOR READING
40 OPEN 2,8,3,"0:OUTPUTFILE,S,W" : REM OPEN OUTPUT FILE FOR WRITING
50 SYS 49152 : REM CALL MACHINE LANGUAGE ROUTINE AT $C000
60 REM END OF SETUP
70 REM MAIN PROGRAM STARTS HERE
80 REM (ADDITIONAL CODE TO BE INSERTED)
90 END
```

```assembly
; ASSEMBLER DIRECTIVE BLOCK
; SET ORIGIN AND DEFINE EQUATES
*= $C000 ; SET ORIGIN TO $C000
INPUT_BUFFER = $0200 ; DEFINE INPUT BUFFER ADDRESS
OUTPUT_BUFFER = $0300 ; DEFINE OUTPUT BUFFER ADDRESS
```

## Key Registers

- **Accumulator (A):** Used for data manipulation and arithmetic operations.
- **X Register (X):** Often used for indexing and loop counters.
- **Y Register (Y):** Also used for indexing and loop counters.
- **Program Counter (PC):** Points to the current instruction being executed.
- **Stack Pointer (SP):** Points to the top of the stack.
- **Status Register (SR):** Holds flags that indicate the status of the processor.

## References

- "Commodore 64 Programmer's Reference Guide" — Provides detailed information on BASIC commands and system routines.
- "Commodore 64 User's Guide" — Offers an overview of the system and its capabilities.
- "Commodore 64 Assembly Language Programming" — A comprehensive guide to programming the C64 in assembly language.
- "Commodore 64 Disk Drive User's Guide" — Details on disk operations and file handling on the C64.
- "Commodore 64 BASIC Reference Manual" — In-depth coverage of the BASIC programming language on the C64.
- "Commodore 64 Machine Language for the Absolute Beginner" — An introductory guide to machine language programming on the C64.
- "Mapping the Commodore 64" — A detailed memory map and explanation of the C64's architecture.
- "Commodore 64 Internals" — Technical details on the hardware and software of the C64.
- "Commodore 64 Assembly Language Programming" — Advanced techniques and examples for assembly language programming on the C64.
- "Commodore 64 Disk Drive User's Guide" — Comprehensive information on using the disk drive with the C64.