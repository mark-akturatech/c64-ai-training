# Series evaluation loop for EXP/SQR^2 (ROM $E043–$E08C)

**Summary:** Repeated FAC1 * (AY) multiply-and-add loop implementing polynomial/series evaluation used by EXP, SQR^2 and related kernels. Saves/restores pointer and count ($71/$72/$67), packs FAC1 into zero page pointer(s) ($57/$5C), calls convert AY (JSR $BA28), adds (AY) into FAC1 (JSR $B867), advances a 5‑byte-per‑coefficient table pointer and loops until count reaches zero.

## Description
This ROM routine (entry at $E043) evaluates a polynomial/series by iterating over a table of coefficients (5 bytes per coefficient), performing repeated FAC1 * (AY) multiplications and adding the coefficient term into FAC1.

Behavior summary (stepwise):
- Save/restore a 16‑bit table pointer in zero page ($71 = low, $72 = high).
- Pack FAC1 into a zero page coefficient pointer area (JSR $BBCA stores into $57; later JSR $BBC7 stores into $5C) to prepare for repeated convert/operate calls.
- Repeated sequence for each coefficient:
  - Call convert AY routine (JSR $BA28) with pointer in $57/$5C (Y=0) to produce (AY) for the current coefficient.
  - Read the coefficient count byte from the table via the pointer ($71,$72) into $67 and decrement as loop counter.
  - Advance the table pointer to the next coefficient (pointer += 5). The code performs a 16‑bit add of immediate #$05 with carry handling: ADC #$05; BCC/INY as needed.
  - Add the just-converted (AY) term to FAC1 via JSR $B867.
  - Repeat until coefficient count ($67) reaches zero.
- Routine ends with RTS at $E08C.

Important zero-page and pointer usage (as implemented in code):
- $71/$72 — saved table pointer (low/high) used to load coefficient count and to step through the coefficient entries.
- $67 — coefficient count (byte) read from the table and used as loop counter.
- $57/$5C — temporary pointers/slots used by the convert routines (packed FAC1 placed there prior to converting).

Call relationships visible in this snippet:
- JSR $BBCA — pack FAC1 into $57
- JSR $BA28 — convert AY (does FAC1 * (AY) conversion using pointer at $57/$5C)
- JSR $BBC7 — pack FAC1 into $5C
- JSR $B867 — add (AY) to FAC1
- This sequence is entered by EXP/power driver/other kernels to compute series for exponentiation/power functions.

**[Note: Source may contain an error — the comment shows "FCA1*(AY)" in one line; likely intended "FAC1*(AY)".]**

## Source Code
```asm
.,E043 85 71    STA $71         save count pointer low byte
.,E045 84 72    STY $72         save count pointer high byte
.,E047 20 CA BB JSR $BBCA       pack FAC1 into $57
.,E04A A9 57    LDA #$57        set pointer low byte (Y already $00)
.,E04C 20 28 BA JSR $BA28       do convert AY, FCA1*(AY)
.,E04F 20 5D E0 JSR $E05D       go do series evaluation
.,E052 A9 57    LDA #$57        pointer to original # low byte
.,E054 A0 00    LDY #$00        pointer to original # high byte
.,E056 4C 28 BA JMP $BA28       do convert AY, FCA1*(AY)
                                do series evaluation
.,E059 85 71    STA $71         save count pointer low byte
.,E05B 84 72    STY $72         save count pointer high byte
                                do series evaluation
.,E05D 20 C7 BB JSR $BBC7       pack FAC1 into $5C
.,E060 B1 71    LDA ($71),Y     get constants count
.,E062 85 67    STA $67         save constants count
.,E064 A4 71    LDY $71         get count pointer low byte
.,E066 C8       INY             increment it (now constants pointer)
.,E067 98       TYA             copy it
.,E068 D0 02    BNE $E06C       skip next if no overflow
.,E06A E6 72    INC $72         else increment high byte
.,E06C 85 71    STA $71         save low byte
.,E06E A4 72    LDY $72         get high byte
.,E070 20 28 BA JSR $BA28       do convert AY, FCA1*(AY)
.,E073 A5 71    LDA $71         get constants pointer low byte
.,E075 A4 72    LDY $72         get constants pointer high byte
.,E077 18       CLC             clear carry for add
.,E078 69 05    ADC #$05        +5 to low pointer (5 bytes per constant)
.,E07A 90 01    BCC $E07D       skip next if no overflow
.,E07C C8       INY             increment high byte
.,E07D 85 71    STA $71         save pointer low byte
.,E07F 84 72    STY $72         save pointer high byte
.,E081 20 67 B8 JSR $B867       add (AY) to FAC1
.,E084 A9 5C    LDA #$5C        set pointer low byte to partial
.,E086 A0 00    LDY #$00        set pointer high byte to partial
.,E088 C6 67    DEC $67         decrement constants count
.,E08A D0 E4    BNE $E070       loop until all done
.,E08C 60       RTS             
```

## References
- "exp_kernel_continuation_and_overflow_handling" — called/entered by EXP kernel to evaluate exponentiation series
- "exp_constants_series_table" — reads coefficient counts and 5-byte constants from this table
- "power_function_driver" — power driver uses LOG/EXP which triggers series evaluation