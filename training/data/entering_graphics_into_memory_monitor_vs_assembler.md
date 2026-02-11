# Entering graphics data: Monitor Memory Display vs assembler .BYTE

**Summary:** Describes two methods to place translated graphics bytes into C64 memory: using a machine-language monitor's Memory Display to write bytes directly into RAM (then save that memory range to disk and reference its address), or embedding the bytes in assembler source with .BYTE directives so they are assembled into the program object code.

## Overview
After converting pixel/artwork into a sequence of bytes, you can either write those bytes directly into RAM with a machine-language monitor or include them in assembler source so they become part of the assembled program. Both approaches require you to supply the final address where the graphics reside so the running code can find them.

## Monitor (Memory Display) workflow
- Use the monitor’s Memory Display (or similar write/edit view) to show the RAM range where you want the graphics bytes placed.
- Edit the displayed bytes to match your translated drawing data (enter the byte values directly).
- Save the modified memory range to disk (so it can be reloaded later).
- In your program, enter the address (start location) of the saved graphics so the program can reference and use the data at runtime.

(“Memory Display” writes data directly into RAM at the displayed addresses.)

## Assembler (.BYTE) workflow
- Place the graphics byte sequence in your assembler source using .BYTE (or equivalent) directives, typically in a named data area.
- Assemble the program; the graphics bytes become part of the assembled object code at the address the assembler/linker assigns.
- In your program, reference the symbol or absolute address where the assembler placed the graphics.

(Assembler approach stores graphics in the assembled program/object image rather than directly editing RAM.)

## Additional notes
- The two methods differ in where the bytes live (RAM edited live vs object-code embedded). See cross-reference for tradeoffs and reassembly considerations.

## References
- "assembler_bytes_and_reassembly_considerations" — expands on tradeoffs of assembler approach vs monitor