# Machine Language and the Commodore 64 Operating System

**Summary:** Machine language is the CPU's native instruction set; the Commodore 64's operating system and CBM BASIC interpreter are large machine-language programs stored in ROM that provide system services, the READY prompt, and translate BASIC commands into machine-language routines.

## What is machine language?
Machine language is the native instruction set understood directly by the microprocessor (the Commodore 64's CPU). It is the only language the CPU executes without further translation. Programs written in higher-level languages (for example, CBM BASIC) are implemented by machine-language routines that the CPU executes.

## Operating system and BASIC interpreter (ROM-resident machine language)
The Commodore 64 contains a ROM-resident machine-language program called the OPERATING SYSTEM. Because it resides in nonvolatile ROM it is not altered by power cycles. The operating system:
- Organizes and manages system memory for various tasks.
- Handles input from the keyboard and drives the built-in screen editor (cursor movement, DEL/INS, editing functions).
- Provides system services and the "intelligence/personality" of the machine on power-up.

A separate, large ROM-resident machine-language program, the BASIC INTERPRETER, recognizes CBM BASIC statements (PRINT, GOTO, etc.) and invokes the appropriate machine-language routines to carry them out. BASIC source is parsed and interpreted by these machine-language routines; if a command is unrecognized or malformed, the interpreter returns:
?SYNTAX ERROR
READY.

## READY prompt and basic interaction
After the operating system completes its initialization at power-up, it presents the READY prompt and accepts keyboard input. The built-in screen editor and BASIC interpreter operate via the ROM machine-language routines provided by the OS and interpreter—typing, editing, and executing BASIC all route through these ROM routines.

## References
- "memory_map_and_machine_code_overview" — expands on where the operating system and BASIC interpreter reside in memory  
- "writing_your_first_machine_language_instruction" — expands on how machine instructions are represented in memory
