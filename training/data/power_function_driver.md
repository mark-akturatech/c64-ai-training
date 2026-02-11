# ROM: Power driver (X^Y) — EXP/LOG/INT handling ($BF7B-$BFBE)

**Summary:** Driver for exponentiation (X^Y) in Commodore 64 ROM; handles zero exponent, negative exponents, integer-only negative-base exponents (calls INT), calls LOG and EXP routines, preserves/restores sign, and conditionally negates FAC1. References ROM addresses and zero-page FAC fields ($69, $6E, $61, $66, $07) and JSRs to INT ($BCCC), LOG ($B9EA), EXP ($BFED), and conversion ($BA28).

## Description
This routine performs the power function X^Y operating on FAC1 (base) and FAC2 (exponent). Behavior and control flow (addresses shown):

- Entry: BEQ $BFED (at $BF7B) can jump immediately to EXP() when the branch condition is met (per ROM flow).
- $BF7D: Load FAC2 exponent (zero-page $69). If FAC2 exponent is zero, JMP $B8F9 to clear FAC1 exponent and sign and return (special-case: X^0).
- Prepare destination pointer (XY = $004E) and call pack routine ($BBD4) to pack FAC1 into memory at (XY).
- Test FAC2 sign (zero-page $6E, bit 7). If FAC2 is negative, the exponent must be integer when the base is negative: call INT() ($BCCC) to force FAC2 to integer.
  - After INT(), the code sets source pointer (AY = $004E) and compares FAC1 with memory at (AY) ($BC5B). If they differ, branch so a later LOG() will produce a Function Call error (leaving FAC1 negative).
  - Y is used to carry sign info from INT(); TYA and LDY $07 are used to extract/prepare the sign bit for later use.
- Save FAC1 sign and copy ABS(FAC2) into FAC1 via JSR $BBFE.
- Save the previously obtained sign (TYA/PHA) on the stack to restore later.
- Call LOG() ($B9EA) to compute log(base).
- Set pointer (AY = $004E) and call convert/multiply routine ($BA28) to multiply FAC1 by AY (i.e., compute Y * LOG(X)).
- Call EXP() ($BFED) to compute e^(Y*LOG(X)), producing the magnitude of the result in FAC1.
- After EXP returns, restore the saved sign (PLA), LSR to test a marker bit (b0). If the marker bit is clear, exit without negation.
  - If the marker bit indicates negation is needed: check FAC1 exponent ($61). If exponent is zero, skip negation. Otherwise toggle FAC1 sign byte ($66) by EOR #$FF / STA $66 to complete negation of FAC1.
- Return (RTS).

Stack usage: the routine pushes the saved sign (PHA) before calling LOG/EXP and pops it after EXP to determine whether to negate FAC1.

Behavioral notes preserved from source:
- Zero exponent case is handled early with a jump to the clear/return path.
- Negative exponents are converted to absolute value and copied into FAC1 for the LOG/EXP pipeline.
- When FAC2 is negative and FAC1 (base) is negative, the exponent must be an integer — INT() is called and FAC1 is compared to detect non-integer cases to force a Function Call error later.
- Final sign/negation logic is conditional on the marker bit restored from the stack and the FAC1 exponent being non-zero.

## Source Code
```asm
.,BF7B F0 70    BEQ $BFED       perform EXP()
.,BF7D A5 69    LDA $69         get FAC2 exponent
.,BF7F D0 03    BNE $BF84       branch if FAC2<>0
.,BF81 4C F9 B8 JMP $B8F9       clear FAC1 exponent and sign and return
.,BF84 A2 4E    LDX #$4E        set destination pointer low byte
.,BF86 A0 00    LDY #$00        set destination pointer high byte
.,BF88 20 D4 BB JSR $BBD4       pack FAC1 into (XY)
.,BF8B A5 6E    LDA $6E         get FAC2 sign (b7)
.,BF8D 10 0F    BPL $BF9E       branch if FAC2>0
                                else FAC2 is -ve and can only be raised to an
                                integer power which gives an x + j0 result
.,BF8F 20 CC BC JSR $BCCC       perform INT()
.,BF92 A9 4E    LDA #$4E        set source pointer low byte
.,BF94 A0 00    LDY #$00        set source pointer high byte
.,BF96 20 5B BC JSR $BC5B       compare FAC1 with (AY)
.,BF99 D0 03    BNE $BF9E       branch if FAC1 <> (AY) to allow Function Call error
                                this will leave FAC1 -ve and cause a Function Call
                                error when LOG() is called
.,BF9B 98       TYA             clear sign b7
.,BF9C A4 07    LDY $07         get FAC1 mantissa 4 from INT() function as sign in
                                Y for possible later negation, b0 only needed
.,BF9E 20 FE BB JSR $BBFE       save FAC1 sign and copy ABS(FAC2) to FAC1
.,BFA1 98       TYA             copy sign back ..
.,BFA2 48       PHA             .. and save it
.,BFA3 20 EA B9 JSR $B9EA       perform LOG()
.,BFA6 A9 4E    LDA #$4E        set pointer low byte
.,BFA8 A0 00    LDY #$00        set pointer high byte
.,BFAA 20 28 BA JSR $BA28       do convert AY, FAC1*(AY)
.,BFAD 20 ED BF JSR $BFED       perform EXP()
.,BFB0 68       PLA             pull sign from stack
.,BFB1 4A       LSR             b0 is to be tested
.,BFB2 90 0A    BCC $BFBE       if no bit then exit
                                do - FAC1
.,BFB4 A5 61    LDA $61         get FAC1 exponent
.,BFB6 F0 06    BEQ $BFBE       exit if FAC1_e = $00
.,BFB8 A5 66    LDA $66         get FAC1 sign (b7)
.,BFBA 49 FF    EOR #$FF        complement it
.,BFBC 85 66    STA $66         save FAC1 sign (b7)
.,BFBE 60       RTS
```

## References
- "sqr_entry_unpack_fac1" — expands on SQR entry and similar unpack-to-FAC1 setup used by this driver
- "exp_entry_prepare" — expands on this driver calls EXP(); see EXP entry for preparation and continuation
- "exp_constants_series_table" — expands on log/exp computations using constants from the EXP series table