# Running the executable demo (LOAD "DEMO.O",8,1 ; SYS 4096)

**Summary:** Shows the exact commands to load the executable image DEMO.O from device 8 (disk drive) using LOAD "DEMO.O",8,1 and to start it with SYS 4096 (start address 4096 / $1000). Includes minimal system-setup notes and references to related assembly and interrupt-flow chunks.

## Instructions
Place the disk containing DEMO.O in the drive assigned to device 8, power on the C64, and enter the two commands at the BASIC prompt to load and run the program. The LOAD form shown (comma 1) tells the DOS to load the program image to the address contained in the file header; SYS 4096 transfers execution to decimal 4096 ($1000) to begin the demo.

Minimal checklist:
- Ensure disk with DEMO.O is in the drive wired as device 8.
- At the BASIC READY prompt, type the LOAD command shown below and wait for the READY prompt.
- Enter the SYS command shown below to start execution.

(Parenthetical clarifications: device 8 = disk drive; 4096 decimal = $1000 hexadecimal.)

## Source Code
```basic
LOAD "DEMO.O",8,1
SYS 4096
```

## References
- "raster_example_and_assembly_notes" — expands on which assembly listing the executable corresponds to
- "interrupt_flow_two_routines" — expands on what the running program does with interrupts
