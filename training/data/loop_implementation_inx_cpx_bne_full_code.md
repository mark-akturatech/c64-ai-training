# MACHINE - HELLO loop using indexed addressing

**Summary:** Example 6502 loop that prints "HELLO" using indexed addressing ($034A,X), the KERNAL CHROUT call at $FFD2, and loop control with INX/CPX/BNE. Shows assembled addresses, explains INX/INY/DEX/DEY and CPX + BNE semantics.

## Loop and instruction behavior
This routine prints a six-character string stored at $034A using X as an index. X is initialized to 0, used as an offset in the indexed load (LDA $034A,X), and incremented each loop with INX. The character is printed by calling the KERNAL character output routine at $FFD2 via JSR.

Key points:
- LDX #$00 initializes the index register X to 0.
- LDA $034A,X uses indexed (zero/absolute,X) addressing to load the byte at address ($034A + X).
- JSR $FFD2 calls the KERNAL CHROUT routine (ROM) to output the character; JSR pushes the return address, RTS later returns from this routine.
- INX increments the X register by one. (There are symmetrical instructions: INY increments Y, DEX decrements X, DEY decrements Y.)
- CPX #$06 compares X to the immediate value $06 (sets processor flags as if computing X - #$06). CPX does not change X.
- BNE $033E branches back to the load/print instruction when the zero flag is clear (i.e., when X != $06). Thus the loop continues while X is not equal to 6.
- The loop runs for X = 0..5 (six iterations), printing six characters, then falls through to RTS which returns to the caller.

Note: the assembler listing shows absolute addresses; the BNE is written with the target address ($033E) for clarity, though machine code uses a relative offset.

## Source Code
```asm
.A 033C  LDX #$00
.A 033E  LDA $034A,X
.A 0341  JSR $FFD2
.A 0344  INX
.A 0345  CPX #$06
.A 0347  BNE $033E
.A 0349  RTS
```

## References
- "loops_introduction_indexed_addressing" — expands on using indexed addressing to implement loops
- "storing_data_message_and_basic_call_loops" — expands on placing string data and calling the routine from BASIC

## Labels
- CHROUT

## Mnemonics
- LDX
- LDA
- JSR
- INX
- INY
- DEX
- DEY
- CPX
- BNE
- RTS
