# C64 ROM: Trigonometric routines (COS/SIN/TAN/ATN) — disassembly and tables

**Summary:** Disassembly of Commodore 64 KERNAL/ROM trig entry points for COS, SIN, TAN, ATN (addresses $E264–$E33D). Shows call flow through helper routines ($B867, $BC0C, $BB07, $BFB4, $B850, etc.), use of FAC1/FAC2, rounding/INT steps, packing/unpacking, and embedded floating constants/series tables for SIN/COS and ATN.

## Overview
This chunk documents the ROM entries and call sequences used to compute COS(), SIN(), TAN(), and ATN() on the C64 floating-point system (FAC1/FAC2 model). Key behaviors:

- COS entry at $E264: adds the stored constant pi/2 to FAC1 via add (AY) helper.
- SIN entry at $E26B: sequence performs rounding/copy FAC1→FAC2, modular reduction by 2*pi, INT() adjustments, quadrant reduction using 0.25 and 0.5 constants, conditional sign flips, then jumps to square-and-series evaluation.
- TAN entry at $E2B4: packs FAC1, calls SIN sequence, repacks/unpacks and divides to compute tan = sin/cos.
- ATN entry at $E30E: normalizes sign/exponent, if |x|≥1 computes reciprocal before series, otherwise directly runs series evaluation and then post-processes to adjust sign and return value (may subtract from pi/2 when |x|≥1).
- Series constants and tables for SIN/COS and ATN are embedded immediately after routines (floats shown and a series counter).

The code relies heavily on shared helpers:
- Rounding/copy: JSR $BC0C
- Division: JSR $BB07 (divide by (AY), X=sign)
- INT(): JSR $BCCC
- Unary negate: JSR $BFB4 (do - FAC1)
- Add/subtract memory (AY) to/from FAC1: JSR $B867 (add (AY)), $B850 (FAC1 from (AY)), $B853 (FAC2 from FAC1)
- Pack/unpack helpers: JSR $BBCA, $E0F6, $BBA2, $BB0F
- Series evaluation entry (square then evaluate): JSR $E043

Data/flags used by the routines (from code usage):
- $6E — FAC2 sign read
- $6F — sign-compare flag cleared
- $66 — FAC1 sign (b7)
- $12 — comparison evaluation flag (toggled/checked)
- $61 — FAC1 exponent
- $57, $4E — temporary locations used by TAN pack/unpack flow
- Series and constant pointers are loaded via immediate loads to A/Y (low/high bytes) pointing into the embedded tables.

Behavioral notes preserved from source:
- Quadrant reduction uses 0.25 and 0.5 constants and toggles a comparison flag when necessary.
- ATN uses a reciprocal (convert AY and do (AY)/FAC1) when FAC1 exponent indicates |x|≥1, then performs the ATN series and conditionally subtracts result from pi/2.
- Series counters stored as single bytes preceding coefficient blocks.

