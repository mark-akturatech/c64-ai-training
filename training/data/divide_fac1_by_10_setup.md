# Divide FAC1 by 10 (ROM entry $BAFE-$BB12)

**Summary:** Sets up a divide-by-10 by rounding/copying FAC1 into FAC2, loading the pointer to the floating-point constant 10 into A/Y ($F9/$BA), clearing/sign-setting X and saving sign-compare at zero page $6F, then unpacking (AY) into FAC1 and jumping to the generic divide routine (FAC2/FAC1) at $BB12. Search terms: FAC1, FAC2, divide-by-10, (AY) unpack, JSR $BC0C, JSR $BBA2, JMP $BB12.

## Operation
This ROM fragment prepares and performs FAC1 / 10 using the generic divide core that computes FAC2 / FAC1.

Steps:
1. JSR $BC0C — Round FAC1 and copy the rounded result into FAC2 (so FAC2 becomes the numerator).
2. LDA #$F9 / LDY #$BA — Load A (low) and Y (high) with the pointer to the floating-point constant for 10 (address bytes $F9/$BA).
3. LDX #$00 — Clear X (used here as the sign flag).
4. STX $6F — Store X into zero page $6F to save the sign-compare state (FAC1 EOR FAC2 uses this zero page location).
5. JSR $BBA2 — Unpack memory at (AY) into FAC1 (this loads the floating-point 10 constant into FAC1).
6. JMP $BB12 — Jump into the generic divide core that performs FAC2 / FAC1 (thus producing original FAC1 / 10).

Notes:
- The routine uses the A/Y pair as a pointer to the floating-point constant 10; the unpack routine at $BBA2 expects that pointer in A and Y.
- Zero page $6F is used to hold the sign-compare/save used by the divide algorithm (stored here by STX).
- The actual divide core begins at $BB12 (see referenced "divide_ay_by_fac1_core_algorithm" for the full algorithm).

## Source Code
```asm
                                *** divide FAC1 by 10
.,BAFE 20 0C BC JSR $BC0C       round and copy FAC1 to FAC2
.,BB01 A9 F9    LDA #$F9        set 10 pointer low byte
.,BB03 A0 BA    LDY #$BA        set 10 pointer high byte
.,BB05 A2 00    LDX #$00        clear sign

                                *** divide by (AY) (X=sign)
.,BB07 86 6F    STX $6F         save sign compare (FAC1 EOR FAC2)
.,BB09 20 A2 BB JSR $BBA2       unpack memory (AY) into FAC1
.,BB0C 4C 12 BB JMP $BB12       do FAC2/FAC1
                                Perform divide-by
```

## References
- "divide_ay_by_fac1_core_algorithm" — generic divide routine used to perform FAC2/FAC1 (entry at $BB12)
- "multiply_fac1_by_10_and_constant" — contains the floating-point representation and placement of the constant 10 used here