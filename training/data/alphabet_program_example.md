# Print alphabet using KERNAL CHROUT ($FFD2)

**Summary:** Small 6502 machine-language program for the C64 that prints A–Z using the KERNAL character-output routine JSR $FFD2. Demonstrates LDX, TXA, INX, CPX, BNE, BRK and the 64MON run command (.G 1400).

## Program description
This program initializes the X register with the CBM ASCII code for 'A' (#$41), transfers X to A with TXA, and calls the KERNAL character-output routine at $FFD2 to print the character. It increments X, compares to the value one past 'Z' (#$5B) and loops until all letters have been printed. BRK returns control to the monitor.

Instruction summary:
- LDX #$41 — set X = 'A' (CBM ASCII)
- TXA — transfer X into Accumulator (A = X)
- JSR $FFD2 — call KERNAL CHROUT to print the character in A
- INX — increment X to next character
- CPX #$5B — compare X to one past 'Z' (stop condition)
- BNE $1402 — branch back to the TXA/JSR sequence if not equal
- BRK — breakpoint/return to monitor when finished

Run in 64MON:
- Assemble/listing shown with .A addresses; to execute from $1400 use the monitor command:
  .G 1400

## Source Code
```asm
; Assemble at $1400 in 64MON (addresses shown as .A lines)
.A 1400  LDX #$41      ; X = CBM ASCII "A"
.A 1402  TXA           ; A = X
.A 1403  JSR $FFD2     ; print character (KERNAL CHROUT)
.A 1406  INX           ; bump to next character
.A 1407  CPX #$5B      ; have we gone past "Z"?
.A 1409  BNE $1402     ; no, loop back
.A 140B  BRK           ; yes, return to 64MON
```

## Key Registers
- $FFD2 - KERNAL - CHROUT (character output routine; JSR to print A)

## References
- "subroutines_and_kernal_print" — expands on using the KERNAL character-print routine ($FFD2)
- "branches_and_testing" — expands on using INX, CPX, and BNE to loop until 'Z' is passed
- "writing_your_first_program_example" — expands on practical assembly and execution examples using 64MON

## Labels
- CHROUT
