# FADDH ($B849) and FSUB ($B850)

**Summary:** ROM entry points $B849 (FADDH) and $B850 (FSUB). FADDH adds 0.5 to Floating Point Accumulator 1 (FAC1). FSUB loads a memory number into Floating Point Accumulator 2 (FAC2) to prepare for subtracting FAC1 from that memory number, then falls through to the next routine. (FAC1/FAC2 = ROM floating-point accumulators.)

**Description**
- **FADDH** — Entry $B849. Operation: add 0.5 to the contents of FAC1. Short label in ROM: "Add .5 to Contents of Floating Point Accumulator #1".
- **FSUB** — Entry $B850. Operation: load the floating-point value found in memory into FAC2, then continue execution into the next ROM routine which performs the subtraction (i.e., subtract FAC1 from the value now in FAC2). Short label in ROM: "Subtract FAC1 from a Number in Memory" with the additional note that the routine "moves the number in memory into FAC2, and falls through to the next routine."

Behavioral notes:
- FSUB itself does not complete the subtraction — it is the preparatory load of FAC2 and relies on the following routine(s) to perform the arithmetic and any sign/complement handling.
- FADDH is a dedicated small helper that increments FAC1 by exactly 0.5.

## Source Code
```assembly
; FADDH ($B849)
B849:  A9 11     LDA #$11        ; Load low byte of address of 0.5 constant
B84B:  A0 BF     LDY #$BF        ; Load high byte of address of 0.5 constant
B84D:  4C 67 B8  JMP $B867       ; Jump to FADD routine

; FSUB ($B850)
B850:  4C 53 B8  JMP $B853       ; Jump to FSUBT routine
```

## Key Registers
- **FAC1**: Floating Point Accumulator 1
- **FAC2**: Floating Point Accumulator 2

## References
- "fsubt_subtraction_operation" — expands on Continuation: BASIC subtraction (FSUBT) complements sign and adds.
- "fadd_faddt_fadd4_addition_operations" — expands on related addition routines (FADD family) which mirror FSUB functionality for addition.

## Labels
- FADDH
- FSUB
