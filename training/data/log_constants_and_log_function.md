# Commodore 64 ROM — LOG() constants and implementation (FAC1, series coefficients, mapping to series domain)

**Summary:** Contains Commodore BASIC 5.0 ROM floating constants (5‑byte BASIC/FAC format) and the complete LOG() routine implementation (addresses $B9BC–$BA2A): sign/zero tests, FAC1 normalization, mapping x into the series domain using 1/SQRT(2) and SQRT(2), subtraction to form the series argument, squaring and series evaluation calls, adding -0.5 and LOG(2) constants, combining series result with LOG(2), applying saved exponent, and packing final result into FAC1. Series coefficient table and helper call pointers included.

**Description**
This chunk holds:
- The 5‑byte floating constants used by LOG(): 1.0, series counter, series coefficients for the LOG() polynomial, 1/√2, √2, -0.5, and LOG(2). These are stored in BASIC's 5‑byte floating format (used by the FAC registers).
- The complete implementation of the LOG(x) function (entry at $B9EA). The routine:
  - Tests sign and zero (JSR $BC2B). If zero or negative, it invokes the illegal quantity error routine then warm starts.
  - Loads FAC1 exponent, normalizes it (SBC #$7F), and saves it on the stack while zeroing FAC1 exponent (sets FAC1 exponent to 0).
  - Loads pointer to 1/√2 and calls an add-to-FAC routine (JSR $B867) to add 1/√2 to FAC1.
  - Loads pointer to √2 and calls the divide routine (JSR $BB0F) which computes (AY) / FAC1 (i.e., √2 / (x + 1/√2)).
  - Loads pointer to 1 and calls the subtract routine (JSR $B850) to compute (√2/(x+1/√2)) - 1.
  - Loads pointer to the LOG series coefficients and calls the sequence at $E043 which performs squaring and evaluates the series (series evaluator shared with EXP/SIN/COS).
  - Adds the constant -0.5 into FAC1 (JSR $B867 with pointer at $B9E0).
  - Restores the saved FAC1 exponent (PLA) and calls an ASCII digit update routine (JSR $BD7E).
  - Loads pointer to LOG(2) and adds it to FAC1 (JSR $B867).
  - Multiplies FAC1 by the saved exponent (JSR $BA59).
  - Packs the final result into FAC1 (JSR $BC0F).

This routine maps the input x into a transformed variable suitable for a convergent polynomial/logarithm series (via shifts involving 1/√2 and √2, subtraction of 1, and squaring), evaluates the series, applies the -0.5 term, combines the series result with LOG(2), applies the original exponent, and packs the final result into FAC1.

References in the code call shared helpers:
- $B867 — add (AY) to FAC1
- $BB0F — divide AY by FAC1 (and conversion)
- $B850 — subtract FAC1 from AY
- $E043 — square then evaluate series (series evaluator)
- $BD7E — update ASCII digit output
- $BA59 — multiply FAC1 by saved exponent
- $BC0F — pack FAC1 into final result

Addresses shown are ROM addresses (BASIC ROM area) and the constant table is embedded just before the routine.

## Source Code
```asm
.; constants and series for LOG(n)
.:B9BC 81 00 00 00 00           1
.:B9C1 03                       series counter
.:B9C2 7F 5E 56 CB 79            .434255942
.:B9C7 80 13 9B 0B 64            .576584541
.:B9CC 80 76 38 93 16            .961800759
.:B9D1 82 38 AA 3B 20           2.88539007
.:B9D5 80 35 04 F3 34            .707106781 = 1/SQR(2)
.:B9DB 81 35 04 F3 34           1.41421356 = SQR(2)
.:B9E0 80 80 00 00 00           -.5
.:B9E5 80 31 72 17 F8            .693147181  =  LOG(2)

.; perform LOG()
.,B9EA 20 2B BC JSR $BC2B       test sign and zero
.,B9ED F0 02    BEQ $B9F1       if zero do illegal quantity error then warm start
.,B9EF 10 03    BPL $B9F4       skip error if +ve
.,B9F1 4C 48 B2 JMP $B248       do illegal quantity error then warm start
.,B9F4 A5 61    LDA $61         get FAC1 exponent
.,B9F6 E9 7F    SBC #$7F        normalise it
.,B9F8 48       PHA             save it
.,B9F9 A9 80    LDA #$80        set exponent to zero
.,B9FB 85 61    STA $61         save FAC1 exponent
.,B9FD A9 D6    LDA #$D6        pointer to 1/root 2 low byte
.,B9FF A0 B9    LDY #$B9        pointer to 1/root 2 high byte
.,BA01 20 67 B8 JSR $B867       add (AY) to FAC1 (1/root2)
.,BA04 A9 DB    LDA #$DB        pointer to root 2 low byte
.,BA06 A0 B9    LDY #$B9        pointer to root 2 high byte
.,BA08 20 0F BB JSR $BB0F       convert AY and do (AY)/FAC1 (root2/(x+(1/root2)))
.,BA0B A9 BC    LDA #$BC        pointer to 1 low byte
.,BA0D A0 B9    LDY #$B9        pointer to 1 high byte
.,BA0F 20 50 B8 JSR $B850       subtract FAC1 ((root2/(x+(1/root2)))-1) from (AY)
.,BA12 A9 C1    LDA #$C1        pointer to series for LOG(n) low byte
.,BA14 A0 B9    LDY #$B9        pointer to series for LOG(n) high byte
.,BA16 20 43 E0 JSR $E043       ^2 then series evaluation
.,BA19 A9 E0    LDA #$E0        pointer to -0.5 low byte
.,BA1B A0 B9    LDY #$B9        pointer to -0.5 high byte
.,BA1D 20 67 B8 JSR $B867       add (AY) to FAC1
.,BA20 68       PLA             restore FAC1 exponent
.,BA21 20 7E BD JSR $BD7E       evaluate new ASCII digit
.,BA24 A9 E5    LDA #$E5        pointer to LOG(2) low byte
.,BA26 A0 B9    LDY #$B9        pointer to LOG(2) high byte
.,BA28 20 67 B8 JSR $B867       add (AY) to FAC1
.,BA2B 68       PLA             restore saved exponent
.,BA2C 20 59 BA JSR $BA59       multiply FAC1 by saved exponent
.,BA2F 20 0F BC JSR $BC0F       pack FAC1 into final result
.,BA32 60       RTS             return
```

## References
- "multiply_divide_and_convert_routines" — covers multiplication/division and FAC unpack/pack helpers used by LOG()
- "constants_sqr_exp_series_and_series_evaluation" — expands on series evaluation framework and shared series/constants used by LOG/EXP/SIN/COS