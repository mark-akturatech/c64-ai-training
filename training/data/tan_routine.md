# TAN (KERNAL) — BASIC TAN routine ($E2B4)

**Summary:** KERNAL TAN routine entry at $E2B4; calls the SIN implementation ($E26B) and helper routines ($E0F6, $BBA2, $BB0F). Uses JSR/JSR/JMP/PHY/PLA-style control flow, clears/sets temporary zero-page locations ($12, $66), and returns via jumps depending on intermediate flags.

## Description
This routine implements TAN for BASIC by invoking the SIN routine at $E26B and then performing fixed helper calls and branching to finalize the result.

High-level flow:
- Perform an initial JSR to $BBCA (setup/stack handling).
- Clear zero-page temporary $12 (LDA #$00 / STA $12).
- Call SIN implementation at $E26B (JSR $E26B).
- Prepare parameters and call helper routine $E0F6 (set X=#$4E, Y=#$00, JSR $E0F6).
- Load immediate $57 and call helper $BBA2 with Y=#$00 (LDA #$57; JSR $BBA2).
- Clear zero-page $66 (STA $66).
- Use value in $12 to branch via JSR $E2DC (which contains a PHA and JMP $E29D).
- Load $4E into A, clear Y and JMP $BB0F to finish (JMP $BB0F).

A local push/branch is present in the subroutine at $E2DC:
- $E2DC: PHA
- $E2DD: JMP $E29D

This indicates an intermediate push of A and an immediate transfer to $E29D for further processing before final return/jump sequences.

## Source Code
```asm
; TAN: PERFORM TAN
.,E2B4 20 CA BB    JSR $BBCA
.,E2B7 A9 00       LDA #$00
.,E2B9 85 12       STA $12
.,E2BB 20 6B E2    JSR $E26B
.,E2BE A2 4E       LDX #$4E
.,E2C0 A0 00       LDY #$00
.,E2C2 20 F6 E0    JSR $E0F6
.,E2C5 A9 57       LDA #$57
.,E2C7 A0 00       LDY #$00
.,E2C9 20 A2 BB    JSR $BBA2
.,E2CC A9 00       LDA #$00
.,E2CE 85 66       STA $66
.,E2D0 A5 12       LDA $12
.,E2D2 20 DC E2    JSR $E2DC
.,E2D5 A9 4E       LDA #$4E
.,E2D7 A0 00       LDY #$00
.,E2D9 4C 0F BB    JMP $BB0F
.,E2DC 48          PHA
.,E2DD 4C 9D E2    JMP $E29D
```

## References
- "sin_routine_sequence" — expands on invokes SIN routine to obtain sine components used in tangent calculation
- "pi2_trig_constants_table" — expands on sin/tan series constants used indirectly during evaluation

## Labels
- TAN
