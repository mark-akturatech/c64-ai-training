# DATA STATEMENTS (READ/POKE) — entering machine language from BASIC

**Summary:** Method for adding machine-language code to a BASIC program by embedding byte values in DATA statements, then READing and POKEing them into memory at program start; keywords: DATA, READ, POKE, machine language, BASIC, memory, save, debug.

**DATA STATEMENTS (READ/POKE)**
Machine-language routines are encoded as numeric byte values placed in BASIC DATA statements. At runtime, the BASIC program READs those DATA values and POKEs them into the target memory addresses before transferring control to the machine code. This requires no external tools or monitor—entry is entirely within BASIC.

Advantages:
- Easiest method to implement from BASIC (no external tools).
- No special steps required to save both the BASIC and machine-code parts together.
- Fairly easy to debug (you can instrument the BASIC loader and inspect memory with PEEK/POKE).

Drawbacks:
- Uses more BASIC/data memory than a binary machine-code file would.
- There is a perceptible delay while the BASIC loader reads and POKEs all bytes into memory.
- Generally better suited to smaller routines due to memory and performance cost.

Use case summary: Best for small machine-code routines that must be distributed or edited purely within BASIC.

**MACHINE LANGUAGE MONITOR ENTRY**
Machine language monitors, such as 64MON, allow for the direct entry, editing, and debugging of machine language programs. These monitors provide a more efficient means of entering machine code compared to DATA statements.

Advantages:
- Easier entry of machine language routines with symbolic representation.
- Built-in debugging tools.
- Faster saving and loading of machine code.

Drawbacks:
- Typically requires the BASIC program to load the machine language routine from tape or disk when started.

Example:
In this example, the machine language routine is loaded into memory when the BASIC program starts. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_5/page_310.html?utm_source=openai))

**EDITOR/ASSEMBLER PACKAGE**
Editor/assembler packages provide a comprehensive environment for writing, assembling, and debugging machine language programs. These tools offer features like label support, macros, and more user-friendly interfaces.

Advantages:
- Simplifies the process of writing and managing machine language code.
- Provides advanced features like labels and macros.
- Often includes integrated debugging tools.

Drawbacks:
- Similar to machine language monitors, they generally require the BASIC program to load the machine language routine from external storage when started.

**BASIC EXAMPLE: DATA/READ/POKE SEQUENCE**
Below is a concrete example demonstrating how to embed machine language code within a BASIC program using DATA statements, and then load and execute it:

In this example:
- Lines 20-50 read the machine code bytes from the DATA statements and POKE them into memory starting at address 49152 ($C000).
- Line 70 executes the machine code using the SYS command.
- The machine code in the DATA statements sets the border color to white (color code 1) and the background color to black (color code 0). ([commodore.ca](https://www.commodore.ca/manuals/c64_programmers_reference/c64-programmers_reference_guide-05-basic_to_machine_language.pdf?utm_source=openai))

**SAVING AND LOADING PROGRAMS**
To save a combined BASIC and machine language program:

1. Enter the BASIC program and machine language code as shown above.
2. Save the program using the following command:
   This saves the entire program, including both BASIC and machine language portions, to disk.

To load and run the program:

1. Load the program using:
2. Run the program:
This method ensures that both the BASIC and machine language components are saved and loaded together, maintaining the integrity of the program. ([commodore.ca](https://www.commodore.ca/manuals/c64_programmers_reference/c64-programmers_reference_guide-05-basic_to_machine_language.pdf?utm_source=openai))

## Source Code

```basic
10 IF FLAG=1 THEN 20
15 FLAG=1:LOAD"MACHINE LANGUAGE ROUTINE NAME",1,1
20 REM Rest of BASIC program
```

```basic
10 REM Load machine code into memory
20 FOR I = 0 TO 8
30 READ A
40 POKE 49152 + I, A
50 NEXT I
60 REM Execute machine code
70 SYS 49152
80 END
1000 DATA 169, 1, 141, 2, 208, 169, 0, 141, 3, 208, 96
```

   ```basic
   SAVE "PROGRAM NAME",8
   ```

   ```basic
   LOAD "PROGRAM NAME",8,1
   ```

   ```basic
   RUN
   ```


## References
- "data_statements_method" — expands on DATA/READ/POKE entry method
- "machine_monitor_method" — expands on 64MON and monitor-based entry method