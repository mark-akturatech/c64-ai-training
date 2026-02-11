# CHROUT two-step example (LDA #$58; JSR $FFD2)

**Summary:** Demonstrates calling the KERNAL CHROUT routine at $FFD2 by placing a character code in the A register (LDA #$58) and JSR $FFD2; shows the minimal two-instruction sequence to output a character (CHROUT, $FFD2, A register, PETSCII).

## Procedure
CHROUT is a KERNAL ROM routine invoked with JSR $FFD2. It outputs the character whose PETSCII code is in the A register to the current output device. The minimal sequence to print an uppercase X is:

1. Load the character code into A (example uses $58 for 'X').
2. JSR $FFD2 to call CHROUT, which sends A to the current output.

**[Note: Source may contain an error — CHROUT expects a PETSCII code in A; the original text calls it "ASCII". Uppercase letters often share codes, but PETSCII is the canonical character set for CHROUT.]**

## Source Code
```asm
        LDA #$58    ; PETSCII 'X' (example)
        JSR $FFD2   ; KERNAL CHROUT - output A
```

## Key Registers
- $FFD2 - KERNAL - CHROUT (outputs the character whose PETSCII code is in A to the current output device)

## References
- "chrout_output_subroutine" — expands on uses of CHROUT to output the A register
- "why_not_poke_screen_vs_ch_rout" — compares CHROUT with direct screen POKEs

## Labels
- CHROUT
