# Subroutines: JSR, JMP and the KERNAL print routine ($FFD2)

**Summary:** JSR (Jump to Subroutine) calls a machine-language subroutine by absolute address; JMP performs an unconditional jump. The KERNAL contains a print-character routine at $FFD2 (expects CBM ASCII in A) and a KERNAL jump table in $FF84-$FFF5 that JMPs to system I/O routines.

## Subroutines and KERNAL usage
- JSR <absolute> is the machine instruction used to call a subroutine.
- JMP <absolute> performs an unconditional jump (similar to BASIC GOTO).
- The Commodore 64 KERNAL provides standardized machine-language subroutines for system I/O. One such routine prints a single character to the screen; it expects the CBM ASCII code of the character in the accumulator (A) and is located at $FFD2.
- The KERNAL maintains a jump table (a list of standardized entry points that JMP to internal OS routines) between $FF84 and $FFF5. Programs call routines via these entry points (e.g. JSR $FFD2 to print a character).
- In the example below, BRK is used at the end of the machine program to return control to the 64MON monitor.

## Source Code
```asm
.A 1400 LDA #$48     - load the CBM ASCII code of "H"
.A 1402 JSR $FFD2    - print it
.A 1405 LDA #$49     - load the CBM ASCII code of "I"
.A 1407 JSR $FFD2    - print that too
.A 140A LDA #$0D     - print a carriage return as well
.A 140C JSR $FFD2
.A 140F BRK          - return to 64MON
.G 1400              - will print "HI" and return to 64MON
```

## Key Registers
- $FFD2 - KERNAL - CHROUT (print character) routine; expects CBM ASCII in A.
- $FF84-$FFF5 - KERNAL - Jump table entries (JMPs to KERNAL subroutines, system I/O entry points).

## References
- "branches_and_testing" — expands on subroutines and program control flow
- "alphabet_program_example" — uses the KERNAL print routine inside a loop to print the alphabet

## Labels
- CHROUT

## Mnemonics
- JSR
- JMP
