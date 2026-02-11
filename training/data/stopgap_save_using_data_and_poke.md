# MACHINE - Save short machine code using BASIC DATA/POKE (addresses $033C-$034F / 828-847)

**Summary:** Demonstrates a stopgap method using BASIC PRINT PEEK to list bytes from memory ($033C-$034F = decimal 828–847), transcribing them into DATA statements and reconstructing the machine code with a READ/POKE loop and SYS. Shows example decimal output, DATA lines, and a complete BASIC program to restore and run the routine.

## Procedure
1. Identify the machine-language block in memory. This example uses $033C-$034F (decimal 828–847).
2. Dump the bytes as decimal using BASIC:
   - FOR J=828 TO 847:PRINT PEEK(J):NEXT J
   This prints each byte (decimal) from the chosen memory range.
3. Transcribe the printed decimal bytes into one or more DATA statements so they become part of a BASIC program (DATA lines SAVE/LOAD normally).
4. Reconstruct the machine code into memory with a READ/POKE loop:
   - FOR J=828 TO 847:READ X:POKE J,X:NEXT J
   This reads the DATA values and POKEs them back into the original addresses.
5. Run the machine code with SYS (pointing to the start address in decimal):
   - SYS 828
   In the example the first opcode 162,0 corresponds to LDX #$00 (162=$A2, 0), and the tail bytes 72,69,76,76,79 represent ASCII "HELLO".
6. (Optional) Wrap a run loop or repeated SYS calls in BASIC if desired (example repeats SYS 3 times).

Notes:
- The DATA statements are ordinary BASIC lines, so they will save with the program.
- When transcribing, keep the exact byte order and decimal values. No conversion is required for the READ/POKE restore.
- The method is intended as a short-term workaround for small ML routines when standard binary SAVE is unavailable.

## Source Code
```basic
FOR J=828 TO 847:PRINT PEEK(J):NEXT J

' Example printed output (decimal bytes):
' 162 0 189 74 3 32 210 255 232 224 6
' 208 245 96 72 69 76 76 79 13

50 DATA 162,0,189,74,3,32,210,255,232,224,6
60 DATA 208,245,96,72,69,76,76,79,13
80 FOR J=828 TO 847:READ X:POKE J,X:NEXT J
100 FOR J=1 TO 3
110 SYS 828
120 NEXT J
```

## References
- "save_cassette_disk_pointer_issues" — expands on addresses the cassette/disk save problem  
- "summary_learning_points_and_exercises" — summarizes what was learned and suggests projects