## Source Code
```asm
                                *** perform COS()
.,E264 A9 E0    LDA #$E0        set pi/2 pointer low byte
.,E266 A0 E2    LDY #$E2        set pi/2 pointer high byte
.,E268 20 67 B8 JSR $B867       add (AY) to FAC1

                                *** perform SIN()
.,E26B 20 0C BC JSR $BC0C       round and copy FAC1 to FAC2
.,E26E A9 E5    LDA #$E5        set 2*pi pointer low byte
.,E270 A0 E2    LDY #$E2        set 2*pi pointer high byte
.,E272 A6 6E    LDX $6E         get FAC2 sign (b7)
.,E274 20 07 BB JSR $BB07       divide by (AY) (X=sign)
.,E277 20 0C BC JSR $BC0C       round and copy FAC1 to FAC2
.,E27A 20 CC BC JSR $BCCC       perform INT()
.,E27D A9 00    LDA #$00        clear byte
.,E27F 85 6F    STA $6F         clear sign compare (FAC1 EOR FAC2)
.,E281 20 53 B8 JSR $B853       perform subtraction, FAC2 from FAC1
.,E284 A9 EA    LDA #$EA        set 0.25 pointer low byte
.,E286 A0 E2    LDY #$E2        set 0.25 pointer high byte
.,E288 20 50 B8 JSR $B850       perform subtraction, FAC1 from (AY)
.,E28B A5 66    LDA $66         get FAC1 sign (b7)
.,E28D 48       PHA             save FAC1 sign
.,E28E 10 0D    BPL $E29D       branch if +ve
                                FAC1 sign was -ve
.,E290 20 49 B8 JSR $B849       add 0.5 to FAC1 (round FAC1)
.,E293 A5 66    LDA $66         get FAC1 sign (b7)
.,E295 30 09    BMI $E2A0       branch if -ve
.,E297 A5 12    LDA $12         get the comparison evaluation flag
.,E299 49 FF    EOR #$FF        toggle flag
.,E29B 85 12    STA $12         save the comparison evaluation flag
.,E29D 20 B4 BF JSR $BFB4       do - FAC1
.,E2A0 A9 EA    LDA #$EA        set 0.25 pointer low byte
.,E2A2 A0 E2    LDY #$E2        set 0.25 pointer high byte
.,E2A4 20 67 B8 JSR $B867       add (AY) to FAC1
.,E2A7 68       PLA             restore FAC1 sign
.,E2A8 10 03    BPL $E2AD       branch if was +ve
                                else correct FAC1
.,E2AA 20 B4 BF JSR $BFB4       do - FAC1
.,E2AD A9 EF    LDA #$EF        set pointer low byte to counter
.,E2AF A0 E2    LDY #$E2        set pointer high byte to counter
.,E2B1 4C 43 E0 JMP $E043       ^2 then series evaluation and return

                                *** perform TAN()
.,E2B4 20 CA BB JSR $BBCA       pack FAC1 into $57
.,E2B7 A9 00    LDA #$00        clear A
.,E2B9 85 12    STA $12         clear the comparison evaluation flag
.,E2BB 20 6B E2 JSR $E26B       perform SIN()
.,E2BE A2 4E    LDX #$4E        set sin(n) pointer low byte
.,E2C0 A0 00    LDY #$00        set sin(n) pointer high byte
.,E2C2 20 F6 E0 JSR $E0F6       pack FAC1 into (XY)
.,E2C5 A9 57    LDA #$57        set n pointer low byte
.,E2C7 A0 00    LDY #$00        set n pointer high byte
.,E2C9 20 A2 BB JSR $BBA2       unpack memory (AY) into FAC1
.,E2CC A9 00    LDA #$00        clear byte
.,E2CE 85 66    STA $66         clear FAC1 sign (b7)
.,E2D0 A5 12    LDA $12         get the comparison evaluation flag
.,E2D2 20 DC E2 JSR $E2DC       save flag and go do series evaluation
.,E2D5 A9 4E    LDA #$4E        set sin(n) pointer low byte
.,E2D7 A0 00    LDY #$00        set sin(n) pointer high byte
.,E2D9 4C 0F BB JMP $BB0F       convert AY and do (AY)/FAC1

                                *** save comparison flag and do series evaluation
.,E2DC 48       PHA             save comparison flag
.,E2DD 4C 9D E2 JMP $E29D       add 0.25, ^2 then series evaluation

                                *** constants and series for SIN/COS(n)
.:E2E0 81 49 0F DA A2           1.570796371, pi/2, as floating number
.:E2E5 83 49 0F DA A2           6.28319, 2*pi, as floating number
.:E2EA 7F 00 00 00 00           0.25
.:E2EF 05                       series counter
.:E2F0 84 E6 1A 2D 1B           -14.3813907
.:E2F5 86 28 07 FB F8            42.0077971
.:E2FA 87 99 68 89 01           -76.7041703
.:E2FF 87 23 35 DF E1            81.6052237
.:E304 86 A5 5D E7 28           -41.3147021
.:E309 83 49 0F DA A2             6.28318531   2*pi

                                *** perform ATN()
.,E30E A5 66    LDA $66         get FAC1 sign (b7)
.,E310 48       PHA             save sign
.,E311 10 03    BPL $E316       branch if +ve
.,E313 20 B4 BF JSR $BFB4       else do - FAC1
.,E316 A5 61    LDA $61         get FAC1 exponent
.,E318 48       PHA             push exponent
.,E319 C9 81    CMP #$81        compare with 1
.,E31B 90 07    BCC $E324       branch if FAC1 < 1
.,E31D A9 BC    LDA #$BC        pointer to 1 low byte
.,E31F A0 B9    LDY #$B9        pointer to 1 high byte
.,E321 20 0F BB JSR $BB0F       convert AY and do (AY)/FAC1
.,E324 A9 3E    LDA #$3E        pointer to series low byte
.,E326 A0 E3    LDY #$E3        pointer to series high byte
.,E328 20 43 E0 JSR $E043       ^2 then series evaluation
.,E32B 68       PLA             restore old FAC1 exponent
.,E32C C9 81    CMP #$81        CMP #$81        compare with 1
.,E32E 90 07    BCC $E337       branch if FAC1 < 1
.,E330 A9 E0    LDA #$E0        pointer to (pi/2) low byte
.,E332 A0 E2    LDY #$E2        pointer to (pi/2) low byte
.,E334 20 50 B8 JSR $B850       perform subtraction, FAC1 from (AY)
.,E337 68       PLA             restore FAC1 sign
.,E338 10 03    BPL $E33D       exit if was +ve
.,E33A 4C B4 BF JMP $BFB4       else do - FAC1 and return
.,E33D 60       RTS             

                                *** series for ATN(n)
.:E33E 0B                       series counter
.:E33F 76 B3 83 BD D3           -6.84793912E-04
.:E344 79 1E F4 A6 F5            4.85094216E-03
.:E349 7B 83 FC B0 10            -.0161117015
.:E34E 7C 0C 1F 67 CA             .034209638
.:E353 7C DE 53 CB C1            -.054279133
.:E358 7D 14 64 70 4C             .0724571965
.:E35D 7D B7 EA 51 7A            -.0898019185
.:E362 7D 63 30 88 7E             .110932413
.:E367 7E 92 44 99 3A            -.142839808
.:E36C 7E 4C CC 91 C7             .19999912
.:E371 7F AA AA AA 13            -.333333316
.:E376 81 00 00 00 00            1
```

## References
- "constants_sqr_exp_series_and_series_evaluation" — expands on shared series-evaluation code and constants used by trig/exp/log routines
- "multiply_divide_and_accumulator_algorithms" — expands on multiply/divide primitives used by series operations

## Labels
- COS
- SIN
- TAN
- ATN
