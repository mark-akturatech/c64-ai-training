# SIN: PERFORM SIN ($E26B) — KERNAL Disassembly (Magnus Nyman)

**Summary:** The KERNAL SIN routine at $E26B computes the sine of a floating-point number. It sets up registers and zero-page locations, calls several supporting routines, and utilizes the PI2 constants table for trigonometric calculations. The routine concludes by jumping to the floating-point result handler at $E043.

**Description**

This routine is the KERNAL "SIN" entry sequence used by BASIC. It performs register and zero-page setup, calls helper routines that prepare the floating-point input and series evaluation, preserves a zero-page byte on the stack, applies a conditional sign inversion to a byte at $12, and finally transfers control to the floating-point result handler.

Step-by-step behavior:

- JSR $BC0C — Calls the `movaf` routine to move the floating-point accumulator (FAC) to the argument.
- LDA #$E5; LDY #$E2; LDX $6E — Sets up registers to point to the PI2 constants table at $E2E0.
- JSR $BB07 — Calls the `fdiv` routine to divide the argument by PI/2.
- JSR $BC0C — Calls `movaf` again to update the FAC.
- JSR $BCCC — Calls the `int` routine to extract the integer part of the result.
- LDA #$00; STA $6F — Clears the zero-page location $6F.
- JSR $B853 — Calls the `fsub` routine to subtract the integer part from the original value.
- LDA #$EA; LDY #$E2; JSR $B850 — Calls the `faddh` routine to add the constant at $E2EA to the result.
- LDA $66; PHA — Saves the sign byte of the FAC on the stack.
- BPL $E29D — If the sign is positive, skips the next step.
- JSR $B849 — Calls the `fadd` routine to add the constant at $E2E0 to the result.
- LDA $66; BMI $E2A0 — If the sign is negative, branches to $E2A0.
- LDA $12; EOR #$FF; STA $12 — Inverts the byte at $12 to flip the sign.
- JSR $BFB4 — Calls the `negop` routine to negate the FAC.
- LDA #$EA; LDY #$E2; JSR $B867 — Calls the `fadd` routine to add the constant at $E2EA to the result.
- PLA — Restores the sign byte from the stack.
- BPL $E2AD — If the sign is positive, skips the next step.
- JSR $BFB4 — Calls `negop` again to negate the FAC.
- LDA #$EF; LDY #$E2; JMP $E043 — Jumps to the floating-point result handler.

## Source Code

```asm
.,E26B 20 0C BC    JSR $BC0C
.,E26E A9 E5       LDA #$E5
.,E270 A0 E2       LDY #$E2
.,E272 A6 6E       LDX $6E
.,E274 20 07 BB    JSR $BB07
.,E277 20 0C BC    JSR $BC0C
.,E27A 20 CC BC    JSR $BCCC
.,E27D A9 00       LDA #$00
.,E27F 85 6F       STA $6F
.,E281 20 53 B8    JSR $B853
.,E284 A9 EA       LDA #$EA
.,E286 A0 E2       LDY #$E2
.,E288 20 50 B8    JSR $B850
.,E28B A5 66       LDA $66
.,E28D 48          PHA
.,E28E 10 0D       BPL $E29D
.,E290 20 49 B8    JSR $B849
.,E293 A5 66       LDA $66
.,E295 30 09       BMI $E2A0
.,E297 A5 12       LDA $12
.,E299 49 FF       EOR #$FF
.,E29B 85 12       STA $12
.,E29D 20 B4 BF    JSR $BFB4
.,E2A0 A9 EA       LDA #$EA
.,E2A2 A0 E2       LDY #$E2
.,E2A4 20 67 B8    JSR $B867
.,E2A7 68          PLA
.,E2A8 10 03       BPL $E2AD
.,E2AA 20 B4 BF    JSR $BFB4
.,E2AD A9 EF       LDA #$EF
.,E2AF A0 E2       LDY #$E2
.,E2B1 4C 43 E0    JMP $E043
```

## Key Registers

- **$66**: Sign byte of the floating-point accumulator (FAC).
- **$6E**: Pointer to the PI2 constants table at $E2E0.
- **$6F**: Zero-page location cleared during the routine.
- **$12**: Byte used for sign inversion.

## References

- "cos_via_sin" — COS implementation that calls SIN after adding pi/2
- "pi2_trig_constants_table" — Holds SIN series constants and counters referenced by this routine
- "tan_routine" — TAN implementation that calls SIN for sine computation

## Labels
- SIN
